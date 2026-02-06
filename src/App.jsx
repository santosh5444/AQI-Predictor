import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import PredictAQI from "./pages/PredictAQI";
import Visualization from "./pages/Visualization";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const navigate = (page) => {
    setCurrentPage(page);
    window.history.pushState({ page }, "", `#${page}`);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.page) {
        setCurrentPage(event.state.page);
      } else {
        setCurrentPage("dashboard");
      }
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  return (
    <>
      <Navbar setCurrentPage={navigate} />
      {currentPage === "dashboard" && (
        <Dashboard setCurrentPage={navigate} />
      )}
      {currentPage === "about" && <About />}
      {currentPage === "predict" && <PredictAQI />}
      {currentPage === "visualize" && <Visualization />}
      <Footer setCurrentPage={navigate} />
    </>
  );
}

export default App;


