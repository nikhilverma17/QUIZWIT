import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPercent, 
  faSync, 
  faQuestion, 
  faTimes, 
  faClone,
  faBan
} from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'

function Lifeline({ name, onUse, disabled }) {
  const getLifelineIcon = () => {
    switch (name) {
      case '50-50':
        return faPercent
      case 'change':
        return faSync
      case 'hint':
        return faQuestion
      case 'double':
        return faTimes
      case 'doubleDip':
        return faClone
      default:
        return faQuestion
    }
  }

  const getLifelineName = () => {
    switch (name) {
      case '50-50':
        return 'Fifty-Fifty'
      case 'change':
        return 'Change'
      case 'hint':
        return 'Hint'
      case 'double':
        return 'Double'
      case 'doubleDip':
        return 'Double Dip'
      default:
        return name
    }
  }

  const getGradientColors = () => {
    switch (name) {
      case '50-50':
        return 'from-blue-400 to-blue-600'
      case 'change':
        return 'from-green-400 to-green-600'
      case 'hint':
        return 'from-yellow-400 to-yellow-600'
      case 'double':
        return 'from-purple-400 to-purple-600'
      case 'doubleDip':
        return 'from-red-400 to-red-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  return (
    <motion.div 
      className="relative w-full"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.button
        onClick={onUse}
        disabled={disabled}
        className={`
          flex flex-col items-center justify-center
          w-full aspect-square
          bg-gradient-to-br ${getGradientColors()}
          text-white font-bold
          text-xs sm:text-[10px] md:text-[12px] lg:text-[14px]
            p-1 sm:p-1 md:p-1 lg:p-2
          rounded-lg shadow-md
          transition-all duration-300 ease-in-out
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:brightness-110'}
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="relative">
          <FontAwesomeIcon 
            icon={getLifelineIcon()} 
            className="text-[18px] sm:text-[20px] md:text-[24px] lg:text-[26px] mb-1 sm:mb-2" 
          />
          {disabled && (
            <FontAwesomeIcon 
              icon={faBan} 
              className="absolute top-0 left-0 w-full h-full text-red-500 opacity-70"
            />
          )}
        </div>
        <div className="text-center text-[8px] sm:text-[10px] md:text-[10px] lg:text-[10px] leading-tight">
          {getLifelineName()}
        </div>
      </motion.button>
    </motion.div>
  )
}

export default Lifeline
