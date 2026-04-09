/* eslint-disable no-unused-vars */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';

const getCatColor = aqi => aqi <= 50 ? '#10b981' : aqi <= 100 ? '#f59e0b' : aqi <= 200 ? '#f97316' : '#ef4444';

const EXPLAIN = {
  '🌡️ Winter Temperature Inversion':    'Warm air trapped cold polluted air close to the ground — like a lid on a pot — preventing it from dispersing.',
  '🏭 Sustained Industrial Plumes':     'Continuous heavy emissions from the industrial belt accumulated due to stagnant weather conditions.',
  '🏭 RINL Steel Flaring':              'A sudden increase in flaring at the steel plant released a massive volume of smoke and particulate matter.',
  '🏭 HPCL Refinery Emission Spike':    'A peak in refinery operations coincided with low dispersion, leading to a local SO₂ and PM spike.',
  '🔥 Post-Monsoon Biomass Burning':    'Smoke from harvested crop stalks being burned in the outlying rural areas drifted into the city.',
  '💨 Stagnant Wind Speeds':            'Extremely low wind speeds (less than 2 km/h) prevented the horizontal dispersal of local traffic smoke.',
  '🌾 Agricultural Residue Fire':       'Concentrated field fires in the neighbouring districts generated fine ash and smoke plumes.',
  '🌫️ Regional Haze Transport':         'Upper-level winds carried industrial haze from the East Coast corridor into the Visakhapatnam basin.',
  '🏗️ Summer Heat & Dust Resuspension': 'Intense ground heating and strong winds lofted dry road dust and construction silt into the air.',
  '🚗 High Traffic Exhaust':            'Peak holiday traffic and diesel freight movement significantly elevated NO₂ and PM2.5 levels.',
  '🚢 Port Operations Dust':            'Open handling of coal and iron ore at the Vizag Port generated significant fugitive mineral dust.',
  '🏭 Industrial Power Surge':          'Local power-intensive industries ramped up production, increasing secondary particulate loading.',
  '📉 Post-COVID rebound':              'After COVID lockdowns ended, factories restarted all at once, releasing pollution that had been pent up for months.',
  '🏭 RINL steel flaring':              'RINL steel plant released excess gases into the air (a process called "flaring"), which creates thick smoke and particles.',
  '🌡️ Temperature inversion':           'Warm air trapped cold polluted air close to the ground — like a lid on a pot — preventing it from dispersing.',
  '🔥 Paddy stubble burning':           'Farmers in the region burned leftover crop stalks after harvest, releasing large amounts of smoke and ash.',
  '🏭 HPCL refinery':                   'Hindustan Petroleum refinery operations released hydrocarbon vapours and sulfur compounds into the atmosphere.',
};

const SpikeEvents = forwardRef(function SpikeEvents({ events, annualStats }, ref) {
  const [highlighted, setHighlighted] = useState(null);

  // Exposed to parent via ref — ModisAodChart calls window.__highlightSpike(year)
  useImperativeHandle(ref, () => ({
    highlight(year) {
      if (!events) return;
      // Find spike whose year matches closest
      let bestIdx = 0;
      let bestDiff = Infinity;
      events.forEach((e, i) => {
        const diff = Math.abs(parseInt(e.date.split('-')[0]) - year);
        if (diff < bestDiff) { bestDiff = diff; bestIdx = i; }
      });
      setHighlighted(bestIdx);
      const el = document.getElementById(`spike-item-${bestIdx}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setHighlighted(null), 15000);
    },
  }));

  if (!events) return null;

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex flex-wrap items-center justify-between gap-3"
           style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
        <span className="card-title" style={{ color: 'white' }}>
          📅 Historical High-AQI Days (≥200) — Why They Happened
        </span>
        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Top 10 worst days · ranked by AQI
        </span>
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-4" style={{ maxHeight: 560, overflowY: 'auto', paddingRight: 4 }}>
          {events.map((s, i) => {
            const year       = s.date.split('-')[0];
            const annualData = annualStats?.find(a => a.year == year);
            const yearNote   = annualData ? `That year's average AQI was ${annualData.mean} — this spike pushed it far higher.` : '';
            const isHighlighted = highlighted === i;

            return (
              <motion.div
                key={i}
                id={`spike-item-${i}`}
                animate={isHighlighted ? {
                  boxShadow: [
                    '0 0 0 2px rgba(59,130,246,0.9), 0 8px 32px rgba(59,130,246,0.4)',
                    '0 0 0 4px rgba(59,130,246,0.5), 0 16px 48px rgba(59,130,246,0.2)',
                    '0 0 0 2px rgba(59,130,246,0.9), 0 8px 32px rgba(59,130,246,0.4)',
                  ],
                  scale: [1, 1.015, 1],
                } : {
                  boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                  scale: 1,
                }}
                transition={isHighlighted
                  ? { duration: 1.8, repeat: 8, ease: 'easeInOut' }
                  : { duration: 0.4 }}
                style={{
                  background: isHighlighted
                    ? 'linear-gradient(135deg, rgba(59,130,246,0.22), rgba(255,255,255,0.14))'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.06))',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: isHighlighted
                    ? '1px solid rgba(59,130,246,0.55)'
                    : '1px solid rgba(255,255,255,0.18)',
                  borderLeft: `4px solid ${getCatColor(s.aqi)}`,
                  borderRadius: 16,
                  padding: '16px 18px',
                  transition: 'background 0.4s ease, border-color 0.4s ease',
                }}
              >
                {/* Date + AQI badge */}
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <span className="flex items-center gap-2 text-sm font-bold" style={{ color: 'white' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{i + 1}.</span>
                    📅 {s.date}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
                        style={{ background: `${getCatColor(s.aqi)}25`, color: getCatColor(s.aqi), border: `1px solid ${getCatColor(s.aqi)}55` }}>
                    AQI {s.aqi}
                  </span>
                </div>

                {/* PM2.5 context */}
                <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  PM2.5 reached{' '}
                  <strong style={{ color: 'white' }}>{s.pm25} µg/m³</strong>
                  {' '}—{' '}
                  <strong style={{ color: getCatColor(s.aqi) }}>{Math.round(s.pm25 / 25)}× the WHO safe daily limit</strong>.{' '}
                  {yearNote}
                </p>

                {/* Cause cards */}
                <div className="flex flex-col gap-2">
                  {s.causes.map((c, j) => (
                    <div key={j} style={{
                      background: 'rgba(255,255,255,0.07)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderLeft: '3px solid rgba(249,115,22,0.85)',
                      borderRadius: 10,
                      padding: '10px 14px',
                    }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'white' }}>{c}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        {EXPLAIN[c] || 'A local pollution event contributed to this spike.'}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default SpikeEvents;
