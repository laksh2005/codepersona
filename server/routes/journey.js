const express = require('express');
const router = express.Router();
const githubService = require('../services/_githubService');
const { processAndSaveJourney } = require('../services/_journeyProcessor');
const Journey = require('../models/Journey');

router.get('/:username', async (req, res) => {
  const { username } = req.params;
  const { force_refresh } = req.query;
  try {
    if (!force_refresh) {
      const existing = await Journey.findOne({ github_id: username.toLowerCase() });
      if (existing) {
        const hoursSinceUpdate = (Date.now() - existing.last_updated) / (1000 * 60 * 60);
        if (hoursSinceUpdate < 24) {
          return res.json({
            journey: existing,
            cached: true,
            last_updated: existing.last_updated
          });
        }
      }
    }
    const [profile, repos, summary] = await Promise.all([
      githubService.getProfile(username),
      githubService.getRepos(username),
      githubService.getSummary(username)
    ]);
    if (typeof processAndSaveJourney !== 'function') {
      throw new Error('processAndSaveJourney is not available from _journeyProcessor');
    }
    const journey = await processAndSaveJourney(username, profile, repos, summary.languages);
    res.json({
      journey,
      cached: false,
      last_updated: journey.last_updated
    });
  } catch (err) {
    console.error('Journey error:', err);
    console.error('Error stack:', err.stack);
    
    // Provide more user-friendly error messages
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (err.response) {
      // GitHub API error
      if (err.response.status === 404) {
        errorMessage = `GitHub user "${username}" not found`;
        statusCode = 404;
      } else if (err.response.status === 403) {
        errorMessage = 'GitHub API rate limit exceeded. Please try again later.';
        statusCode = 429;
      } else if (err.response.status === 401) {
        errorMessage = 'GitHub authentication failed. Please check your GitHub token.';
        statusCode = 401;
      } else {
        errorMessage = err.response.data?.message || `GitHub API error: ${err.response.status}`;
        statusCode = err.response.status;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    res.status(statusCode).json({ error: errorMessage });
  }
});

module.exports = router;

router.get('/_debug/check', (req, res) => {
  res.json({ hasProcessor: typeof processAndSaveJourney === 'function', type: typeof processAndSaveJourney });
});

