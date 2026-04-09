/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, fadeUp, viewport } from "../animations/variants";

const TEAM = [
  { name: "HemaChandu", role: "Lead Developer", url: "https://www.linkedin.com/in/hemachandu-animireddy/" },
  { name: "Santosh",    role: "Lead Developer", url: "https://www.linkedin.com/in/rama-santosh-reddy-dwarampudi-781974319/" },
  { name: "Pranathi",   role: "Developer",      url: "https://www.linkedin.com/in/pranathi-adari-875913330?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
  { name: "Nirmal",     role: "Developer",      url: "#" },
  { name: "Sowmya",     role: "Developer",      url: "#" },
];

const LinkedInIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#60a5fa' }}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

function TeamMember({ name, role, url }) {
  return (
    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
      <a
        href={url}
        target={url === "#" ? "_self" : "_blank"}
        rel="noopener noreferrer"
        className="flex items-center gap-2 group transition-colors duration-200"
      >
        <span className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,0.15)' }}>
          <LinkedInIcon />
        </span>
        <div>
          <span className="text-sm font-semibold text-gray-200 group-hover:text-white block leading-tight">
            {name}
            {role === "Lead Developer" && (
              <span className="ml-1 text-xs text-blue-400 font-normal">(Lead)</span>
            )}
          </span>
          <span className="text-xs text-gray-500">{role}</span>
        </div>
      </a>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {/* About */}
        <motion.div variants={staggerItem}>
          <h3 className="text-xl font-bold text-white mb-3">Air Quality Forecasting</h3>
          <p className="text-sm leading-relaxed">
            An AI-powered platform to predict air quality, analyze pollution
            trends, and provide health insights for safer living.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={staggerItem}>
          <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[{ to: "/", label: "Home" }, { to: "/predict", label: "Predict AQI" }, { to: "/about", label: "About" }].map(({ to, label }) => (
              <li key={to}>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
                  <Link to={to} className="hover:text-white transition-colors duration-200">{label}</Link>
                </motion.div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Resources */}
        <motion.div variants={staggerItem}>
          <h4 className="text-lg font-semibold text-white mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            {[
              { href: "https://cpcb.nic.in/",                            label: "CPCB" },
              { href: "https://earthdata.nasa.gov/",                     label: "NASA Earth Data" },
              { href: "https://www.who.int/health-topics/air-pollution", label: "WHO Air Quality" },
              { href: "https://www.airnow.gov/aqi/aqi-basics/",          label: "AQI Standards" },
            ].map(({ href, label }) => (
              <li key={href}>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
                  <a href={href} target="_blank" rel="noopener noreferrer"
                     className="hover:text-white transition-colors duration-200">
                    {label}
                  </a>
                </motion.div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Team — span 2 cols on desktop for more room */}
        <motion.div variants={staggerItem} className="md:col-span-2">
          <h4 className="text-lg font-semibold text-white mb-3">Our Team</h4>

          {/* Mobile: single row wrap · Desktop: two columns */}
          <div className="flex flex-col gap-3 md:hidden">
            {TEAM.map(m => <TeamMember key={m.name} {...m} />)}
          </div>

          <div className="hidden md:grid grid-cols-2 gap-x-6 gap-y-3 min-w-0">
            {/* Col 1 — HemaChandu + Pranathi + Nirmal */}
            <div className="flex flex-col gap-3 min-w-0">
              {[TEAM[0], TEAM[2], TEAM[3]].map(m => <TeamMember key={m.name} {...m} />)}
            </div>
            {/* Col 2 — Santosh + Sowmya */}
            <div className="flex flex-col gap-3 min-w-0">
              {[TEAM[1], TEAM[4]].map(m => <TeamMember key={m.name} {...m} />)}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom */}
      <motion.div
        className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        &copy; {new Date().getFullYear()} Air Quality Forecasting Dashboard
      </motion.div>
    </footer>
  );
}

export default Footer;
