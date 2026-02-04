import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import PredictAQI from "./pages/PredictAQI";
import Visualization from "./pages/Visualization";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <>
      <Navbar setCurrentPage={setCurrentPage} />

      {currentPage === "dashboard" && <Dashboard />}
      {currentPage === "about" && <About />}
      {currentPage === "predict" && <PredictAQI />}
      {currentPage === "visualize" && <Visualization />}

      <Footer setCurrentPage={setCurrentPage} />
    </>
  );
}

export default App;


