import aboutBg from "../assets/about1.JPG";

function About() {
  return (
    <div className="pt-24 pb-32 min-h-screen relative px-6 overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
        style={{ backgroundImage: `url(${aboutBg})` }}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* PAGE HEADER */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            About This Project
          </h1>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto">
            An AI-powered system designed to forecast air quality, analyze
            pollution trends, and support health-aware decision making.
          </p>
        </div>

        {/* SECTIONS */}
        <div className="space-y-12">

          {/* PROJECT OVERVIEW */}
          <section className="
            bg-white/10
            border border-white/25
            backdrop-blur-md
            rounded-2xl
            shadow-lg
            p-8
            hover:border-white/40
            hover:-translate-y-1
            transition-all duration-300
          ">
            <h2 className="text-2xl font-bold text-white mb-3">
              Project Overview
            </h2>
            <p className="text-gray-200 leading-relaxed">
              The Air Quality Forecasting Dashboard visualizes historical air
              pollution data and predicts future air quality indicators such
              as AQI, PM2.5, and PM10. By combining environmental datasets
              with machine learning models, the system provides meaningful
              insights into pollution patterns and trends.
            </p>
          </section>

          {/* DATA SOURCES */}
          <section className="
            bg-white/10
            border border-white/25
            backdrop-blur-md
            rounded-2xl
            shadow-lg
            p-8
            hover:border-white/40
            hover:-translate-y-1
            transition-all duration-300
          ">
            <h2 className="text-2xl font-bold text-white mb-4">
              Data Sources
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-200">
              <li>🌍 Central Pollution Control Board (CPCB)</li>
              <li>🛰️ NASA Earth Observation Data</li>
              <li>🏥 World Health Organization (WHO)</li>
              <li>📊 AQI Standard Reference Data</li>
            </ul>
          </section>

          {/* MACHINE LEARNING MODEL */}
          <section className="
            bg-white/10
            border border-white/25
            backdrop-blur-md
            rounded-2xl
            shadow-lg
            p-8
            hover:border-white/40
            hover:-translate-y-1
            transition-all duration-300
          ">
            <h2 className="text-2xl font-bold text-white mb-3">
              Machine Learning Model
            </h2>
            <p className="text-gray-200 leading-relaxed">
              Supervised machine learning models are trained using historical
              air quality and meteorological data. Temporal patterns,
              pollutant concentrations, and environmental variables are
              used as features to forecast future AQI values. Performance
              is evaluated using standard regression metrics.
            </p>
          </section>

          {/* TECHNOLOGIES USED */}
          <section className="
            bg-white/10
            border border-white/25
            backdrop-blur-md
            rounded-2xl
            shadow-lg
            p-8
            hover:border-white/40
            hover:-translate-y-1
            transition-all duration-300
          ">
            <h2 className="text-2xl font-bold text-white mb-4">
              Technologies Used
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "React.js",
                "Tailwind CSS",
                "Python",
                "Scikit-learn",
                "Data Visualization Libraries",
                "Environmental Datasets"
              ].map((tech) => (
                <div
                  key={tech}
                  className="
                    bg-white/10
                    border border-white/20
                    rounded-lg
                    px-4 py-3
                    text-gray-100
                    text-sm
                    font-medium
                  "
                >
                  {tech}
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default About;

