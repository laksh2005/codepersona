import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  location: string;
  company: string;
  blog: string;
}

interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  topics: string[];
  size: number;
  fork: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();
    
    if (!username) {
      throw new Error("Username is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for existing cached data
    const { data: existingJourney } = await supabase
      .from("github_journeys")
      .select("*")
      .eq("github_username", username.toLowerCase())
      .single();

    // Fetch GitHub data with authentication to avoid rate limits
    const githubToken = Deno.env.get("GITHUB_TOKEN");
    const githubHeaders: Record<string, string> = {
      "Accept": "application/vnd.github.v3+json",
    };
    if (githubToken) {
      githubHeaders["Authorization"] = `Bearer ${githubToken}`;
    }

    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: githubHeaders,
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
        headers: githubHeaders,
      }),
    ]);

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        return new Response(JSON.stringify({ 
          error: `GitHub user "${username}" not found. Please check the username and try again.`,
          errorType: "USER_NOT_FOUND"
        }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`GitHub API error: ${userResponse.status}`);
    }

    const user: GitHubUser = await userResponse.json();
    const repos: GitHubRepo[] = await reposResponse.json();

    // Filter out forks and get only original repos
    const originalRepos = repos.filter(r => !r.fork);

    // Fetch last 12 months of contributions using GitHub GraphQL API
    let totalCommits = 0;
    const years: Array<{ year: number; contributions: number }> = [];
    
    try {
      // Query GraphQL API for last 12 months (default behavior)
      const graphqlHeaders = {
        ...githubHeaders,
        "Content-Type": "application/json",
      };
      
      // If we have a token, use GraphQL endpoint
      if (githubToken) {
        const graphqlQuery = {
          query: `
            query($login: String!) {
              user(login: $login) {
                contributionsCollection {
                  contributionCalendar {
                    totalContributions
                    weeks {
                      contributionDays {
                        contributionCount
                        date
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: {
            login: username,
          },
        };
        
        const graphqlResponse = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: graphqlHeaders,
          body: JSON.stringify(graphqlQuery),
        });
        
        if (graphqlResponse.ok) {
          const graphqlData = await graphqlResponse.json();
          
          // Check for GraphQL errors
          if (graphqlData.errors) {
            console.error("GraphQL errors:", graphqlData.errors);
          } else if (graphqlData.data?.user?.contributionsCollection?.contributionCalendar) {
            const calendar = graphqlData.data.user.contributionsCollection.contributionCalendar;
            totalCommits = calendar.totalContributions || 0;
            
            // Group contributions by year from the weeks data
            const contributionsByYear: Record<number, number> = {};
            
            if (calendar.weeks) {
              calendar.weeks.forEach((week: any) => {
                week.contributionDays.forEach((day: any) => {
                  if (day.date && day.contributionCount > 0) {
                    const year = new Date(day.date).getFullYear();
                    contributionsByYear[year] = (contributionsByYear[year] || 0) + day.contributionCount;
                  }
                });
              });
            }
            
            // Convert to array format
            Object.entries(contributionsByYear).forEach(([year, count]) => {
              years.push({ year: parseInt(year), contributions: count });
            });
            
            // Sort by year
            years.sort((a, b) => a.year - b.year);
          }
        } else {
          const errorText = await graphqlResponse.text();
          console.error("GraphQL API error:", graphqlResponse.status, errorText);
        }
      }
      
      // If no data from GraphQL, use fallback
      if (totalCommits === 0 && years.length === 0) {
        // Fallback: rough estimate based on repos
        totalCommits = originalRepos.length * 30;
        const currentYear = new Date().getFullYear();
        years.push({ year: currentYear, contributions: totalCommits });
      }
    } catch (error) {
      console.error("Error fetching contribution data:", error);
      // Fallback: rough estimate
      totalCommits = originalRepos.length * 30;
      const currentYear = new Date().getFullYear();
      years.push({ year: currentYear, contributions: totalCommits });
    }

    // Calculate language distribution
    const languages: Record<string, number> = {};
    originalRepos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    // Create a hash of the current state to check if we need to regenerate
    const currentHash = JSON.stringify({
      repoCount: originalRepos.length,
      lastUpdate: originalRepos[0]?.updated_at,
      languages: Object.keys(languages).sort(),
    });

    const github_data = {
      user: {
        name: user.name,
        bio: user.bio,
        avatar_url: user.avatar_url,
        followers: user.followers,
        following: user.following,
        public_repos: user.public_repos,
        created_at: user.created_at,
        location: user.location,
        company: user.company,
        blog: user.blog,
      },
      repos: originalRepos.map(r => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        created_at: r.created_at,
        updated_at: r.updated_at,
        topics: r.topics || [],
        size: r.size,
      })),
      languages,
      contributions: {
        total: totalCommits,
        years: years,
      },
    };

    // Check if we can use cached AI data
    if (existingJourney && existingJourney.last_github_hash === currentHash) {
      return new Response(JSON.stringify({
        github_username: username.toLowerCase(),
        github_data,
        ai_persona: existingJourney.ai_persona,
        ai_story: existingJourney.ai_story,
        ai_tech_evolution: existingJourney.ai_tech_evolution,
        ai_skills: existingJourney.ai_skills,
        ai_achievements: existingJourney.ai_achievements,
        ai_career_projection: existingJourney.ai_career_projection,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate AI interpretations
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `You are analyzing a GitHub developer profile. Based on the following data, generate a comprehensive AI interpretation of this developer's journey.

GitHub User: ${user.name || username}
Bio: ${user.bio || "Not provided"}
Joined: ${user.created_at}
Location: ${user.location || "Not provided"}
Company: ${user.company || "Not provided"}

Repositories (${originalRepos.length} original repos):
${originalRepos.slice(0, 30).map(r => `- ${r.name} (${r.language || "No language"}, created ${r.created_at.slice(0, 7)}, ${r.stargazers_count} stars): ${r.description || "No description"}`).join("\n")}

Language Distribution:
${Object.entries(languages).sort((a, b) => b[1] - a[1]).map(([lang, count]) => `- ${lang}: ${count} repos`).join("\n")}

Generate the following JSON structure with creative, insightful, and narrative interpretations (NOT raw stats):

{
  "persona": {
    "title": "A creative 3-5 word title like 'The Pragmatic Full-Stack Architect' or 'The Curious Systems Explorer'",
    "insights": ["Array of 3-4 deep insights about their coding style, patterns, and developer identity. Each should answer 'so what?' and explain meaning, not just stats."],
    "codingStyle": "A paragraph describing their coding style based on repo patterns, technologies, and project types."
  },
  "story": {
    "phases": [
      {
        "title": "Phase title like 'The Learning Phase' or 'The Breakthrough Era'",
        "period": "Time period like '2019-2020' or 'Early 2021'",
        "description": "Narrative description of what was happening in their developer journey during this phase",
        "keyRepos": ["Array of 1-3 repo names that were significant in this phase"],
        "significance": "Why this phase mattered in their overall growth"
      }
    ]
  },
  "techEvolution": {
    "phases": [
      {
        "period": "Time period",
        "focus": "What they were focused on (e.g., 'Frontend Exploration', 'Full-Stack Expansion')",
        "technologies": ["Key technologies during this phase"],
        "reasoning": "Why this transition happened and what it shows about their growth"
      }
    ]
  },
  "skills": {
    "skills": [
      {
        "name": "Skill name (e.g., 'Problem Solving', 'System Design', 'Frontend Mastery')",
        "score": 0-100 score,
        "reasoning": "Why this score, based on evidence from their repos"
      }
    ]
  },
  "achievements": {
    "badges": [
      {
        "name": "Badge name (e.g., 'System Thinker', 'Polyglot Explorer', 'Finisher')",
        "icon": "One of: trophy, zap, star, crown, code, globe, lightbulb, rocket, target, puzzle",
        "description": "What this badge means",
        "reasoning": "Why they earned this specific badge based on their profile",
        "rarity": "common, rare, or legendary"
      }
    ]
  },
  "careerProjection": {
    "futureSkills": ["3-5 skills they're likely to develop next"],
    "roleAlignment": "What role they're naturally aligned with (e.g., 'Senior Full-Stack Engineer', 'Platform Architect')",
    "learningPath": ["3-4 suggested learning steps based on their trajectory"],
    "prediction": "A 2-3 sentence narrative prediction about their likely career trajectory"
  }
}

Be creative, insightful, and narrative. Focus on the "why" and "so what", not just the "what". Make it feel like a personalized career documentary, not a stats dashboard. Include 3-5 phases for the story and tech evolution. Include 5-6 skills. Include 4-6 achievements with a mix of rarities.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an expert developer career analyst. Always respond with valid JSON only, no markdown." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      throw new Error("Failed to generate AI interpretation");
    }

    const aiData = await aiResponse.json();
    let aiContent = aiData.choices[0].message.content;
    
    // Clean up the response - remove markdown code blocks if present
    aiContent = aiContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    let aiResult;
    try {
      aiResult = JSON.parse(aiContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiContent);
      throw new Error("Failed to parse AI response");
    }

    // Save to database
    const journeyData = {
      github_username: username.toLowerCase(),
      github_data,
      ai_persona: aiResult.persona,
      ai_story: aiResult.story,
      ai_tech_evolution: aiResult.techEvolution,
      ai_skills: aiResult.skills,
      ai_achievements: aiResult.achievements,
      ai_career_projection: aiResult.careerProjection,
      last_github_hash: currentHash,
    };

    if (existingJourney) {
      await supabase
        .from("github_journeys")
        .update(journeyData)
        .eq("github_username", username.toLowerCase());
    } else {
      await supabase
        .from("github_journeys")
        .insert(journeyData);
    }

    return new Response(JSON.stringify(journeyData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error in github-journey:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
