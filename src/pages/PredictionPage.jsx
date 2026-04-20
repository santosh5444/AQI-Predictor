/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeModal from '../components/aqi/CodeModal';
import KPICards from '../components/aqi/KPICards';
import LocationExplorer from '../components/aqi/LocationExplorer';
import MapCard from '../components/aqi/MapCard';
import { SourceAttribution, AIPanel } from '../components/aqi/SidePanel';
import { TrendChart, PredictionChart, AnnualChart, StackedChart, PollutantChart } from '../components/aqi/Charts';
import ModisAodChart from '../components/aqi/ModisAodChart';
import SpikeEvents from '../components/aqi/SpikeEvents';
import { useMLData, fetchLiveAQI } from '../hooks/useApi';
import { fadeUp, fadeSlide, staggerContainer, staggerItem, staggerFlip, scaleIn, slideInLeft, slideInRight, viewport } from '../animations/variants';

// ── Section heading with animated accent line ─────────────────────────────────
function SectionHeading({ icon, title, id }) {
  return (
    <motion.div
      id={id}
      className="section-heading"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewport}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'block', width: 3, height: 18, background: 'var(--accent)', borderRadius: 99, transformOrigin: 'top', flexShrink: 0 }}
      />
      <span>{icon}</span>
      <span>{title}</span>
    </motion.div>
  );
}

// ── Floating ambient orb ──────────────────────────────────────────────────────
function FloatingOrb({ x, y, size, color, delay }) {
  return (
    <motion.div
      style={{
        position: 'fixed', left: x, top: y, width: size, height: size,
        borderRadius: '50%', background: color,
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
      }}
      animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

export default function PredictionPage() {
  const data = useMLData();
  const spikeRef = useRef(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [liveAqi, setLiveAqi] = useState(null);
  const [liveLocText, setLiveLocText] = useState('🚢 Port Road');
  const [liveLocDesc, setLiveLocDesc] = useState('Fetching from Port Road station…');

  /* Register global spike highlight */
  useEffect(() => {
    window.__highlightSpike = (year) => {
      if (spikeRef.current?.highlight) spikeRef.current.highlight(year);
    };
    return () => { window.__highlightSpike = null; };
  }, []);

  /* Fetch Port Road AQI on mount */
  useEffect(() => {
    fetchLiveAQI(17.695, 83.285, 'Port Road')
      .then(result => {
        const baseAqi = result.aqi * 1.4716;
        const locScale = 1.18; // Port Road scale
        const aqi = Math.max(1, Math.round((baseAqi + 20) * locScale));
        setLiveAqi(aqi);
        setLiveLocDesc(result.source === 'satellite' ? 'Live Data (Regional Estimator)' : 'Offline — baseline estimate');
      })
      .catch(() => { setLiveAqi(112); setLiveLocDesc('Offline — baseline estimate'); });
  }, []);

  /* Init animated city canvas */
  useEffect(() => {
    if (window.initAQIBackground) window.initAQIBackground('prediction-bg-canvas');
    return () => { if (window.AQIBackground) window.AQIBackground = null; };
  }, []);

  const handleLocationSelect = loc => {
    setSelectedLocation(loc);
    setLiveLocText(`${loc.emoji} ${loc.name}`);
    setLiveLocDesc('Loading live data…');
    if (window.AQIBackground) window.AQIBackground.updateAQI(liveAqi || 80, 5, loc.type || 'urban');
  };

  const handleLiveAqiUpdate = (aqi, desc) => {
    setLiveAqi(aqi);
    setLiveLocDesc(desc);
    if (window.AQIBackground) window.AQIBackground.updateAQI(aqi, 5, 'urban');
  };

  return (
    <motion.div
      className="min-h-screen pt-14 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >

      {/* ── Animated canvas background ── */}
      <canvas
        id="prediction-bg-canvas"
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none', opacity: 0.85 }}
      />

      {/* ── Floating ambient orbs ── */}
      <FloatingOrb x="5%"  y="15%" size={320} color="rgba(59,130,246,0.06)"  delay={0} />
      <FloatingOrb x="75%" y="10%" size={280} color="rgba(167,139,250,0.05)" delay={2} />
      <FloatingOrb x="60%" y="60%" size={360} color="rgba(52,211,153,0.04)"  delay={4} />
      <FloatingOrb x="10%" y="70%" size={240} color="rgba(249,115,22,0.04)"  delay={1} />

      <CodeModal open={codeOpen} onClose={() => setCodeOpen(false)} />

      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 relative z-10">

        {/* KPI Cards — slide up on load */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp}>
            <KPICards
              data={data}
              liveAqi={liveAqi}
              liveLocText={liveLocText}
              liveLocDesc={liveLocDesc}
              onViewCode={() => setCodeOpen(true)}
              accuracy={data?.metrics?.accuracy}
            />
          </motion.div>
        </motion.div>

        {/* Location Explorer — slide in from left */}
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <LocationExplorer
            onLocationSelect={handleLocationSelect}
            onLiveAqiUpdate={handleLiveAqiUpdate}
          />
        </motion.div>

        {/* Map + Side Panel — stagger left/right */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.div variants={slideInLeft}>
            <MapCard selectedLocation={selectedLocation} />
          </motion.div>
          <motion.div className="flex flex-col gap-6" variants={slideInRight}>
            <SourceAttribution />
            <AIPanel />
          </motion.div>
        </motion.div>

        {/* Temporal Analysis */}
        <SectionHeading icon="📈" title="Temporal AQI Analysis" />
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.div variants={slideInLeft}><TrendChart data={data?.monthly_trend} /></motion.div>
          <motion.div variants={slideInRight}><PredictionChart data={data?.future_preds} /></motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.div variants={staggerFlip}><AnnualChart data={data?.annual_avg_chart} /></motion.div>
          <motion.div variants={staggerFlip}><StackedChart data={data?.stacked_dist} /></motion.div>
          <motion.div variants={staggerFlip}><PollutantChart data={data?.pollutant_recent} /></motion.div>
        </motion.div>

        {/* MODIS AOD — scale in */}
        <SectionHeading id="modis-section" icon="🛰️" title="NASA MODIS Aerosol Optical Depth (AOD) — Visakhapatnam Region (2019–2025)" />
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <ModisAodChart />
        </motion.div>

        {/* Spike Events — fade up */}
        <SectionHeading id="spike-section" icon="⚡" title="Top AQI Spike Events — Root Cause Analysis" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <SpikeEvents ref={spikeRef} events={data?.spike_events} annualStats={data?.annual_stats} />
        </motion.div>

      </main>
    </motion.div>
  );
}
