import React from "react";

function FactPopup({ fact, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      aria-labelledby="fact-popup-title"
      aria-describedby="fact-popup-description"
      role="dialog"
    >
      <div className="bg-gradient-to-br from-purple-700 via-indigo-800 to-indigo-900 rounded-xl p-6 sm:p-8 max-w-sm sm:max-w-lg w-full shadow-xl transform transition-transform duration-500 hover:scale-105">
        <h2
          id="fact-popup-title"
          className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-4 text-center animate__animated animate__fadeIn"
        >
          🌟 Did you know?
        </h2>
        <p
          id="fact-popup-description"
          className="text-lg sm:text-xl text-white mb-6 italic text-center animate__animated animate__fadeInUp"
        >
          "{fact}"
        </p>
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-600 font-semibold py-2 sm:py-3 px-5 sm:px-6 rounded-lg shadow-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-yellow-300"
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
}

export default FactPopup;
