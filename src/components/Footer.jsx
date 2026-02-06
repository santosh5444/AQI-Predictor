function Footer({ setCurrentPage }) {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-xl font-bold text-white mb-3">Air Quality Forecasting</h3>
          <p className="text-sm leading-relaxed">An AI-powered platform to predict air quality, analyze pollution trends, and provide health insights for safer living.</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li onClick={() => setCurrentPage("dashboard")} className="hover:text-white cursor-pointer">
              Home
            </li>
            <li onClick={() => setCurrentPage("predict")} className="hover:text-white cursor-pointer">
              Predict AQI
            </li>
            <li onClick={() => setCurrentPage("visualize")} className="hover:text-white cursor-pointer">
              Visualize Data
            </li>
            <li onClick={() => setCurrentPage("about")} className="hover:text-white cursor-pointer">
              About
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">
            Resources
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="https://cpcb.nic.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                CPCB (Central Pollution Control Board)
              </a>
            </li>
            <li>
              <a href="https://earthdata.nasa.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                NASA Earth Data
              </a>
            </li>
            <li>
              <a href="https://www.who.int/health-topics/air-pollution" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WHO Air Quality
              </a>
            </li>
            <li>
              <a href="https://www.airnow.gov/aqi/aqi-basics/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                AQI Standards
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Air Quality Forecasting Dashboard • Built by Chandu
      </div>
    </footer>
  );
}
export default Footer;
