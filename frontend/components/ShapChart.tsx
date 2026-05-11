'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'

interface Feature {
  feature: string
  shap_value: number
  contribution: 'fraud' | 'legitimate'
  abs_value: number
}

interface ShapChartProps {
  features: Feature[]
  isLoading: boolean
}

const ShapChart: React.FC<ShapChartProps> = ({ features, isLoading }) => {
  const [animatedFeatures, setAnimatedFeatures] = useState<Feature[]>([])
  const [showChart, setShowChart] = useState(false)

  useEffect(() => {
    if (!isLoading && features.length > 0) {
      // Animate bars in sequence
      features.forEach((feature, index) => {
        setTimeout(() => {
          setAnimatedFeatures(prev => [...prev, feature])
        }, index * 200)
      })
      setShowChart(true)
    } else if (isLoading) {
      setAnimatedFeatures([])
      setShowChart(false)
    }
  }, [features, isLoading])

  const formatFeatureName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  const getBarColor = (contribution: string) => {
    return contribution === 'fraud' ? '#ef4444' : '#3b82f6'
  }

  // Prepare data for the chart
  const chartData = animatedFeatures.map(feature => ({
    name: formatFeatureName(feature.feature),
    value: Math.abs(feature.shap_value),
    originalValue: feature.shap_value,
    contribution: feature.contribution,
    color: getBarColor(feature.contribution)
  }))

  const CustomBar = (props: any) => {
    const { payload, x, y, width, height } = props
    
    return (
      <motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={payload.color}
        initial={{ width: 0 }}
        animate={{ width }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          filter: `drop-shadow(0 0 8px ${payload.color}40)`
        }}
      />
    )
  }

  return (
    <div className="h-80">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full"
          >
            <div className="space-y-3 w-full">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-32 h-4 bg-white/10 rounded skeleton"></div>
                  <div className="flex-1 h-4 bg-white/10 rounded skeleton"></div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : showChart && chartData.length > 0 ? (
          <motion.div
            key="chart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-400">Increases Fraud Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-400">Decreases Fraud Risk</span>
                </div>
              </div>
            </div>

            {/* Custom Horizontal Bar Chart */}
            <motion.div 
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {chartData.map((item, index) => (
                <motion.div
                  key={item.name}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { 
                      opacity: 1, 
                      x: 0,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }
                    }
                  }}
                  className="flex items-center space-x-3"
                >
                  {/* Feature Name */}
                  <div className="w-40 text-sm text-gray-300 text-right">
                    {item.name}
                  </div>
                  
                  {/* Bar Container */}
                  <div className="flex-1 relative">
                    <div className="h-6 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: item.color,
                          boxShadow: `0 0 10px ${item.color}40`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / Math.max(...chartData.map(d => d.value))) * 100}%` }}
                        transition={{ 
                          delay: index * 0.1 + 0.2, 
                          duration: 0.8, 
                          ease: "easeOut",
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        }}
                      />
                    </div>
                    
                    {/* Value Label */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="absolute right-2 top-0 h-6 flex items-center"
                    >
                      <span className="text-xs text-white font-medium">
                        {item.originalValue > 0 ? '+' : ''}{item.originalValue.toFixed(3)}
                      </span>
                    </motion.div>
                  </div>
                  
                  {/* Contribution Icon */}
                  <div className="w-8 flex justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        delay: index * 0.1 + 0.3, 
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                      className={`w-2 h-2 rounded-full ${
                        item.contribution === 'fraud' ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Impact Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: chartData.length * 0.1 + 0.5 }}
              className="mt-6 p-4 rounded-lg border"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="text-sm">
                <span className="font-bold text-white">Impact Analysis:</span>{' '}
                <span className="text-slate-400" style={{ color: '#94a3b8' }}>
                  Features with positive values increase fraud likelihood, while negative values suggest legitimate transaction patterns. The magnitude indicates the strength of influence.
                </span>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-full text-gray-400"
          >
            <div className="text-center">
              <div className="text-lg mb-2">No Analysis Available</div>
              <div className="text-sm">Submit a transaction to see feature contributions</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ShapChart