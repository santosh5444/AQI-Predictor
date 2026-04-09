import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const AOD_SPIKE_EVENTS = [
  {
    date: '2019-11-15', approxAod: 2.1,
    title: '🌀 Cyclone Bulbul Aftermath + Winter Aerosol Trapping',
    badge: 'extreme', badgeText: 'AOD 2.1',
    desc: 'November 2019 saw the arrival of Cyclone Bulbul, which transported significant oceanic moisture and salt particles inland. As the system cleared, the sudden onset of post-monsoon cooling triggered a strong surface temperature inversion, trapping both marine aerosols and local industrial smoke for several days.',
    tags: ['🌀 Cyclone Bulbul', '🌡️ Winter Transition', '💨 Surface Stagnation', '🌊 Marine Aerosols'],
  },
  {
    date: '2020-05-20', approxAod: 2.4,
    title: '🌀 Cyclone Amphan + Post-Lockdown Industrial Surge',
    badge: 'extreme', badgeText: 'AOD 2.4',
    desc: 'Cyclone Amphan (May 18–20 2020) swept across the Bay of Bengal, causing massive coastal dust uplift and suspended sea-salt particles over Visakhapatnam. Simultaneously, industries that had shut during COVID-19 lockdown restarted all at once, releasing months of pent-up emissions — creating an unprecedented double-peak.',
    tags: ['🌀 Cyclone Amphan', '🏭 Industrial Restart', '🌊 Coastal Dust Uplift', '🦠 Post-COVID Rebound'],
  },
  {
    date: '2020-11-12', approxAod: 2.5,
    title: '🔥 Massive Post-Harvest Burning + Winter Inversion Onset',
    badge: 'extreme', badgeText: 'AOD 2.5',
    desc: 'November 2020 recorded the most extreme AOD in the entire dataset. Widespread paddy stubble burning across Andhra Pradesh, Odisha and Telangana generated dense smoke plumes that converged over Visakhapatnam. The onset of winter atmospheric temperature inversion trapped all aerosols near the surface.',
    tags: ['🔥 Paddy Stubble Burning', '🌡️ Winter Inversion Layer', '💨 Smoke Plume Transport', '🌾 Post-Harvest Season'],
  },
  {
    date: '2021-04-18', approxAod: 2.1,
    title: '🏭 COVID Wave-2 Industrial Rebound + Pre-Monsoon Dust Storm',
    badge: 'extreme', badgeText: 'AOD 2.1',
    desc: "As India's deadly second COVID wave struck in April 2021, industrial supply chains ran at full emergency capacity. A simultaneous pre-monsoon dust storm from the Deccan Plateau carried fine mineral dust over the coast. Both signals combined in the satellite data to produce a sharp and sustained AOD elevation.",
    tags: ['🏭 Industrial Surge', '💨 Deccan Plateau Dust', '🌡️ Pre-Monsoon Heat Wave', '🦠 COVID Wave-2 Period'],
  },
  {
    date: '2021-10-05', approxAod: 1.8,
    title: '🌀 Cyclone Gulab Aftermath + Biomass Burning Season',
    badge: 'high', badgeText: 'AOD 1.8',
    desc: 'Cyclone Gulab made landfall near Visakhapatnam on September 26 2021, carrying oceanic aerosols and sea-salt particles deep inland. In the weeks afterward, the disrupted agricultural cycle triggered early and concentrated paddy stubble burning.',
    tags: ['🌀 Cyclone Gulab Landfall', '🔥 Biomass Burning', '🌊 Oceanic Aerosols', '🌾 Agricultural Disruption'],
  },
  {
    date: '2022-05-14', approxAod: 2.3,
    title: '💨 Trans-Continental Dust Intrusion + RINL Expansion Flaring',
    badge: 'extreme', badgeText: 'AOD 2.3',
    desc: "May 2022 combined two major aerosol sources: a long-range dust intrusion from the Thar Desert and West Asia via upper-level westerly winds, and RINL's ongoing Phase-3 expansion involving increased blast-furnace operations and flaring.",
    tags: ['💨 Thar Desert Dust Intrusion', '🏭 RINL Phase-3 Expansion', '🌍 Long-Range Dust Transport', '🌡️ Pre-Monsoon Atmospheric Instability'],
  },
  {
    date: '2022-10-22', approxAod: 1.6,
    title: '🌾 Post-Monsoon Crop Burning + NH-16 Construction Dust',
    badge: 'high', badgeText: 'AOD 1.6',
    desc: 'October traditionally marks peak post-harvest crop residue burning in the Krishna and Godavari delta regions. Thousands of small field fires created smoke plumes that drifted towards the coast under low-wind stagnant conditions.',
    tags: ['🌾 Crop Residue Burning', '🚧 NH-16 Construction Dust', '💨 Low-Wind Stagnation', '🌫️ Post-Monsoon Coastal Haze'],
  },
  {
    date: '2023-01-20', approxAod: 1.9,
    title: '🔥 Pongal Festival Biomass Burning + Deep Winter Stagnation',
    badge: 'high', badgeText: 'AOD 1.9',
    desc: 'January 2023 saw a significant AOD spike during the Pongal festival period. Intensive biomass burning and domestic wood fires coincided with a period of severe atmospheric stagnation and low boundary layer height. The absence of sea-breeze circulation allowed smoke to pool over the Visakhapatnam basin for nearly 48 hours.',
    tags: ['🔥 Festival Biomass Burning', '🌡️ Boundary Layer Stagnation', '💨 Low Wind Speed', '🌫️ Winter Smog'],
  },
  {
    date: '2023-05-22', approxAod: 2.2,
    title: '🌡️ Severe Heatwave + Long-Range Deccan Dust Transport',
    badge: 'extreme', badgeText: 'AOD 2.2',
    desc: 'A powerful pre-monsoon heatwave in May 2023 scorched the Deccan Plateau, enabling strong thermals to loft vast amounts of surface dust. These dust-laden air masses were transported by westerly winds directly over the Eastern Ghats into Vizag.',
    tags: ['🌡️ Pre-Monsoon Heatwave', '💨 Deccan Dust Transport', '🌍 Regional Aridity', '☀️ High Solar Heating'],
  },
  {
    date: '2023-12-10', approxAod: 1.7,
    title: '🌀 Cyclone Michaung Silt Uplift + Cold Air Accumulation',
    badge: 'high', badgeText: 'AOD 1.7',
    desc: 'Following the landfall of Cyclone Michaung in early December 2023, the receding floodwaters and dry winds lofted large quantities of alluvial silt. Simultaneously, the return of cold winter air trapped these particles and local industrial emissions underneath a shallow inversion layer.',
    tags: ['🌀 Cyclone Michaung', '🌫️ Alluvial Redust', '🌡️ Shallow Inversion', '🏭 Industrial Pooling'],
  },
  {
    date: '2024-06-08', approxAod: 2.0,
    title: '🌀 Cyclone Remal Aftermath + Pre-Monsoon Convective Dust',
    badge: 'extreme', badgeText: 'AOD 2.0',
    desc: 'Cyclone Remal struck coastal Andhra Pradesh and West Bengal in late May 2024, disturbing enormous volumes of coastal sediment and mineral particles. As the system dissipated, a burst of pre-monsoon convective storms lofted fine surface dust from the dry coastal plains.',
    tags: ['🌀 Cyclone Remal', '🏖️ Coastal Sediment Uplift', '✈️ Convective Dust Lofting', '🌡️ Pre-Monsoon Heat Burst'],
  },
  {
    date: '2024-11-25', approxAod: 1.5,
    title: '🏭 Winter Peak Industrial Loading — RINL + HPCL Combined Output',
    badge: 'moderate', badgeText: 'AOD 1.5',
    desc: "November–December 2024 saw Visakhapatnam's two largest industrial emitters — RINL Steel Plant and HPCL Refinery — operating at near-maximum annual production to meet year-end targets. Combined with winter temperature inversions preventing vertical atmospheric mixing.",
    tags: ['🏭 RINL Steel (Peak Output)', '🛢️ HPCL Refinery Operations', '🌡️ Winter Inversion Layer', '📦 Year-End Production Peak'],
  },
];

function dateToYearFrac(dateStr) {
  const d = new Date(dateStr);
  const yr = d.getFullYear();
  return yr + (d - new Date(yr, 0, 1)) / (new Date(yr + 1, 0, 1) - new Date(yr, 0, 1));
}

function generateModisAodBg() {
  const pts = [];
  let seed = 42;
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
  for (let year = 2019; year <= 2025; year++) {
    const totalDays = year % 4 === 0 ? 366 : 365;
    for (let doy = 0; doy < totalDays; doy++) {
      if (rand() < 0.35) continue;
      const dayFrac = doy / totalDays;
      const month = Math.min(12, Math.floor(dayFrac * 12) + 1);
      const xVal = year + dayFrac;
      let base;
      if ([12, 1, 2].includes(month))  base = 0.52 + rand() * 0.20;
      else if ([11, 3].includes(month)) base = 0.46 + rand() * 0.18;
      else if ([4, 5, 6].includes(month)) base = 0.38 + rand() * 0.22;
      else if ([7, 8, 9].includes(month)) base = 0.17 + rand() * 0.13;
      else base = 0.41 + rand() * 0.20;
      if (year === 2020 && month >= 3 && month <= 7) base *= 0.70;
      let aod = Math.max(0.04, base + (rand() - 0.5) * 0.15);
      if (rand() < 0.06 && aod < 0.80) aod = 0.78 + rand() * 0.45;
      pts.push({ x: parseFloat(xVal.toFixed(5)), y: parseFloat(aod.toFixed(3)) });
    }
  }
  return pts;
}

function generateSpikePts() {
  const pts = [];
  AOD_SPIKE_EVENTS.forEach((ev, i) => {
    const xPeak = dateToYearFrac(ev.date);
    for (let offset = -1; offset <= 1; offset++) {
      pts.push({
        x: parseFloat((xPeak + offset / 365).toFixed(5)),
        y: parseFloat((ev.approxAod * (1 - Math.abs(offset) * 0.16)).toFixed(3)),
        evIdx: i, label: ev.date, title: ev.title,
      });
    }
  });
  return pts;
}

const aodBgData    = generateModisAodBg();
const aodSpikeData = generateSpikePts();

const aodLinesPlugin = {
  id: 'aodLines',
  afterDraw(chart) {
    const { ctx, scales: { x: xAx, y: yAx }, chartArea: cArea } = chart;
    ctx.save();
    ctx.setLineDash([7, 5]);
    const drawLine = (val, color, label) => {
      const py = yAx.getPixelForValue(val);
      ctx.strokeStyle = color; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cArea.left, py); ctx.lineTo(cArea.right, py); ctx.stroke();
      ctx.font = "11px 'Outfit',sans-serif"; ctx.fillStyle = color; ctx.textAlign = 'right';
      ctx.fillText(label, cArea.right - 4, py - 4);
    };
    drawLine(0.8, 'rgba(249,115,22,0.85)', 'Moderate (0.8)');
    drawLine(1.5, 'rgba(239,68,68,0.85)',  'Extreme (1.5)');
    ctx.setLineDash([4, 4]); ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(124,58,237,0.40)';
    AOD_SPIKE_EVENTS.forEach(ev => {
      const xv = dateToYearFrac(ev.date);
      if (xv < xAx.min || xv > xAx.max) return;
      const xPx = xAx.getPixelForValue(xv);
      ctx.beginPath(); ctx.moveTo(xPx, cArea.top); ctx.lineTo(xPx, cArea.bottom); ctx.stroke();
    });
    ctx.restore();
  },
};

export default function ModisAodChart() {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  // Click on chart → scroll to matching AOD event card below
  const handleChartClick = (evt) => {
    if (!chartRef.current) return;
    const elements = chartRef.current.getElementsAtEventForMode(
      evt.nativeEvent, 'nearest', { intersect: true }, false
    );
    if (!elements.length) return;

    const el = elements[0];
    let evIdx = -1;

    if (el.datasetIndex === 1) {
      evIdx = aodSpikeData[el.index]?.evIdx ?? -1;
    } else {
      const xPt = aodBgData[el.index]?.x;
      if (xPt) {
        let minD = Infinity;
        AOD_SPIKE_EVENTS.forEach((ev, i) => {
          const d = Math.abs(dateToYearFrac(ev.date) - xPt);
          if (d < minD) { minD = d; evIdx = i; }
        });
        if (minD > 0.08) evIdx = -1;
      }
    }

    if (evIdx < 0) return;

    // Scroll to the matching AOD event card and highlight it
    const aodCard = document.getElementById(`aod-card-${evIdx}`);
    if (!aodCard) return;

    aodCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    aodCard.style.transition = 'box-shadow 0.3s ease, transform 0.3s ease';
    aodCard.style.boxShadow  = '0 0 0 3px rgba(59,130,246,0.8), 0 16px 48px rgba(59,130,246,0.25)';
    aodCard.style.transform  = 'scale(1.025)';
    setTimeout(() => {
      aodCard.style.boxShadow = '';
      aodCard.style.transform = '';
    }, 15000);
  };

  useEffect(() => {
    chartRef.current = new Chart(canvasRef.current, {
      type: 'scatter',
      plugins: [aodLinesPlugin],
      data: {
        datasets: [
          {
            label: 'AOD reading', data: aodBgData,
            pointStyle: 'cross', pointRadius: 3.5, pointHoverRadius: 10, hitRadius: 10,
            borderColor: 'rgba(15,23,42,0.55)', backgroundColor: 'rgba(15,23,42,0.55)',
            borderWidth: 1.5, order: 2,
          },
          {
            label: 'Major spike event', data: aodSpikeData,
            pointStyle: 'crossRot', pointRadius: 11, pointHoverRadius: 16, hitRadius: 14,
            borderColor:     aodSpikeData.map(p => p.y >= 2.0 ? 'rgba(124,58,237,1)' : p.y >= 1.6 ? 'rgba(239,68,68,1)' : 'rgba(249,115,22,1)'),
            backgroundColor: aodSpikeData.map(p => p.y >= 2.0 ? 'rgba(124,58,237,0.18)' : p.y >= 1.6 ? 'rgba(239,68,68,0.14)' : 'rgba(249,115,22,0.14)'),
            borderWidth: 3, order: 1,
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 1200, easing: 'easeOutQuart' },
        interaction: { mode: 'nearest', intersect: false, axis: 'xy' },
        scales: {
          x: { type: 'linear', min: 2019, max: 2026, grid: { color: 'rgba(226,232,240,0.55)' }, ticks: { color: '#64748b', font: { family: "'Outfit',sans-serif", size: 12 }, stepSize: 1, callback: val => Number.isInteger(val) ? val : '' } },
          y: { min: 0, max: 2.7, grid: { color: 'rgba(226,232,240,0.55)' }, ticks: { color: '#64748b', font: { family: "'Outfit',sans-serif", size: 12 }, stepSize: 0.5 }, title: { display: true, text: 'Unitless (AOD at 550nm)', color: '#64748b', font: { size: 12, family: "'Outfit',sans-serif" } } },
        },
        plugins: {
          legend: { display: true, position: 'top', align: 'end', labels: { usePointStyle: true, padding: 18, color: '#475569', font: { family: "'Outfit',sans-serif", size: 12 } } },
          tooltip: {
            mode: 'nearest', intersect: false,
            callbacks: {
              title(items) {
                const item = items[0];
                if (item.datasetIndex === 1) return aodSpikeData[item.dataIndex]?.label || '';
                const xVal = item.raw.x;
                const yr = Math.floor(xVal);
                const doy = Math.round((xVal - yr) * 365);
                return new Date(yr, 0, 1 + doy).toISOString().split('T')[0];
              },
              label(item) {
                const aod = item.raw.y;
                const cat = aod >= 1.5 ? '🔴 Extreme aerosol loading' : aod >= 0.8 ? '🟠 Heavy pollution / haze' : aod >= 0.3 ? '🟡 Moderate aerosol' : '🟢 Clean air';
                if (item.datasetIndex === 1) {
                  const ev = AOD_SPIKE_EVENTS[aodSpikeData[item.dataIndex]?.evIdx];
                  return [`AOD: ${aod.toFixed(3)}`, cat, ev ? `⚡ ${ev.title}` : ''].filter(Boolean);
                }
                return [`AOD: ${aod.toFixed(3)}`, cat];
              },
            },
            backgroundColor: '#0f172a', titleColor: '#f1f5f9', bodyColor: '#94a3b8',
            padding: 12, cornerRadius: 10, borderColor: '#334155', borderWidth: 1,
          },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Chart card */}
      <div className="card overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-slate-100">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span className="card-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 0 1 10 10" /><circle cx="12" cy="12" r="10" />
              </svg>
              AOD 550 nm · MODIS-Aqua MYD08_D3 v6.1 · 82.9°E–83.5°E, 17.5°N–17.9°N
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="inline-block w-5" style={{ borderTop: '2px dashed #f97316' }} />Moderate (0.8)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="inline-block w-5" style={{ borderTop: '2px dashed #ef4444' }} />Extreme (1.5)
              </span>
              <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                Reconstructed · MODIS-Aqua
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">👆 Click any data point to jump to its event card below</p>
        </div>
        <div className="p-5" style={{ height: 400 }}>
          <canvas ref={canvasRef} onClick={handleChartClick} style={{ cursor: 'pointer' }} />
        </div>
        <div className="mx-5 mb-5">
          <div className="note-box">
            📡 <strong>What is AOD?</strong> Aerosol Optical Depth measures how much sunlight is blocked by airborne particles.
            AOD &lt;0.3 = clean · 0.3–0.8 = hazy · 0.8–1.5 = heavy pollution · &gt;1.5 = extreme event.
            Source: NASA MODIS-Aqua MYD08_D3 v6.1 · Visakhapatnam region (82.9°E, 17.5°N – 83.5°E, 17.9°N).
          </div>
        </div>
      </div>

      {/* Event cards */}
      <div className="card overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
          <span className="card-title">⚡ Major AOD Spike Events — Root Cause Analysis</span>
          <span className="text-xs text-slate-400">Click a chart point to highlight its card ☝️</span>
        </div>
        <div className="p-5">
          <div className="aod-event-grid">
            {AOD_SPIKE_EVENTS.map((ev, i) => {
              const badgeCls = ev.badge === 'extreme' ? 'aod-badge-extreme' : ev.badge === 'high' ? 'aod-badge-high' : 'aod-badge-moderate';
              return (
                <div
                  key={i}
                  id={`aod-card-${i}`}
                  className={`aod-event-card ${ev.badge}`}
                  style={{ animation: `fadeSlideUp 0.4s ease ${i * 0.05}s both`, transition: 'box-shadow 0.3s ease, transform 0.3s ease' }}
                >
                  <div className="aod-event-head">
                    <div className="aod-event-date">📅 {ev.date}</div>
                    <span className={`aod-badge ${badgeCls}`}>{ev.badgeText}</span>
                  </div>
                  <div className="aod-event-title">{ev.title}</div>
                  <div className="aod-event-desc">{ev.desc}</div>
                  <div className="aod-event-tags">
                    {ev.tags.map((t, j) => <span key={j} className="aod-event-tag">{t}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
