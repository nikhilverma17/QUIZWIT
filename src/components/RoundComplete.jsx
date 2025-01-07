import React from "react";
import { motion } from "framer-motion";

function RoundComplete({ round, teamNames, scores, totalRounds, onNextRound }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-100 to-purple-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8 m-4">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold mb-6 text-indigo-700"
          variants={itemVariants}
        >
          Round {round} Complete!
        </motion.h2>
        <motion.p
          className="text-lg sm:text-xl mb-6 text-gray-700"
          variants={itemVariants}
        >
          Current Scores:
        </motion.p>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12"
          variants={itemVariants}
        >
          {teamNames.map((teamName, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-md border border-indigo-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-indigo-800">
                {teamName || `Team ${index + 1}`}
              </h3>
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">
                {scores[index]}
              </p>
            </motion.div>
          ))}
        </motion.div>
        <motion.p
          className="text-base sm:text-lg text-gray-800 font-semibold mb-8 text-center"
          variants={itemVariants}
        >
          {round < totalRounds ? (
            <>
              Get ready for the next round!
              <motion.div
                className="mt-4 text-4xl"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                🚀
              </motion.div>
            </>
          ) : (
            <>
              Congratulations! The game is complete!
              <motion.div
                className="mt-4 text-4xl"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                🏆
              </motion.div>
            </>
          )}
        </motion.p>
        {round < totalRounds && (
          <motion.button
            onClick={onNextRound}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={itemVariants}
          >
            Next Round
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default RoundComplete;
