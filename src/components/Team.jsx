import React from "react";

function Team({ name, score, active }) {
  return (
    <div
      className={`text-center p-4 sm:p-6 rounded-lg transition-all duration-300 shadow-md ${
        active
          ? "bg-gradient-to-r from-blue-400 to-purple-400 text-white scale-105 shadow-lg"
          : "bg-gray-100 text-gray-800"
      }`}
      aria-live={active ? "polite" : "off"}
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-2">{name}</h2>
      <p className="text-3xl sm:text-4xl font-extrabold">{score}</p>
    </div>
  );
}

export default Team;
