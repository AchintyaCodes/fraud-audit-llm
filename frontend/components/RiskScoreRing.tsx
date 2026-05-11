'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'

interface RiskScoreRingProps {
  score: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  isLoading: boolean
}

const RiskScoreRing: React.FC<RiskScoreRingProps> = ({ score, riskLevel, isLoading }) => {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [showScore, setShowScore] = useState(false)

  useEffect(() => {
    if (!isLoading && score > 0) {
      const timer = setTimeout(() => {
        setAnimatedScore(score)
        setShowScore(true)
      }, 500)
      return () => clearTimeout(timer)
    } else if (isLoading) {
      setShowScore(false)
      setAnimatedScore(0)
    }
  }, [score, isLoading])

  const getRingColor = () => {
    switch (riskLevel) {
      case 'HIGH': return '#ef4444'
      case 'MEDIUM': return '#f59e0b'
      case 'LOW': return '#22c55e'
      default: return '#6b7280'
    }
  }

  const getRingGlow = () => {
    switch (riskLevel) {
      case 'HIGH': return '0 0 30px rgba(239, 68, 68, 0.6)'
      case 'MEDIUM': return '0 0 30px rgba(245, 158, 11, 0.6)'
      case 'LOW': return '0 0 30px rgba(34, 197, 94, 0.6)'
      default: return 'none'
    }
  }

  const circumference = 2 * Math.PI * 90 // radius = 90
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedScore * circumference)

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`relative ${riskLevel === 'HIGH' ? 'risk-ring-pulse' : ''}`}>
        {/* Background Ring */}
        <svg width="200" height="200" className="transform -rotate-90">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            fill="transparent"
          />
          
          {/* Progress Ring */}
          <AnimatePresence>
            {!isLoading && (
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                stroke={getRingColor()}
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circumference }}
                animate={{ 
                  strokeDashoffset: strokeDashoffset,
                  filter: `drop-shadow(${getRingGlow()})`
                }}
                transition={{ 
                  duration: 2, 
                  ease: "easeOut",
                  delay: 0.5 
                }}
                style={{
                  filter: `drop-shadow(${getRingGlow()})`
                }}
              />
            )}
          </AnimatePresence>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                <div className="text-sm text-gray-400">Analyzing...</div>
              </motion.div>
            ) : showScore ? (
              <motion.div
                key="score"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-1">
                  <CountUp
                    start={0}
                    end={score * 100}
                    duration={2}
                    decimals={1}
                    suffix="%"
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 0.3 }}
                  className={`text-sm font-semibold ${
                    riskLevel === 'HIGH' ? 'text-high-risk' :
                    riskLevel === 'MEDIUM' ? 'text-medium-risk' :
                    'text-low-risk'
                  }`}
                >
                  {riskLevel} RISK
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-gray-400 mb-1">---%</div>
                <div className="text-sm text-gray-500">No Analysis</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Risk Level Indicator */}
      <AnimatePresence>
        {!isLoading && showScore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <div className="text-lg font-semibold text-gray-300 mb-2">
              Fraud Probability Assessment
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-low-risk rounded-full"></div>
                <span className="text-sm text-gray-400">Low (&lt;30%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-medium-risk rounded-full"></div>
                <span className="text-sm text-gray-400">Medium (30-70%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-high-risk rounded-full"></div>
                <span className="text-sm text-gray-400">High (&gt;70%)</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RiskScoreRing