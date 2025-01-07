import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion'
function Timer({ duration, onTimeUp, shouldReset, isPaused }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [showPopup, setShowPopup] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (shouldReset) {
      setTimeLeft(duration);
    }

    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            setShowPopup(true);
            setTimeout(() => {
              setShowPopup(false);
              onTimeUp();
            }, 2000);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [duration, onTimeUp, shouldReset, isPaused]);
  const percentage = (timeLeft / duration) * 100
  return (
    <div className="w-12 h-12 sm:w-12 sm:h-12 md:w-12 md:h-12 relative">
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <circle
        className="text-gray-200 stroke-current"
        strokeWidth="5"
        cx="50"
        cy="50"
        r="45"
        fill="transparent"
      ></circle>
      <motion.circle
        className="text-blue-500 stroke-current"
        strokeWidth="5"
        strokeLinecap="round"
        cx="50"
        cy="50"
        r="45"
        fill="transparent"
        initial={{ pathLength: 1 }}
        animate={{ pathLength: percentage / 100 }}
        transition={{ duration: 1, ease: "linear" }}
        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
      ></motion.circle>
    </svg>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <p className="text-lg sm:text-lg md:text-lg font-bold">{timeLeft}</p>
    </div>
  </div>
  );
}

export default Timer;

