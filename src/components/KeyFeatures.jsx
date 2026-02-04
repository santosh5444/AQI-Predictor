function KeyFeatures() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Key Features
        </h2>
        <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Our platform provides intelligent tools to analyze air quality,
          forecast pollution trends, and support informed health decisions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-100 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">📡</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Real-Time Prediction
            </h3>
            <p className="text-gray-600">
              Get near real-time air quality predictions powered by
              machine learning models and environmental data.
            </p>
          </div>
          <div className="bg-gray-100 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Trend Analysis
            </h3>
            <p className="text-gray-600">
              Analyze historical and future air pollution trends to
              understand long-term environmental patterns.
            </p>
          </div>
          <div className="bg-gray-100 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">🩺</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Health Advisory
            </h3>
            <p className="text-gray-600">
              Receive health recommendations based on AQI levels to
              minimize exposure and protect public health.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
export default KeyFeatures;
