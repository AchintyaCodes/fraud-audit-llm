'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Activity, TrendingUp, Network, Zap } from 'lucide-react'

interface TransactionFormProps {
  onSubmit: (data: TransactionData) => void
  isLoading: boolean
}

interface TransactionData {
  amount: number
  v14: number  // Behavioral Score A
  v10: number  // Behavioral Score B
  v12: number  // Behavioral Score C
  v4: number   // Network Pattern Score
  v17: number  // Transaction Velocity
  v1?: number
  v2?: number
  v3?: number
  v5?: number
  v6?: number
  v7?: number
  v8?: number
  v9?: number
  v11?: number
  v13?: number
  v15?: number
  v16?: number
  v18?: number
  v19?: number
  v20?: number
  v21?: number
  v22?: number
  v23?: number
  v24?: number
  v25?: number
  v26?: number
  v27?: number
  v28?: number
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<TransactionData>({
    amount: 2000,
    v14: -10,
    v10: -6,
    v12: -5,
    v4: -4,
    v17: -5
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Add all V features with defaults
    const fullData = {
      ...formData,
      v1: 0,
      v2: 0,
      v3: 0,
      v5: 0,
      v6: 0,
      v7: 0,
      v8: 0,
      v9: 0,
      v11: 0,
      v13: 0,
      v15: 0,
      v16: 0,
      v18: 0,
      v19: 0,
      v20: 0,
      v21: 0,
      v22: 0,
      v23: 0,
      v24: 0,
      v25: 0,
      v26: 0,
      v27: 0,
      v28: 0
    }
    
    onSubmit(fullData)
  }

  const handleSliderChange = (field: keyof TransactionData, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Transaction Amount */}
      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-text-primary">
          <DollarSign className="w-4 h-4 mr-2 text-accent-blue" />
          Transaction Amount ($)
        </label>
        <div className="relative">
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
            className="w-full h-14 px-4 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:border-accent-blue focus:outline-none transition-colors"
            placeholder="Enter amount"
            min="0"
            step="0.01"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Behavioral Score A (V14) */}
      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-text-primary">
          <Activity className="w-4 h-4 mr-2 text-accent-blue" />
          Behavioral Score A
          <span className="ml-2 text-xs text-text-secondary">({formData.v14})</span>
        </label>
        <div className="relative">
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={formData.v14}
            onChange={(e) => handleSliderChange('v14', parseFloat(e.target.value))}
            className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-text-tertiary mt-1">
            <span>-10</span>
            <span>0</span>
            <span>+10</span>
          </div>
        </div>
        <p className="text-xs text-text-tertiary">
          Anonymized behavioral pattern derived from transaction network analysis
        </p>
      </div>

      {/* Behavioral Score B (V10) */}
      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-text-primary">
          <TrendingUp className="w-4 h-4 mr-2 text-accent-blue" />
          Behavioral Score B
          <span className="ml-2 text-xs text-text-secondary">({formData.v10})</span>
        </label>
        <div className="relative">
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={formData.v10}
            onChange={(e) => handleSliderChange('v10', parseFloat(e.target.value))}
            className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-text-tertiary mt-1">
            <span>-10</span>
            <span>0</span>
            <span>+10</span>
          </div>
        </div>
        <p className="text-xs text-text-tertiary">
          Anonymized behavioral pattern derived from transaction network analysis
        </p>
      </div>

      {/* Behavioral Score C (V12) */}
      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-text-primary">
          <Activity className="w-4 h-4 mr-2 text-accent-blue" />
          Behavioral Score C
          <span className="ml-2 text-xs text-text-secondary">({formData.v12})</span>
        </label>
        <div className="relative">
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={formData.v12}
            onChange={(e) => handleSliderChange('v12', parseFloat(e.target.value))}
            className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-text-tertiary mt-1">
            <span>-10</span>
            <span>0</span>
            <span>+10</span>
          </div>
        </div>
        <p className="text-xs text-text-tertiary">
          Anonymized behavioral pattern derived from transaction network analysis
        </p>
      </div>

      {/* Network Pattern Score (V4) */}
      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-text-primary">
          <Network className="w-4 h-4 mr-2 text-accent-blue" />
          Network Pattern Score
          <span className="ml-2 text-xs text-text-secondary">({formData.v4})</span>
        </label>
        <div className="relative">
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={formData.v4}
            onChange={(e) => handleSliderChange('v4', parseFloat(e.target.value))}
            className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-text-tertiary mt-1">
            <span>-10</span>
            <span>0</span>
            <span>+10</span>
          </div>
        </div>
        <p className="text-xs text-text-tertiary">
          Anonymized behavioral pattern derived from transaction network analysis
        </p>
      </div>

      {/* Transaction Velocity (V17) */}
      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-text-primary">
          <Zap className="w-4 h-4 mr-2 text-accent-blue" />
          Transaction Velocity
          <span className="ml-2 text-xs text-text-secondary">({formData.v17})</span>
        </label>
        <div className="relative">
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={formData.v17}
            onChange={(e) => handleSliderChange('v17', parseFloat(e.target.value))}
            className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-text-tertiary mt-1">
            <span>-10</span>
            <span>0</span>
            <span>+10</span>
          </div>
        </div>
        <p className="text-xs text-text-tertiary">
          Anonymized behavioral pattern derived from transaction network analysis
        </p>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-accent-blue hover:bg-accent-blue-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all btn-hover"
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Analyzing...</span>
          </div>
        ) : (
          'Analyze Transaction'
        )}
      </motion.button>
    </form>
  )
}

export default TransactionForm