const express = require('express');
const router = express.Router();
const githubService = require('../services/_githubService');

function extractUsername(req) {
  return req.params.username || req.query.username || req.headers.username;
}

function extractUsername(req) {
  return req.params && req.params.username ? req.params.username : (req.query.username || req.headers.username);
}

function handleError(res, err) {
  const status = err && err.response && err.response.status ? err.response.status : 500;
  const message = err && err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : (err && err.message) || 'Unknown error';
  res.status(status).json({ error: message });
}

async function profileHandler(req, res) {
  const username = extractUsername(req);
  if (!username || username === '{username}') return res.status(400).json({ error: 'username is required as path param, query or header' });
  try {
    const data = await githubService.getProfile(username);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}

async function reposHandler(req, res) {
  const username = extractUsername(req);
  if (!username || username === '{username}') return res.status(400).json({ error: 'username is required as path param, query or header' });
  try {
    const data = await githubService.getRepos(username);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}

async function summaryHandler(req, res) {
  const username = extractUsername(req);
  if (!username || username === '{username}') return res.status(400).json({ error: 'username is required as path param, query or header' });
  try {
    const data = await githubService.getSummary(username);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}

router.get('/profile/:username', profileHandler);
router.get('/profile', profileHandler);

router.get('/repos/:username', reposHandler);
router.get('/repos', reposHandler);

router.get('/summary/:username', summaryHandler);
router.get('/summary', summaryHandler);

module.exports = router;
