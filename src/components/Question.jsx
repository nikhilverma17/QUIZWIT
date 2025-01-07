import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import TimeUpModal from './TimeUpModal';

function Question({ question, onAnswer, showAnswer, disableOptions, showTimeUpPopup, onNextQuestion }) {
  if (!question) return null;

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-800 rounded-3xl -z-10"></div>
      
      {/* Question Card */}
      <motion.div 
        className="bg-white rounded-xl p-4 sm:p-6 shadow-lg"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-indigo-600">{question.section}</h3>
        <div className="flex items-center gap-2 sm:gap-4 mb-2">
          <div className="bg-indigo-500 p-2 sm:p-3 rounded-full">
            <FontAwesomeIcon icon={faQuestionCircle} className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{question.question}</h2>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
          <AnimatePresence>
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => onAnswer(index)}
                disabled={showAnswer || disableOptions}
                className={`
                  p-2 sm:p-4 text-left rounded-xl transition-all transform hover:scale-105 flex items-center
                  ${showAnswer 
                    ? index === question.correctAnswer 
                      ? 'bg-green-500 text-white'
                      : index === question.selectedAnswer
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-indigo-100'
                  }
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-indigo-500 text-white font-bold mr-2 sm:mr-4">
                  {['A', 'B', 'C', 'D'][index]}
                </span>
                <span className="font-medium text-sm sm:text-base md:text-lg">{option}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Time's Up Popup */}
      <AnimatePresence>
        {showTimeUpPopup && (
          <TimeUpModal 
            question={question}
            onNextQuestion={onNextQuestion}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Question;
