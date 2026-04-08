/* global require, module, console */
'use strict';

const router  = require('express').Router();
const fetch   = require('node-fetch');
const ML_DATA = require('../data/mlData');

// Fetch with abort timeout so we never hang on slow external APIs
async function fetchWithTimeout(url, ms = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

// GET /api/live-aqi?lat=17.729&lon=83.315
router.get('/live-aqi', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);

  // Validate
  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return res.status(400).json({
      error:   'Invalid coordinates',
      message: 'lat must be -90..90 and lon must be -180..180',
    });
  }

  try {
    const [wxRes, aqiRes] = await Promise.all([
      fetchWithTimeout(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`
      ),
      fetchWithTimeout(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`
      ),
    ]);

    const [wxData, aqiData] = await Promise.all([wxRes.json(), aqiRes.json()]);

    const wind  = wxData.current?.wind_speed_10m  ?? 8;
    const temp  = wxData.current?.temperature_2m  ?? 28;
    const usAqi = aqiData.current?.us_aqi         || 85;

    return res.json({
      aqi:    usAqi,
      wind:   Number(wind).toFixed(1),
      temp:   Number(temp).toFixed(1),
      source: 'satellite',
    });
  } catch (err) {
    console.warn(`[live-aqi] External API unavailable: ${err.message} — using fallback`);
    const fallback = ML_DATA.monthly_trend[ML_DATA.monthly_trend.length - 1].avg_aqi;
    return res.json({ aqi: fallback, wind: '—', temp: '—', source: 'fallback' });
  }
});

module.exports = router;
