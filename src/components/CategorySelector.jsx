import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faLightbulb, faFilm, faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion"; // Import framer-motion for smooth animations

const categoryIcons = {
  Cricket: faTrophy,
  Movies: faFilm,
  "General Knowledge and Facts": faLightbulb,
  Technology: faLaptopCode,
};

function CategorySelector({ categories, onSelect, teamName }) {
  return (
    <motion.div
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="text-4xl sm:text-5xl font-extrabold mb-6 text-blue-600 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        Choose Your Category
      </motion.h2>

      <motion.h3
        className="text-xl sm:text-2xl font-semibold mb-8 text-blue-500 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
        <span className="text-purple-500">{teamName}</span> turn to select a category:
      </motion.h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => onSelect(category)}
            className="bg-gradient-to-r from-blue-300 to-purple-300 text-blue-700 font-bold py-4 sm:py-6 px-4 sm:px-5 rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-blue-400 hover:to-purple-400 text-base sm:text-lg lg:text-xl flex flex-col items-center justify-center space-y-3"
            whileHover={{
              scale: 1.1,
              rotate: -5,
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <FontAwesomeIcon
              icon={categoryIcons[category] || faLightbulb}
              size="2x"
              className="transition-transform duration-300 hover:scale-125"
            />
            <span className="text-center">{category}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default CategorySelector;
