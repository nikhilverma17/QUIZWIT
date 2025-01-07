import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

function TimeUpModal({ question, onNextQuestion }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-purple-700 via-indigo-800 to-indigo-900 text-white rounded-xl p-6 sm:p-10 max-w-md w-full text-center shadow-xl transform transition-all duration-300 ease-in-out"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <FontAwesomeIcon
          icon={faClock}
          className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-500 mb-6 animate__animated animate__pulse animate__infinite"
        />
        <h3 className="text-2xl sm:text-3xl font-extrabold mb-6 animate__animated animate__fadeIn text-yellow-400">
          Time's Up!
        </h3>
        <p className="text-lg sm:text-xl mb-6 sm:mb-8 animate__animated animate__fadeIn text-gray-200">
          The correct answer is:
        </p>
        <div className="bg-yellow-100 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8 animate__animated animate__fadeIn">
          <p className="text-xl sm:text-2xl font-bold text-yellow-700">
            {question.options[question.correctAnswer]}
          </p>
        </div>
        <motion.button
          onClick={onNextQuestion}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-lg sm:text-xl hover:from-yellow-600 hover:to-yellow-700 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center mx-auto shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next Question
          <FontAwesomeIcon icon={faArrowRight} className="ml-3 text-lg sm:text-xl" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default TimeUpModal;
