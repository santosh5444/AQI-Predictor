/* global require, process, console, __dirname */
'use strict';

// Load .env before anything else — explicit path prevents dotenvx interference
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), override: false });

const express      = require('express');
const helmet       = require('helmet');
const { corsMiddleware, ALLOWED } = require('./middleware/cors');
const { notFound, errorHandler }  = require('./middleware/errorHandler');
const dataRoutes   = require('./routes/data');
const liveAqiRoute = require('./routes/liveAqi');
const aiInsight    = require('./routes/aiInsight');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Core middleware ───────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(corsMiddleware);
app.use(express.json());

// ─── Root route — fixes "Cannot GET /" ────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status:  'ok',
    service: 'AQI Intelligence Dashboard API',
    version: '1.0.0',
    endpoints: {
      health:     'GET /api/health',
      data:       'GET /api/data',
      liveAqi:    'GET /api/live-aqi?lat={lat}&lon={lon}',
      aiInsight:  'GET /api/ai-insight?type=root_cause|forecast|health|spikes',
    },
  });
});

// ─── API routes ────────────────────────────────────────────────────────────────
app.use('/api', dataRoutes);
app.use('/api', liveAqiRoute);
app.use('/api', aiInsight);

// ─── 404 + error handlers (must be last) ──────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅  AQI API running on port ${PORT}`);
  console.log(`    ENV:     ${process.env.NODE_ENV || 'development'}`);
  console.log(`    Origins: ${ALLOWED.join(', ')}`);
});

// ─── Prevent silent crashes on Render ─────────────────────────────────────────
process.on('uncaughtException',  err => console.error('[uncaughtException]',  err.message));
process.on('unhandledRejection', err => console.error('[unhandledRejection]', err));
