/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, fadeUp, viewport } from "../animations/variants";

const TEAM = [
  { name: "Santosh",    role: "Lead Developer", url: "https://www.linkedin.com/in/rama-santosh-reddy-dwarampudi-781974319/" },
  { name: "HemaChandu", role: "Lead Developer", url: "https://www.linkedin.com/in/hemachandu-animireddy/" },
  { name: "Pranathi",   role: "Developer",      url: "https://www.linkedin.com/in/pranathi-adari-875913330?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
  { name: "Nirmal",     role: "Developer",      url: "https://www.linkedin.com/in/nirmal-arikireddy-8127b4328?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
  { name: "Sowmya",     role: "Developer",      url: "#" },
];

const LinkedInIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#60a5fa' }}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const UserIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#94a3b8' }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

function TeamMember({ name, role, url }) {
  const isLinked = url !== "#";
  return (
    <motion.div whileHover={isLinked ? { x: 4 } : {}}>
      <a
        href={isLinked ? url : undefined}
        target={isLinked ? "_blank" : undefined}
        rel={isLinked ? "noopener noreferrer" : undefined}
        className={`flex items-center gap-3 group transition-all duration-200 ${!isLinked ? 'cursor-default' : ''}`}
      >
        <span className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-colors duration-200"
              style={{ background: isLinked ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.06)' }}>
          {isLinked ? <LinkedInIcon /> : <UserIcon />}
        </span>
        <div>
          <span className={`text-sm font-semibold block leading-tight transition-colors duration-200 ${isLinked ? 'text-slate-200 group-hover:text-white' : 'text-slate-400'}`}>
            {name}
            {role === "Lead Developer" && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-[0.6rem] font-bold tracking-widest uppercase align-middle" style={{ background: 'rgba(59,130,246,0.2)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' }}>Lead</span>
            )}
          </span>
          <span className="text-xs text-slate-500">{role}</span>
        </div>
      </a>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="text-slate-300 py-16 px-6 mt-12" style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.85), #020617)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 10 }}>
      {/* Top subtle glow line */}
      <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)' }} />
      
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {/* About */}
        <motion.div variants={staggerItem} className="md:col-span-2 lg:col-span-1 pr-6 border-slate-800 lg:border-r border-b lg:border-b-0 pb-8 lg:pb-0">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }} />
            AQI Dashboard
          </h3>
          <p className="text-sm leading-relaxed text-slate-400">
            An advanced AI-powered platform designed to dynamically predict air quality, analyze complex historical pollution trends, and provide vital health insights for a safer, cleaner future.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={staggerItem} className="lg:pl-6">
          <h4 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            Navigation
          </h4>
          <ul className="space-y-3 test-sm">
            {[{ to: "/", label: "Home" }, { to: "/predict", label: "Predict AQI" }, { to: "/about", label: "About" }].map(({ to, label }) => (
              <li key={to}>
                <motion.div whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
                  <Link to={to} className="text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                    <span className="text-slate-600 transition-colors duration-200 group-hover:text-blue-500">›</span> {label}
                  </Link>
                </motion.div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Resources */}
        <motion.div variants={staggerItem}>
          <h4 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            External Resources
          </h4>
          <ul className="space-y-3 text-sm">
            {[
              { href: "https://cpcb.nic.in/",                            label: "CPCB India" },
              { href: "https://earthdata.nasa.gov/",                     label: "NASA Earth Data" },
              { href: "https://giovanni.gsfc.nasa.gov/giovanni/",        label: "NASA Giovanni" },
              { href: "https://www.who.int/health-topics/air-pollution", label: "WHO Air Quality" },
              { href: "https://www.airnow.gov/aqi/aqi-basics/",          label: "Global Standards" },
            ].map(({ href, label }) => (
              <li key={href}>
                <motion.div whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
                  <a href={href} target="_blank" rel="noopener noreferrer"
                     className="text-slate-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2">
                    <span className="text-slate-600 transition-colors duration-200 group-hover:text-blue-500">›</span> {label}
                  </a>
                </motion.div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Team */}
        <motion.div variants={staggerItem} className="md:col-span-2">
          <h4 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            The Team
          </h4>

          {/* Mobile */}
          <div className="flex flex-col gap-4 md:hidden">
            {TEAM.map(m => <TeamMember key={m.name} {...m} />)}
          </div>

          {/* Desktop dual columns */}
          <div className="hidden md:grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex flex-col gap-4">
              {[TEAM[0], TEAM[2], TEAM[3]].map(m => <TeamMember key={m.name} {...m} />)}
            </div>
            <div className="flex flex-col gap-4">
              {[TEAM[1], TEAM[4]].map(m => <TeamMember key={m.name} {...m} />)}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Footer Signature */}
      <motion.div
        className="max-w-7xl mx-auto border-t border-slate-800/80 mt-16 pt-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <p>&copy; {new Date().getFullYear()} Visakhapatnam AQI Intelligence Dashboard. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Designed with <span className="text-red-500 animate-pulse">❤️</span> for a cleaner tomorrow
        </p>
      </motion.div>
    </footer>
  );
}

export default Footer;
