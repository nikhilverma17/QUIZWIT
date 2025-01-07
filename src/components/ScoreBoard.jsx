import React from "react";
import { motion } from "framer-motion";

function ScoreBoard({ scores, teamNames, onClose }) {
  const [score1, score2] = scores;
  const winningTeam =
    score1 > score2 ? teamNames[0] || "Team 1" : teamNames[1] || "Team 2";
  const winningScoreDifference = Math.abs(score1 - score2);

  const handlePlayAgain = () => {
    window.location.reload();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl m-4"
        variants={itemVariants}
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-extrabold text-indigo-600 mb-6 text-center"
        >
          🎉 Game Over!
        </motion.h2>
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <motion.div
            variants={itemVariants}
            className="w-full md:w-1/2 mb-6 md:mb-0"
          >
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-6 shadow-lg mb-4">
              <h3 className="text-xl font-bold text-indigo-800 mb-2">{teamNames[0] || "Team 1"}</h3>
              <p className="text-4xl font-extrabold text-indigo-600">{score1}</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-indigo-800 mb-2">{teamNames[1] || "Team 2"}</h3>
              <p className="text-4xl font-extrabold text-indigo-600">{score2}</p>
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="w-full md:w-1/2 md:pl-8"
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              {winningTeam} Wins!
            </h3>
            <p className="text-2xl text-green-600 mb-4">
              Victory by: {winningScoreDifference} points
            </p>
            <motion.div
              className="text-5xl mb-4"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              🏆
            </motion.div>
            <p className="text-2xl font-bold text-gray-700">
              Congratulations on your performance!
            </p>
          </motion.div>
        </div>
        <motion.div
          variants={itemVariants}
          className="flex justify-center space-x-4"
        >
          <motion.button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </motion.button>
          <motion.button
            onClick={handlePlayAgain}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Play Again
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ScoreBoard;

