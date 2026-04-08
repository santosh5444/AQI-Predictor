function PredictionPage() {
  return (
    <div className="pt-16">
      <iframe
        src="http://localhost:3001" // 🔥 change port if needed
        title="AQI Prediction"
        className="w-full h-[90vh] border-none"
      />
    </div>
  );
}

export default PredictionPage;
