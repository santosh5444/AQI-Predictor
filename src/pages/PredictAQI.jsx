import { useState } from "react";

function PredictAQI() {
  const [csvFile, setCsvFile] = useState(null);
  const [location, setLocation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    if (!csvFile || !location) {
      alert("Please upload a CSV file and enter location");
      return;
    }

    setLoading(true);

    // 🔗 ML integration point (mock for now)
    setTimeout(() => {
      setResult({
        aqi: 142,
        category: "Unhealthy",
        message:
          "Air quality is unhealthy for sensitive groups. Limit prolonged outdoor activities."
      });
      setLoading(false);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 1500);
  };

  return (
    <div className="pt-24 pb-32 min-h-screen bg-gray-100 px-6">
        <button
            onClick={() => window.history.back()}
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            ← Back
          </button>
      <div className="max-w-4xl mx-auto">
        {/* PAGE HEADER WITH BACK */}
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Predict Air Quality Index
          </h1>
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-600 mb-10 max-w-3xl">
          Upload air quality data in CSV format, select a location, and
          generate AQI predictions using a trained machine learning model.
        </p>

        {/* UPLOAD CSV */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Upload Input Data (CSV)
          </h2>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files[0])}
            className="block w-full text-sm text-gray-700
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:bg-[#33006F] file:text-white
              hover:file:opacity-90 cursor-pointer"
          />

          {csvFile && (
            <p className="text-sm text-gray-600 mt-2">
              Selected file: <strong>{csvFile.name}</strong>
            </p>
          )}
        </div>

        {/* LOCATION + PREDICT */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Prediction Settings
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Visakhapatnam"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#33006F]"
            />
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="px-8 py-3 bg-[#33006F] text-white font-semibold rounded-xl
              transition-all duration-300 shadow-lg
              hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Predicting..." : "Predict AQI"}
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Prediction Result
            </h2>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-gray-600">Predicted AQI</p>
                <p className="text-5xl font-extrabold text-[#33006F]">
                  {result.aqi}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Category: {result.category}
                </p>
              </div>

              <div className="md:max-w-sm">
                <p className="text-gray-700 leading-relaxed">
                  {result.message}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default PredictAQI;
