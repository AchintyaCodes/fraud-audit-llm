'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface AuditNarrativeProps {
  narrative: string
  recommendedAction: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  timestamp: string
  isLoading: boolean
}

const AuditNarrative: React.FC<AuditNarrativeProps> = ({ 
  narrative, 
  recommendedAction, 
  riskLevel, 
  timestamp, 
  isLoading 
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showAction, setShowAction] = useState(false)

  useEffect(() => {
    if (!isLoading && narrative) {
      setIsTyping(true)
      setDisplayedText('')
      setShowAction(false)
      
      // Typewriter effect with 20ms per character
      let currentIndex = 0
      const typeInterval = setInterval(() => {
        if (currentIndex < narrative.length) {
          setDisplayedText(narrative.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(typeInterval)
          setIsTyping(false)
          setTimeout(() => setShowAction(true), 500)
        }
      }, 20) // 20ms per character as requested

      return () => clearInterval(typeInterval)
    } else if (isLoading) {
      setDisplayedText('')
      setIsTyping(false)
      setShowAction(false)
    }
  }, [narrative, isLoading])

  const getActionIcon = () => {
    switch (recommendedAction) {
      case 'APPROVE':
        return <CheckCircle className="w-5 h-5" />
      case 'FLAG FOR REVIEW':
        return <AlertTriangle className="w-5 h-5" />
      case 'BLOCK':
        return <XCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getActionColor = () => {
    switch (recommendedAction) {
      case 'APPROVE':
        return 'bg-low-risk/20 text-low-risk border-low-risk/30'
      case 'FLAG FOR REVIEW':
        return 'bg-medium-risk/20 text-medium-risk border-medium-risk/30'
      case 'BLOCK':
        return 'bg-high-risk/20 text-high-risk border-high-risk/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Header with timestamp */}
      <AnimatePresence>
        {!isLoading && timestamp && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between text-sm text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Generated: {formatTimestamp(timestamp)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>AI Analysis</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Narrative Content */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="h-4 bg-white/10 rounded skeleton w-3/4"></div>
              <div className="h-4 bg-white/10 rounded skeleton w-full"></div>
              <div className="h-4 bg-white/10 rounded skeleton w-5/6"></div>
              <div className="h-4 bg-white/10 rounded skeleton w-2/3"></div>
              <div className="h-4 bg-white/10 rounded skeleton w-4/5"></div>
              <div className="h-4 bg-white/10 rounded skeleton w-3/5"></div>
            </motion.div>
          ) : narrative ? (
            <motion.div
              key="narrative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="prose prose-invert max-w-none">
                <div className="typewriter text-gray-300 leading-relaxed">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-4 leading-7" style={{ color: '#e2e8f0' }}>
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                          {children}
                        </strong>
                      ),
                      ol: ({ children }) => (
                        <ol className="pl-5 mb-4 list-decimal">
                          {children}
                        </ol>
                      ),
                      ul: ({ children }) => (
                        <ul className="pl-5 mb-4 list-disc">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => (
                        <li className="mb-2" style={{ color: '#e2e8f0' }}>
                          {children}
                        </li>
                      ),
                    }}
                  >
                    {displayedText}
                  </ReactMarkdown>
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-2 h-5 bg-primary ml-1"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-64 text-gray-400"
            >
              <div className="text-center">
                <div className="text-lg mb-2">No Audit Report Available</div>
                <div className="text-sm">Submit a transaction to generate an AI audit report</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recommended Action Badge */}
      <AnimatePresence>
        {showAction && recommendedAction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex justify-center"
          >
            <div className={`
              flex items-center space-x-3 px-6 py-3 rounded-full border
              ${getActionColor()}
              ${riskLevel === 'HIGH' && recommendedAction === 'BLOCK' ? 'pulse-high-risk' : ''}
            `}>
              {getActionIcon()}
              <span className="font-semibold text-lg">
                Recommended Action: {recommendedAction}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compliance Footer */}
      <AnimatePresence>
        {!isLoading && narrative && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="pt-4 border-t border-white/10"
          >
            <div className="text-xs text-gray-500 text-center">
              This report is generated in compliance with Basel III operational risk management requirements 
              and regulatory standards for AI-assisted fraud detection systems.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AuditNarrative