/* global module, console */
'use strict';

// 404 — no route matched
function notFound(req, res) {
  res.status(404).json({
    error:   'Not Found',
    message: `Route ${req.method} ${req.path} does not exist.`,
    hint:    'See GET / for available routes.',
  });
}

// Global error handler — must have 4 params for Express to treat it as error middleware
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status  = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Only log 5xx errors — 4xx are expected client errors
  if (status >= 500) {
    console.error(`[${new Date().toISOString()}] ERROR ${status}:`, message);
  }

  res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };
