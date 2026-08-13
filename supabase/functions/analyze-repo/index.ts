import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, repoName } = await req.json();
    
    if (!username || !repoName) {
      throw new Error("Username and repoName are required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for existing cached analysis
    const { data: existingAnalysis } = await supabase
      .from("repo_analyses")
      .select("*")
      .eq("github_username", username.toLowerCase())
      .eq("repo_name", repoName)
      .single();

    // If we have a recent analysis (less than 24 hours old), return it
    if (existingAnalysis) {
      const updatedAt = new Date(existingAnalysis.updated_at);
      const now = new Date();
      const hoursDiff = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        return new Response(JSON.stringify({
          ai_summary: existingAnalysis.ai_summary,
          maturity_score: existingAnalysis.maturity_score,
          complexity_score: existingAnalysis.complexity_score,
          improvement_suggestions: existingAnalysis.improvement_suggestions,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Fetch repo details from GitHub
    const repoResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
      headers: { "Accept": "application/vnd.github.v3+json" },
    });

    if (!repoResponse.ok) {
      throw new Error(`Repository not found: ${username}/${repoName}`);
    }

    const repo = await repoResponse.json();

    // Try to fetch README
    let readmeContent = "";
    try {
      const readmeResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`, {
        headers: { "Accept": "application/vnd.github.v3+json" },
      });
      if (readmeResponse.ok) {
        const readmeData = await readmeResponse.json();
        readmeContent = atob(readmeData.content);
      }
    } catch {
      readmeContent = "No README available";
    }

    // Fetch languages
    const languagesResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`, {
      headers: { "Accept": "application/vnd.github.v3+json" },
    });
    const languages = languagesResponse.ok ? await languagesResponse.json() : {};

    // Generate AI analysis
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const prompt = `Analyze this GitHub repository in depth:

Repository: ${repo.name}
Description: ${repo.description || "No description"}
Language: ${repo.language || "Unknown"}
Stars: ${repo.stargazers_count}
Forks: ${repo.forks_count}
Size: ${repo.size} KB
Created: ${repo.created_at}
Last Updated: ${repo.updated_at}
Topics: ${(repo.topics || []).join(", ") || "None"}
Open Issues: ${repo.open_issues_count}
Has Wiki: ${repo.has_wiki}
License: ${repo.license?.name || "No license"}

Languages Used:
${Object.entries(languages).map(([lang, bytes]) => `- ${lang}: ${bytes} bytes`).join("\n")}

README (first 2000 chars):
${readmeContent.slice(0, 2000)}

Provide a detailed analysis in the following JSON format:
{
  "summary": "A 2-3 sentence summary of what this project is, its purpose, and its significance. Focus on the 'why' not just the 'what'.",
  "maturityScore": 0-100 score based on: documentation quality, project structure, commit history indicators, presence of tests, CI/CD, proper licensing, etc.,
  "complexityScore": 0-100 score based on: number of languages, size, architecture indicators from README, dependencies implied, etc.,
  "improvementSuggestions": ["Array of 3-5 specific, actionable suggestions to improve this project"]
}

Be insightful and specific. The scores should be justified by the evidence, and suggestions should be practical.

You are an expert code reviewer and software architect. Always respond with valid JSON only, no markdown.`;

    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("Gemini API error:", aiResponse.status, errorText);
      throw new Error(`Failed to generate AI analysis: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    
    // Handle Gemini API response structure
    if (!aiData.candidates || !aiData.candidates[0] || !aiData.candidates[0].content) {
      console.error("Unexpected Gemini API response structure:", JSON.stringify(aiData));
      throw new Error("Invalid response from Gemini API");
    }
    
    const parts = aiData.candidates[0].content.parts;
    if (!parts || !parts[0] || !parts[0].text) {
      console.error("Unexpected Gemini API response structure - missing text:", JSON.stringify(aiData));
      throw new Error("Invalid response from Gemini API - missing text content");
    }
    
    let aiContent = parts[0].text;
    
    // Clean up the response
    aiContent = aiContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    let aiResult;
    try {
      aiResult = JSON.parse(aiContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiContent);
      throw new Error("Failed to parse AI response");
    }

    // Save to database
    const analysisData = {
      github_username: username.toLowerCase(),
      repo_name: repoName,
      ai_summary: aiResult.summary,
      maturity_score: aiResult.maturityScore,
      complexity_score: aiResult.complexityScore,
      improvement_suggestions: aiResult.improvementSuggestions,
    };

    if (existingAnalysis) {
      await supabase
        .from("repo_analyses")
        .update(analysisData)
        .eq("github_username", username.toLowerCase())
        .eq("repo_name", repoName);
    } else {
      await supabase
        .from("repo_analyses")
        .insert(analysisData);
    }

    return new Response(JSON.stringify({
      ai_summary: aiResult.summary,
      maturity_score: aiResult.maturityScore,
      complexity_score: aiResult.complexityScore,
      improvement_suggestions: aiResult.improvementSuggestions,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error in analyze-repo:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
