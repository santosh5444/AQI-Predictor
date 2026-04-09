/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, tapPress } from '../../animations/variants';

export function SourceAttribution() {
  const ref = useRef(null);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setAnim(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const bars = [
    { label: '🏭 Heavy Industry (RINL / Petroleum)', pct: '38%', color: 'linear-gradient(90deg,#ef4444,#f87171)' },
    { label: '🚗 Traffic & Port Export Operations',  pct: '28%', color: 'linear-gradient(90deg,#f97316,#fb923c)' },
    { label: '🌡️ Coastal Thermal Inversion',         pct: '18%', color: 'linear-gradient(90deg,#eab308,#facc15)' },
    { label: '🔥 Post-Harvest Biomass Burning',      pct: '11%', color: 'linear-gradient(90deg,#8b5cf6,#a78bfa)' },
    { label: '🏗️ Urban Construction Dust',           pct: '5%',  color: 'linear-gradient(90deg,#94a3b8,#cbd5e1)' },
  ];

  return (
    <div className="card p-5" ref={ref}>
      <div className="card-header">
        <span className="card-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v20m-7-7h14m-7-7h14" />
          </svg>
          Pollution Source Attribution
        </span>
        <span className="text-xs text-slate-400 font-medium">Extrapolated</span>
      </div>
      <motion.div
        className="flex flex-col gap-3.5"
        variants={staggerContainer} initial="hidden" animate={anim ? 'visible' : 'hidden'}
      >
        {bars.map((b, i) => (
          <motion.div key={i} variants={staggerItem}>
            <div className="source-bar-header">
              <span className="text-slate-600">{b.label}</span>
              <span style={{ fontWeight: 700 }}>{b.pct}</span>
            </div>
            <div className="source-bar-bg">
              <div className="source-bar-fill" style={{ background: b.color, width: anim ? b.pct : '0%' }} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ── Rich inline AI responses (from zip folder) — no backend needed ─────────────
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
🟠 <strong>Apr–Jun &amp; Oct</strong>: Transition months, generally Satisfactory (AQI 70–120). Conditions are improving but not fully clean.`,

  health: `<strong>What does poor air actually do to people?</strong><br><br>
When AQI crosses 200, the air contains tiny particles (PM2.5) that are so small they enter your lungs and bloodstream directly.<br><br>
👶 <strong>Children</strong>: Their lungs are still developing — repeated exposure can permanently reduce lung capacity.<br><br>
👴 <strong>Elderly &amp; heart patients</strong>: Increased risk of heart attacks and strokes on high-AQI days.<br><br>
🫱 <strong>Asthma patients</strong>: Immediate bronchospasm (chest tightening), shortness of breath. Should stay indoors and use inhalers.<br><br>
Even healthy adults may feel throat irritation, burning eyes, and fatigue on days when AQI exceeds 200.`,

  spikes: `<strong>What does 168 unhealthy days actually mean?</strong><br><br>
Between 2019 and 2024 (6 years), Visakhapatnam had <strong>168 days</strong> where the air quality crossed AQI 200 — the "Poor" threshold where it becomes harmful to everyone, not just sensitive groups.<br><br>
That's roughly <strong>28 bad-air days per year</strong>, or about <strong>1 in every 13 days</strong>. Most of these cluster in:<br><br>
📅 <strong>January–March</strong>: Peak winter inversion + heavy industrial output<br>
📅 <strong>October–November</strong>: Crop stubble burning season + post-monsoon stagnation<br><br>
The good news: <strong>monsoon months (Jul–Sep)</strong> are almost always clean, with zero such days recorded in most years.`,
};

const AI_BUTTONS = [
  { type: 'root_cause', label: '🔍 Root Cause' },
  { type: 'forecast',   label: '📈 Forecast 26–27' },
  { type: 'health',     label: '🫁 Health Impact' },
  { type: 'spikes',     label: '⚡ Spike Events' },
];

export function AIPanel() {
  const [html,    setHtml]    = useState('👇 Click a button above to get a plain-English explanation about Visakhapatnam\'s air quality.');
  const [loading, setLoading] = useState(false);
  const [active,  setActive]  = useState(null);

  const showInsight = type => {
    setLoading(true);
    setActive(type);
    setHtml('');
    // Small delay for the loading animation to feel responsive
    setTimeout(() => {
      setHtml(INSIGHTS[type] || INSIGHTS.root_cause);
      setLoading(false);
    }, 320);
  };

  return (
    <div className="card p-5 flex flex-col gap-4" style={{ border: '1px solid rgba(59,130,246,0.18)', flexGrow: 1 }}>
      <div className="card-header" style={{ marginBottom: 0 }}>
        <span className="card-title">✨ AI Generative Insights</span>
        <span className="text-xs text-slate-400">Powered by contextual analysis</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {AI_BUTTONS.map(({ type, label }) => (
          <motion.button
            key={type}
            onClick={() => showInsight(type)}
            className="btn transition-all duration-200"
            style={active === type && !loading
              ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)', boxShadow: '0 2px 8px rgba(59,130,246,0.28)' }
              : undefined}
            whileHover={{ y: -1, transition: { duration: 0.15 } }}
            whileTap={tapPress}
          >
            {label}
          </motion.button>
        ))}
      </div>

      <div className="ai-response flex-1">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.span key="loading" className="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin">
                <circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Thinking…
            </motion.span>
          ) : (
            <motion.div key={active || 'default'}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.0, 0.0, 0.2, 1.0] }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
