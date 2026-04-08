/* global require, module */
'use strict';

const router  = require('express').Router();
const ML_DATA = require('../data/mlData');

const VALID_TYPES = ['root_cause', 'forecast', 'health', 'spikes'];

const INSIGHTS = {
  root_cause: `<strong>Why does the air get so bad?</strong><br><br>
Three things combine to create the worst pollution days:<br><br>
1️⃣ <strong>RINL Steel Plant &amp; HPCL Refinery</strong> — these giant factories release smoke and gases 24/7. On high-production days, the emissions spike dramatically.<br><br>
2️⃣ <strong>Winter "lid" effect</strong> — in December–February, warm air sits on top of cold air near the ground, trapping all the pollution below like a lid on a pot. Nothing can escape.<br><br>
3️⃣ <strong>Farmers burning rice stubble</strong> — every October–November, farmers across Andhra Pradesh burn leftover crop stalks. The smoke travels for hundreds of kilometres and adds heavily to the city's pollution.`,

  forecast: `<strong>What's the air likely to be like in 2026 &amp; 2027?</strong><br><br>
Based on historical data patterns, the cycle will likely repeat:<br><br>
🟡 <strong>Jan–Mar &amp; Nov–Dec</strong>: Expect Moderate to Poor air (AQI 150–200+) due to winter inversions and factory output.<br><br>
🟢 <strong>Jul–Sep (Monsoon)</strong>: Air quality will be Good (AQI 30–50). Rain washes particles out of the air naturally — the most reliable clean period every year.<br><br>
🟠 <strong>Apr–Jun &amp; Oct</strong>: Transition months, generally Satisfactory (AQI 70–120).`,

  health: `<strong>What does poor air actually do to people?</strong><br><br>
When AQI crosses 200, the air contains tiny particles (PM2.5) that are so small they enter your lungs and bloodstream directly.<br><br>
👶 <strong>Children</strong>: Their lungs are still developing — repeated exposure can permanently reduce lung capacity.<br><br>
👴 <strong>Elderly &amp; heart patients</strong>: Increased risk of heart attacks and strokes on high-AQI days.<br><br>
🫱 <strong>Asthma patients</strong>: Immediate bronchospasm (chest tightening), shortness of breath. Should stay indoors and use inhalers.`,

  spikes: `<strong>What does ${ML_DATA.total_spikes} unhealthy days actually mean?</strong><br><br>
Between 2019 and 2024 (about 6 years), Visakhapatnam had <strong>${ML_DATA.total_spikes} days</strong> where the air quality crossed AQI 200 — the "Poor" threshold where it becomes harmful to everyone.<br><br>
That's roughly <strong>${Math.round(ML_DATA.total_spikes / 6)} bad-air days per year</strong>. Most of these cluster in:<br><br>
📅 <strong>January–March</strong>: Peak winter inversion + heavy industrial output<br>
📅 <strong>October–November</strong>: Crop stubble burning season + post-monsoon stagnation`,
};

// GET /api/ai-insight?type=root_cause|forecast|health|spikes
router.get('/ai-insight', (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({
      error:       'Missing query parameter',
      message:     "'type' is required",
      valid_types: VALID_TYPES,
    });
  }

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({
      error:       'Invalid type',
      message:     `'${type}' is not a valid insight type.`,
      valid_types: VALID_TYPES,
    });
  }

  return res.json({ html: INSIGHTS[type] });
});

module.exports = router;
