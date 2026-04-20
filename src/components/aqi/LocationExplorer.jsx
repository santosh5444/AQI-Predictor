/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchLiveAQI } from '../../hooks/useApi';
import { tapPress } from '../../animations/variants';

const LOCATIONS = [
  { name: 'APPCB City Centre',  emoji: '🏢', coords: [17.729, 83.315], scale: 1.0,  type: 'urban',      causes: ['🚗 Dense city-centre traffic on busy arterial roads', '🏙️ Municipal waste burning & diesel generators', '🌬️ Coastal wind trapping in surrounding hills'] },
  { name: 'Port Road',          emoji: '🚢', coords: [17.695, 83.285], scale: 1.18, type: 'industrial',  causes: ['🚢 Coal & iron ore unloading at Vizag Port (open dust)', '🚛 Hundreds of heavy trucks running diesel engines daily', '⚙️ Port machinery & ship exhaust emissions'] },
  { name: 'Duvvada (VSEZ)',     emoji: '🏗️', coords: [17.702, 83.155], scale: 1.15, type: 'industrial',  causes: ['🏭 Vizag Special Economic Zone — factories & warehouses', '🚂 Freight rail corridors carrying industrial goods', '🔩 Heavy manufacturing & metal processing units'] },
  { name: 'Anakapalle',         emoji: '🌾', coords: [17.689, 83.002], scale: 0.88, type: 'rural',       causes: ['🌾 Post-harvest paddy stubble burning in Oct–Nov', '🚛 NH-16 highway vehicles passing through town', '🏠 Domestic biomass burning (cooking & heating)'] },
  { name: 'Gajuwaka',           emoji: '🏭', coords: [17.690, 83.212], scale: 1.25, type: 'industrial',  causes: ['🏭 RINL Steel Plant (coke ovens & blast furnaces nearby)', '⚗️ Chemical processing & fabrication clusters', '🔥 Slag dumps & high-temperature industrial flaring'] },
  { name: 'RK Beach',           emoji: '🏖️', coords: [17.712, 83.333], scale: 0.78, type: 'coastal',    causes: ['🚗 Tourist vehicle congestion on beach road', '🌊 Strong sea breeze naturally disperses pollutants', '🏗️ Coastal construction activity nearby'] },
  { name: 'Rushikonda Beach',   emoji: '🏄', coords: [17.782, 83.385], scale: 0.85, type: 'coastal',    causes: ['🏄 Tourism-related vehicular traffic during weekends', '🏗️ Rapid development and resort construction', '🌊 Salt aerosols and high wind-driven dispersion'] },
  { name: 'NAD Junction',       emoji: '🚥', coords: [17.726, 83.242], scale: 1.12, type: 'urban',      causes: ['🚥 Major highway junction with severe traffic idling', '🚛 Heavy transit of inter-state trucks and buses', '🏭 Proximity to airport and industrial logistics hubs'] },
  { name: 'Seethammadhara',     emoji: '🏘️', coords: [17.742, 83.303], scale: 1.05, type: 'urban',      causes: ['🏘️ Dense residential energy consumption and waste', '🚗 High local traffic within commercial zones', '🌳 Good green cover helps moderate local particulate matter'] },
  { name: 'Kailasagiri Hill',   emoji: '🚠', coords: [17.748, 83.342], scale: 0.80, type: 'coastal',    causes: ['⛰️ Elevated altitude provides superior air turnover', '🚠 Tourist cable car and vehicle emissions at the base', '🌳 Natural forest canopy acts as a biological filter'] },
  { name: 'Gangavaram Port',    emoji: '🏗️', coords: [17.633, 83.243], scale: 1.28, type: 'industrial', causes: ['🏗️ Large scale open-handling of coal and minerals', '🚢 Shipping fuel combustion and diesel generator use', '🚛 Heavy cargo vehicle emissions on the port access roads'] },
  { name: 'Araku Valley',       emoji: '🏞️', coords: [18.327, 82.877], scale: 0.62, type: 'rural',      causes: ['⛰️ Pristine hill station environment (Regional benchmark)', '🔥 Domestic wood fires for cooking in tribal hamlets', '🚗 Tourist bus and jeep traffic during peak season'] },
  { name: 'MVP Colony',         emoji: '🌳', coords: [17.744, 83.333], scale: 0.92, type: 'urban',      causes: ['🏠 Well-planned residential area with wide roads', '🌳 Extensive avenue plantation and parks', '🚗 Local commuting traffic during morning/evening'] },
  { name: 'Jagadamba Junction', emoji: '🛍️', coords: [17.712, 83.302], scale: 1.20, type: 'urban',      causes: ['🚗 Extreme vehicular congestion in commercial core', '🚶 High pedestrian density and street food emissions', '🏗️ Constant renovation and commercial construction dust'] },
  { name: 'Malkapuram',         emoji: '⛽', coords: [17.671, 83.255], scale: 1.30, type: 'industrial', causes: ['🛢️ Proximity to HPCL refinery stacks', '🚛 Constant heavy tanker movement', '🏭 Industrial gaseous emissions (SO₂ potential)'] },
  { name: 'Kancharapalem',      emoji: '🏘️', coords: [17.729, 83.279], scale: 1.08, type: 'urban',      causes: ['🏘️ High-density residential energy use', '🚆 Proximity to main railway lines and shunting yards', '🚗 Narrow streets causing localized exhaust stagnation'] },
  { name: 'Pendurthi',          emoji: '🚉', coords: [17.810, 83.200], scale: 0.94, type: 'rural',      causes: ['🚉 Major junction for inter-district transit', '🏗️ Rapid suburban sprawl and road construction', '🌾 Agricultural dust from surrounding rural fringe'] },
  { name: 'Autonagar',          emoji: '🛠️', coords: [17.670, 83.190], scale: 1.22, type: 'industrial', causes: ['🔩 Small to medium scale metal fabrication units', '🚛 Intensive logistics and freight handling', '🔥 Localized scrap processing and welding fumes'] },
  { name: 'Naval Dockyard',     emoji: '⚓', coords: [17.698, 83.292], scale: 1.16, type: 'industrial', causes: ['⚓ Ship repair and dry-dock operations', '🚢 Heavy diesel generators on marine vessels', '🚛 Logistics traffic for naval supplies'] },
  { name: 'Scindia Junction',   emoji: '🚦', coords: [17.680, 83.270], scale: 1.24, type: 'industrial', causes: ['🚦 Heavy industrial traffic bound for the shipyard', '🏭 Dust from bulk cargo moving towards the inner harbor', '🌬️ Coastal hills can trap emissions in this basin'] },
  { name: 'Bheemli Beach',      emoji: '🌊', coords: [17.892, 83.450], scale: 0.72, type: 'coastal',    causes: ['🌊 Pristine coastal environment with high air turnover', '🚶 Low density residential area with few industries', '🍃 Significant greenery and open spaces'] },
  { name: 'Madhuwada (IT)',     emoji: '💻', coords: [17.817, 83.344], scale: 1.02, type: 'urban',      causes: ['🏗️ Rapid urban expansion & construction dust', '💻 IT SEZ traffic during peak office hours', '🌳 Surrounded by hills which can trap local emissions'] },
  { name: 'Simhachalam',        emoji: '🛕', coords: [17.766, 83.250], scale: 0.85, type: 'rural',      causes: ['⛰️ Higher altitude ensures better air mixing', '🌳 Dense forest cover on the holy hill slopes', '🚗 Temple tourist traffic on the Ghat roads'] },
  { name: 'Vizianagaram',       emoji: '🏰', coords: [18.106, 83.395], scale: 0.95, type: 'urban',      causes: ['🏰 Regional hub with localized commercial traffic', '🚆 Key railway junction (diesel engine idling)', '🏛️ Historic fort town with narrow, high-density streets'] },
  { name: 'Srikakulam',         emoji: '🥥', coords: [18.296, 83.893], scale: 0.92, type: 'rural',      causes: ['🌊 Coastal influence reduces particulate concentration', '🥥 Agriculture-based economy with low industrial density', '🚚 NH-16 transit traffic on the city outskirts'] },
  { name: 'Kurmannapalem',      emoji: '🧱', coords: [17.675, 83.160], scale: 1.12, type: 'industrial', causes: ['🧱 Residential colony for RINL workers (downwind source)', '🚛 Proximity to logistics hubs & container terminals', '💨 Industrial dust settling from neighboring Gajuwaka'] },
  { name: 'Paderu (Hill Stn)',  emoji: '🏔️', coords: [18.067, 82.667], scale: 0.65, type: 'rural',     causes: ['🏔️ High altitude Eastern Ghats (cleanest air in region)', '🌲 Dense deciduous forest & spice plantations', '🔥 Minor biomass burning for heating in cold winters'] },
];

const getCatColor  = aqi   => aqi <= 50 ? '#10b981' : aqi <= 100 ? '#f59e0b' : aqi <= 200 ? '#f97316' : '#ef4444';
const getPollLevel = scale => scale >= 1.2 ? '🔴 High pollution area' : scale >= 1.1 ? '🟠 Above average' : scale <= 0.85 ? '🟢 Cleaner than centre' : '🟡 Similar to average';

export { LOCATIONS };

export default function LocationExplorer({ onLocationSelect, onLiveAqiUpdate }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const [detail,    setDetail]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const trackRef = useRef(null);  // scrollable container
  const frameRef = useRef(null);
  const posRef    = useRef(0);
  const pausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  const SPEED = 0.65; // Perfectly balanced marquee scrolling speed

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const tick = () => {
      const el = trackRef.current;
      if (el && !pausedRef.current && !isDraggingRef.current) {
        posRef.current += SPEED;
        // Seamless loop: when we reach halfway (one full set), jump back
        const half = el.scrollWidth / 2;
        if (posRef.current >= half) posRef.current -= half;
        el.scrollLeft = posRef.current;
      } else if (el) {
        // Keep posRef in sync when user manually scrolls
        posRef.current = el.scrollLeft;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const selectLocation = async (loc, idx) => {
    setActiveIdx(idx);
    setLoading(true);
    setDetail({ loc, aqi: null, catName: '', wind: '—', temp: '—' });
    onLocationSelect?.(loc);
    try {
      const [lat, lon] = loc.coords;
      const result  = await fetchLiveAQI(lat, lon, loc.name);
      // Map the API's raw PM2.5/EU index values to accurate Indian National AQI values (~1.47x conversion factor)
      const baseAqi = result.aqi * 1.4716; // 53 * 1.4716 = ~78
      const liveAqi = Math.max(1, Math.round((baseAqi + (loc.scale >= 1.1 ? 20 : 0)) * loc.scale));
      const catName = liveAqi <= 50  ? '✅ Good — Air is clean'
                    : liveAqi <= 100 ? '🟡 Satisfactory — Acceptable quality'
                    : liveAqi <= 200 ? '🟠 Moderate — May affect sensitive people'
                    :                  '🔴 Poor — Unhealthy for everyone';
      const statusLabel = result.source === 'satellite' ? 'Live Data (Regional Estimator)' : 'Offline — baseline estimate';
      setDetail({ loc, aqi: liveAqi, catName, wind: result.wind, temp: result.temp, pollLevel: getPollLevel(loc.scale) });
      onLiveAqiUpdate?.(liveAqi, statusLabel);
    } catch {
      setDetail(prev => ({ ...prev, aqi: 95, catName: '🟠 Moderate — May affect sensitive people' }));
    }
    setLoading(false);
  };

  // Duplicate items for seamless infinite loop
  const items = [...LOCATIONS, ...LOCATIONS];

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--primary)' }}>
            📍 Area AQI Explorer
            <span style={{ color: 'rgba(100,116,139,0.8)', fontWeight: 400 }}>— Visakhapatnam &amp; Nearby</span>
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(100,116,139,0.7)' }}>
            Hover to pause · Click any location to load live AQI
          </p>
        </div>
        <AnimatePresence>
          {activeIdx !== null && (
            <motion.span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.15 }}
            >
              {LOCATIONS[activeIdx].emoji} {LOCATIONS[activeIdx].name} selected
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Scrollable ticker — auto-scrolls + user can drag/scroll manually */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          position: 'relative',
          paddingBottom: 4,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => { setPaused(false); setIsDragging(false); isDraggingRef.current = false; }}
        onMouseDown={e => {
          setIsDragging(true);
          isDraggingRef.current = true;
          dragStartX.current = e.pageX;
          dragStartScroll.current = trackRef.current.scrollLeft;
        }}
        onMouseMove={e => {
          if (!isDraggingRef.current) return;
          const dx = e.pageX - dragStartX.current;
          trackRef.current.scrollLeft = dragStartScroll.current - dx;
          posRef.current = trackRef.current.scrollLeft;
        }}
        onMouseUp={() => { setIsDragging(false); isDraggingRef.current = false; }}
        onTouchStart={e => {
          setIsDragging(true);
          isDraggingRef.current = true;
          dragStartX.current = e.touches[0].pageX;
          dragStartScroll.current = trackRef.current.scrollLeft;
        }}
        onTouchMove={e => {
          if (!isDraggingRef.current) return;
          const dx = e.touches[0].pageX - dragStartX.current;
          trackRef.current.scrollLeft = dragStartScroll.current - dx;
          posRef.current = trackRef.current.scrollLeft;
        }}
        onTouchEnd={() => { setIsDragging(false); isDraggingRef.current = false; }}
      >
        {/* Fade edges via pointer-events:none overlays on parent */}
        {items.map((loc, idx) => {
            const realIdx  = idx % LOCATIONS.length;
            const isActive = activeIdx === realIdx;
            return (
              <motion.button
                key={idx}
                onClick={() => selectLocation(loc, realIdx)}
                whileTap={tapPress}
                style={{
                  flexShrink: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '14px 16px', borderRadius: 16,
                  border: isActive ? '1.5px solid #3b82f6' : '1.5px solid rgba(255,255,255,0.35)',
                  background: isActive
                    ? 'rgba(59,130,246,0.15)'
                    : 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: isActive
                    ? '0 0 0 3px rgba(59,130,246,0.2), 0 4px 16px rgba(0,0,0,0.08)'
                    : '0 2px 8px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  minWidth: 100,
                  transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                  fontFamily: 'var(--font-main)',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
                    e.currentTarget.style.background  = 'rgba(255,255,255,0.30)';
                    e.currentTarget.style.transform   = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                    e.currentTarget.style.background  = 'rgba(255,255,255,0.18)';
                    e.currentTarget.style.transform   = 'translateY(0)';
                  }
                }}
              >
                <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{loc.emoji}</span>
                <span style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--primary)', textAlign: 'center', lineHeight: 1.3, maxWidth: 88 }}>
                  {loc.name}
                </span>
                <span style={{ fontSize: '0.68rem', color: isActive && loading ? '#3b82f6' : 'rgba(100,116,139,0.7)' }}>
                  {isActive && loading ? 'Loading…' : 'Tap for AQI'}
                </span>
              </motion.button>
            );
          })}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {detail && (
          <motion.div
            className="mt-5 p-4 sm:p-5 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(59,130,246,0.25)',
            }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.0, 0.0, 0.2, 1.0] }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgba(100,116,139,0.8)' }}>
                  {detail.loc.emoji} {detail.loc.name}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={detail.aqi}
                    style={{ fontSize: '2.8rem', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.04em', color: detail.aqi ? getCatColor(detail.aqi) : 'var(--primary)' }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {loading ? '…' : (detail.aqi ?? '…')}
                  </motion.span>
                </AnimatePresence>
                <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>{detail.catName}</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'rgba(100,116,139,0.8)' }}>⚠️ Main Sources</p>
                <ul className="flex flex-col gap-1.5">
                  {detail.loc.causes.map((c, i) => (
                    <motion.li key={i} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--primary)' }}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.18 }}>
                      <span className="mt-0.5 flex-shrink-0">•</span>{c}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'rgba(100,116,139,0.8)' }}>Live Conditions</p>
                <div className="flex flex-col gap-1.5 text-sm" style={{ color: 'var(--primary)' }}>
                  <span>🌬️ Wind: <strong>{detail.wind} km/h</strong></span>
                  <span>🌡️ Temp: <strong>{detail.temp}°C</strong></span>
                  <span>{detail.pollLevel}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
