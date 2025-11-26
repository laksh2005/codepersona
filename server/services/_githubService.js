const axios = require('axios');

function getAuthHeaders() {
  const token = process.env.GITHUB_TOKEN || '';
  // Only use token if it's provided and looks valid (not empty/whitespace)
  if (token && token.trim()) {
    return { Authorization: `token ${token.trim()}` };
  }
  return {};
}

async function fetchFromGitHub(path, params = {}) {
  const url = `https://api.github.com${path}`;
  const headers = { 'User-Agent': 'github-journey', ...getAuthHeaders() };
  
  try {
    const res = await axios.get(url, { headers, params });
    return res.data;
  } catch (error) {
    // If we get 401 with a token, try again without token (fallback to unauthenticated)
    if (error.response?.status === 401 && getAuthHeaders().Authorization) {
      console.warn('GitHub token invalid, falling back to unauthenticated requests');
      const unauthenticatedHeaders = { 'User-Agent': 'github-journey' };
      const res = await axios.get(url, { headers: unauthenticatedHeaders, params });
      return res.data;
    }
    // Re-throw other errors
    throw error;
  }
}

async function getProfile(username) {
  return fetchFromGitHub(`/users/${encodeURIComponent(username)}`);
}

async function getRepos(username, per_page = 100) {
  return fetchFromGitHub(`/users/${encodeURIComponent(username)}/repos`, { per_page });
}

async function getRepoLanguages(owner, repo) {
  return fetchFromGitHub(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`);
}

async function getSummary(username) {
  const profile = await getProfile(username);
  const repos = await getRepos(username, 100);
  const langTotals = {};
  for (const r of repos) {
    try {
      const langs = await getRepoLanguages(username, r.name);
      for (const [lang, bytes] of Object.entries(langs || {})) {
        langTotals[lang] = (langTotals[lang] || 0) + bytes;
      }
    } catch (e) {
      // ignore per-repo errors
    }
  }
  return { profile, repos, languages: langTotals };
}

module.exports = { getProfile, getRepos, getRepoLanguages, getSummary };
