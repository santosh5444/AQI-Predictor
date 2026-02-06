function Visualization() {
  return (
    <div className="pt-24 pb-32 min-h-screen bg-gray-100 px-6">
        <button
            onClick={() => window.history.back()}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back
          </button>

      <div className="max-w-6xl mx-auto">

        {/* PAGE HEADER WITH BACK */}
        <div className="flex items-center gap-4 mb-8">
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Air Quality Visualization
          </h1>
        </div>

        <p className="text-gray-600 mb-10 max-w-4xl">
          Explore historical trends, pollutant comparisons, and forecasted air
          quality patterns using interactive visualizations.
        </p>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Visualization Filters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Location"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#33006F]"
            />

            <select className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#33006F]">
              <option>AQI</option>
              <option>PM2.5</option>
              <option>PM10</option>
              <option>NO₂</option>
              <option>O₃</option>
            </select>

            <input
              type="date"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#33006F]"
            />

            <input
              type="date"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#33006F]"
            />
          </div>
        </div>

        {/* AQI TREND */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            AQI Trend Over Time
          </h2>

          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-xl text-gray-400">
            Line Chart Placeholder (AQI vs Time)
          </div>
        </div>

        {/* POLLUTANT COMPARISON */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Pollutant Comparison
          </h2>

          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-xl text-gray-400">
            Bar Chart Placeholder (PM2.5, PM10, NO₂, O₃)
          </div>
        </div>

        {/* FORECAST VISUALIZATION */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            AQI Forecast
          </h2>

          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-xl text-gray-400">
            Forecast Chart Placeholder (Future AQI)
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Key Insights
          </h2>

          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>PM2.5 is the dominant pollutant affecting AQI levels.</li>
            <li>Winter months show consistently higher AQI values.</li>
            <li>Forecast indicates increased pollution in upcoming weeks.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default Visualization;

