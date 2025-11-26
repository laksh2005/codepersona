require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function generateNarrative({ username, profile, stats, timeline, tech_evolution }) {
  // Build rich context for the narrative
  const topRepos = (stats.top_repos || []).slice(0, 5).map(r => ({
    name: r.name,
    stars: r.stargazers_count || 0,
    language: r.language,
    description: r.description
  }));

  const achievements = (stats.achievements || []).map(a => a.title);
  const yearsCoding = stats.years_coding || 0;
  const totalStars = stats.total_stars || 0;
  const originalRepos = stats.original_repos || 0;

  // Create fallback narrative
  const fallbackNarrative = `The coding journey of ${profile.name || username} began ${yearsCoding} years ago. Through ${originalRepos} projects and ${totalStars} stars, they've built an impressive portfolio. Their evolution through technologies shows a commitment to growth and learning. This is just the beginning of an exciting coding adventure!`;

  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set, using fallback narrative');
    return fallbackNarrative;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Create a detailed prompt with structured context
    const prompt = `You are a creative and inspiring storyteller. Write a compelling narrative about the coding journey of "${profile.name || username}" (GitHub: ${username}).

CONTEXT:
- Started coding: ${new Date(profile.created_at).toLocaleDateString()} (${yearsCoding} years ago)
- Total repositories: ${originalRepos} original projects
- Total stars earned: ${totalStars}
- Followers: ${profile.followers || 0}
- Bio: ${profile.bio || 'No bio provided'}

TECH EVOLUTION:
${tech_evolution && tech_evolution.length > 0 
  ? tech_evolution.map(ev => `  ${ev.year}: Learned ${ev.new_languages?.join(', ') || 'new technologies'}`).join('\n')
  : '  Learning and growing'}

TOP PROJECTS:
${topRepos.length > 0 
  ? topRepos.map(r => `  - ${r.name} (${r.language || 'Various'}): ${r.stars} stars - ${r.description || 'No description'}`).join('\n')
  : '  Building their portfolio'}

ACHIEVEMENTS:
${achievements.length > 0 
  ? achievements.map(a => `  - ${a}`).join('\n') 
  : '  - Building their coding journey'}

Write a 3-4 paragraph narrative that:
1. Starts with an engaging hook about their coding journey
2. Describes their evolution through technologies and projects
3. Highlights key milestones and achievements
4. Ends with an inspiring conclusion about their growth

Make it personal, engaging, and celebrate their coding journey. Use a warm, encouraging tone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    });

    // Access the text from the response
    const text = response.text;
    if (text && typeof text === 'string') {
      return text.trim();
    }
    
    console.warn('AI response did not contain text, using fallback');
    return fallbackNarrative;
  } catch (error) {
    console.error('AI generation error:', error.message || error);
    console.error('Error stack:', error.stack);
    // Return a fallback narrative if AI fails
    return fallbackNarrative;
  }
}

module.exports = { generateNarrative };
