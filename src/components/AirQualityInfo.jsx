import { useState } from "react";

const factors = {
  AQI: "The Air Quality Index (AQI) is a scale used to report daily air quality, turning complex pollutant data into a single, easy-to-understand number, color, and category (like Good, Moderate, Poor, Severe) to show how polluted the air is and its potential health effects, with higher numbers indicating worse pollution and greater health risks. It helps people understand if air quality is healthy or if sensitive groups should take precautions, covering pollutants like particulate matter, ozone, and carbon monoxide.",
  PM25: "PM2.5 refers to fine particulate matter air pollution, consisting of tiny particles or droplets with a diameter of 2.5 micrometers or less—about 30 times smaller than a human hair. Primarily produced through combustion (vehicles, power plants, wildfires), these particles are dangerous because they can travel deep into the lungs and enter the bloodstream",
  PM10: "PM10 refers to inhalable coarse particulate matter (solid or liquid) with a diameter of 10 micrometers or less—about 1/5 to 1/7 the width of a human hair. These particles, including dust, smoke, soot, and chemicals, are small enough to penetrate deep into the lungs. ",
  AOD: "AOD stands for Aerosol Optical Depth, a measure of how sunlight is blocked by particles (dust, smoke, pollution) in the atmosphere, indicating total column aerosol loading. It is used to estimate surface-level PM2.5 (particle pollution) for AQI monitoring. AOD values less than 0.1 indicate clean air, while values over 1.0 signify significant haze.",
  NO2: "Nitrogen dioxide (NO₂) in the Air Quality Index (AQI) is a highly reactive, reddish-brown toxic gas primarily produced from burning fossil fuels (cars, power plants). It acts as a key indicator for nitrogen oxide NOx pollution, causing respiratory issues like coughing and asthma, and contributes to photochemical smog, particulate matter, and ozone formation.",
  SO2: "Sulfur Dioxide (SO₂) in the Air Quality Index (AQI) is a colorless, pungent gas—primarily produced by burning fossil fuels like coal in power plants and industries—used as a key indicator of air pollution. It causes respiratory issues, forms acid rain, and is highly damaging to the respiratory system. ",
  O3: "Ozone (O₃) in the Air Quality Index (AQI) refers to ground-level or bad ozone, a primary component of smog created by chemical reactions between pollutants from vehicles and industry in sunlight. It is a major respiratory irritant monitored to assess health risks, with levels tracked over 8-hour periods to determine air safety. ",
  CO: "Carbon Monoxide (CO) in the Air Quality Index (AQI) is a colorless, odorless, and tasteless toxic gas produced by the incomplete combustion of carbon-based fuels. As a key pollutant monitored for air quality, high concentrations of CO are dangerous, reducing oxygen delivery to body organs. Major sources include motor vehicles, industrial processes, and wildfires. ",
  RH:"Relative humidity (RH) in Air Quality Index (AQI) reports measures the amount of water vapor present in the air compared to the maximum it can hold at that temperature, expressed as a percentage. It is a critical meteorological factor because high humidity (typically >70%) can cause particles like PM2.5 to absorb moisture, swell, and increase in weight, which can falsely elevate sensor-based, low-cost AQI readings. "
};

function AirQualityInfo() {
  const [active, setActive] = useState("AQI");
  return (
    <section className="bg-gray-100 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Understanding Air Quality Factors</h2>
        <p className="text-gray-600 mb-10 max-w-3xl">Click on a factor to learn what it means and how it affects health.</p>
        <div className="flex flex-wrap gap-4 mb-10">
          {Object.keys(factors).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`px-5 py-2 rounded-full border font-medium transition
                ${
                  active === key
                    ? "bg-[#33006F] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow p-8 text-gray-700 leading-relaxed">
          {factors[active]}
        </div>
      </div>
    </section>
  );
}
export default AirQualityInfo;
