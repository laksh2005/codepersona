const Journey = require('../models/Journey');
const { generateNarrative } = require('../utils/aiUtils');

async function processAndSaveJourney(username, profileData, reposData, languagesData) {
  try {
    const profile = extractProfile(profileData);
    const repos = extractRepos(reposData || []);
    const languages = processLanguages(languagesData || {});
    const stats = calculateStats(repos);
    stats.timeline = buildTimeline(repos);
    stats.tech_evolution = buildTechEvolution(stats.timeline);
    stats.achievements = detectAchievements(profileData, repos, languages);
    stats.journey_start = repos.length > 0 ? repos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0].created_at : profileData.created_at;
    stats.years_coding = calculateYearsCoding(stats.journey_start);
    stats.most_productive_year = findMostProductiveYear(stats.timeline);
    
    // Generate AI narration with error handling - don't let it break the whole process
    let ai_narration = '';
    try {
      ai_narration = await generateNarrative({ username, profile, stats, timeline: stats.timeline, tech_evolution: stats.tech_evolution });
    } catch (aiError) {
      console.error('AI narration generation failed, continuing without it:', aiError.message);
      ai_narration = `The coding journey of ${profile.name || username} showcases their dedication to software development.`;
    }
    
    const journey = await Journey.findOneAndUpdate(
      { github_id: username.toLowerCase() },
      { github_id: username.toLowerCase(), profile, repos, languages, stats, ai_narration, last_updated: new Date(), $inc: { update_count: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return journey;
  } catch (error) {
    console.error('Error processing journey:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

function extractProfile(raw) {
  return { login: raw.login, name: raw.name, avatar_url: raw.avatar_url, bio: raw.bio, location: raw.location, blog: raw.blog, twitter_username: raw.twitter_username, company: raw.company, email: raw.email, hireable: raw.hireable, public_repos: raw.public_repos, public_gists: raw.public_gists, followers: raw.followers, following: raw.following, created_at: raw.created_at, updated_at: raw.updated_at, html_url: raw.html_url, type: raw.type };
}

function extractRepos(rawRepos) {
  return rawRepos.map(repo => ({ name: repo.name, full_name: repo.full_name, description: repo.description, html_url: repo.html_url, stargazers_count: repo.stargazers_count, forks_count: repo.forks_count, watchers_count: repo.watchers_count, language: repo.language, created_at: repo.created_at, updated_at: repo.updated_at, pushed_at: repo.pushed_at, size: repo.size, default_branch: repo.default_branch, topics: repo.topics || [], visibility: repo.visibility, is_fork: repo.fork, fork: repo.fork }));
}

function processLanguages(langTotals) {
  const total = Object.values(langTotals).reduce((sum, bytes) => sum + bytes, 0);
  if (total === 0) return { raw_bytes: new Map(), percentages: new Map(), top_5: [] };
  const percentages = new Map();
  for (const [lang, bytes] of Object.entries(langTotals)) percentages.set(lang, Math.round((bytes / total) * 100));
  const top_5 = Object.entries(langTotals).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, bytes]) => ({ name, bytes, percentage: Math.round((bytes / total) * 100) }));
  return { raw_bytes: new Map(Object.entries(langTotals)), percentages, top_5 };
}

function calculateStats(repos) {
  const originalRepos = repos.filter(r => !r.fork);
  return { total_stars: repos.reduce((sum, r) => sum + r.stargazers_count, 0), total_forks: repos.reduce((sum, r) => sum + r.forks_count, 0), total_repos: repos.length, original_repos: originalRepos.length, top_repos: repos.filter(r => !r.fork).sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 10).map(r => ({ name: r.name, stars: r.stargazers_count, forks: r.forks_count, language: r.language, url: r.html_url, description: r.description, created_at: r.created_at })) };
}

function buildTimeline(repos) {
  const timelineMap = {};
  repos.forEach(repo => {
    if (repo.fork) return;
    const year = new Date(repo.created_at).getFullYear();
    if (!timelineMap[year]) timelineMap[year] = { year, repos_created: 0, languages_used: new Set(), notable_repos: [], total_stars_earned: 0 };
    timelineMap[year].repos_created++;
    timelineMap[year].total_stars_earned += repo.stargazers_count;
    if (repo.language) timelineMap[year].languages_used.add(repo.language);
    if (repo.stargazers_count > 5 || repo.forks_count > 2) timelineMap[year].notable_repos.push(repo.name);
  });
  return Object.values(timelineMap).map(t => ({ ...t, languages_used: Array.from(t.languages_used) })).sort((a, b) => a.year - b.year);
}

function buildTechEvolution(timeline) {
  const seenLanguages = new Set();
  return timeline.map(t => { const newLanguages = t.languages_used.filter(lang => !seenLanguages.has(lang)); newLanguages.forEach(lang => seenLanguages.add(lang)); return { year: t.year, primary_languages: t.languages_used.slice(0, 3), new_languages: newLanguages }; });
}

function detectAchievements(profile, repos, languages) {
  const achievements = [];
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const originalRepos = repos.filter(r => !r.fork);
  if (totalStars >= 10) achievements.push({ title: '⭐ 10+ GitHub Stars', icon: '⭐', achieved_at: new Date() });
  if (totalStars >= 50) achievements.push({ title: '🌟 50+ GitHub Stars', icon: '🌟', achieved_at: new Date() });
  if (totalStars >= 100) achievements.push({ title: '💫 100+ GitHub Stars', icon: '💫', achieved_at: new Date() });
  if (originalRepos.length >= 5) achievements.push({ title: '🏗️ Built 5+ Projects', icon: '🏗️', achieved_at: new Date() });
  if (originalRepos.length >= 20) achievements.push({ title: '🚀 Built 20+ Projects', icon: '🚀', achieved_at: new Date() });
  if (originalRepos.length >= 50) achievements.push({ title: '🎯 Built 50+ Projects', icon: '🎯', achieved_at: new Date() });
  if (profile.followers >= 10) achievements.push({ title: '👥 10+ Followers', icon: '👥', achieved_at: new Date() });
  if (profile.followers >= 50) achievements.push({ title: '🎉 50+ Followers', icon: '🎉', achieved_at: new Date() });
  const langCount = languages.top_5 ? languages.top_5.length : 0;
  if (langCount >= 3) achievements.push({ title: '🌐 Polyglot Coder (3+ Languages)', icon: '🌐', achieved_at: new Date() });
  if (langCount >= 5) achievements.push({ title: '🧙 Master of Many Languages (5+)', icon: '🧙', achieved_at: new Date() });
  const accountAge = calculateYearsCoding(profile.created_at);
  if (accountAge >= 2) achievements.push({ title: '🎂 2 Years on GitHub', icon: '🎂', achieved_at: new Date() });
  if (accountAge >= 5) achievements.push({ title: '🏆 5 Years on GitHub', icon: '🏆', achieved_at: new Date() });
  return achievements;
}

function calculateYearsCoding(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor((now - start) / (365.25 * 24 * 60 * 60 * 1000));
}

function findMostProductiveYear(timeline) {
  if (timeline.length === 0) return new Date().getFullYear();
  return timeline.reduce((max, curr) => curr.repos_created > max.repos_created ? curr : max).year;
}

module.exports = { processAndSaveJourney };
