/* global require, process, module */
'use strict';

const router  = require('express').Router();
const ML_DATA = require('../data/mlData');

// GET /api/health — Render uptime ping
router.get('/health', (req, res) => {
  res.json({
    status:    'ok',
    uptime:    process.uptime().toFixed(2) + 's',
    timestamp: new Date().toISOString(),
    env:       process.env.NODE_ENV || 'development',
  });
});

// GET /api/data — full ML dataset
router.get('/data', (req, res) => {
  res.json(ML_DATA);
});

module.exports = router;
