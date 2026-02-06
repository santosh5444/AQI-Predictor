import { useState } from "react";

function Navbar({ setCurrentPage}) {
  const [open, setOpen] = useState(false);

  const navigate = (page) => {
    setCurrentPage(page);
    setOpen(false); 
  };
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1
          onClick={() => navigate("dashboard")}
          className="text-2xl font-bold text-gray-600 cursor-pointer"
        >
          AQI Predictor
        </h1>
        <nav className="hidden md:flex space-x-8">
          <button
            onClick={() => navigate("dashboard")}
            className="text-gray-700 hover:text-blue-500"
          >
            Home
          </button>
          <button
            onClick={() => navigate("predict")}
            className="text-gray-700 hover:text-blue-500"
          >
            Predict AQI
          </button>

          <button
            onClick={() => navigate("visualize")}
            className="text-gray-700 hover:text-blue-500"
          >
            Visualize Data
          </button>

          <button
            onClick={() => navigate("about")}
            className="text-gray-700 hover:text-blue-500"
          >
            About
          </button>
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700 text-2xl"
        >
          ☰
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <button
            onClick={() => navigate("dashboard")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-blue-500"
          >
            Home
          </button>

          <button
            onClick={() => navigate("predict")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-blue-500"
          >
            Predict AQI
          </button>

          <button
            onClick={() => navigate("visualize")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-blue-500"
          >
            Visualize Data
          </button>

          <button
            onClick={() => navigate("about")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-blue-500"
          >
            About
          </button>
        </div>
      )}
    </header>
  );
}
export default Navbar; 
