/* global require, process, module */
'use strict';

const cors = require('cors');

function buildCors() {
  // Build allowed origins from env + always allow localhost dev origins
  const rawOrigins = process.env.ALLOWED_ORIGINS || '';
  const ALLOWED = [
    ...rawOrigins.split(',').map(o => o.trim()).filter(Boolean),
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ];

  const middleware = cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (ALLOWED.includes(origin)) return cb(null, true);
      const err = new Error(`CORS policy: origin '${origin}' is not allowed.`);
      err.status = 403;
      return cb(err);
    },
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  });

  return { corsMiddleware: middleware, ALLOWED };
}

module.exports = buildCors();
