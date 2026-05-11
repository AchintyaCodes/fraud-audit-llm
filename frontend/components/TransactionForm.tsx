'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, DollarSign, Clock, MapPin, Shield, History, Smartphone } from 'lucide-react'

interface TransactionData {
  transaction_amount: number
  merchant_category: number
  time_of_day: number
  location_mismatch: boolean
  previous_fraud_history: boolean
  device_risk_score: number
}

interface TransactionFormProps {
  onSubmit: (data: TransactionData) => void
  isLoading: boolean
}

const merchantCategories = [
  { value: 0, label: 'Grocery Stores' },
  { value: 1, label: 'Gas Stations' },
  { value: 2, label: 'Restaurants' },
  { value: 3, label: 'Retail Stores' },
  { value: 4, label: 'Online Shopping' },
  { value: 5, label: 'ATM Withdrawals' },
  { value: 6, label: 'Hotels' },
  { value: 7, label: 'Airlines' },
  { value: 8, label: 'Car Rentals' },
  { value: 9, label: 'Entertainment' },
  { value: 10, label: 'Healthcare' },
  { value: 11, label: 'Insurance' },
  { value: 12, label: 'Utilities' },
  { value: 13, label: 'Government' },
  { value: 14, label: 'Education' },
  { value: 15, label: 'High-Risk Merchants' },
  { value: 16, label: 'Gambling' },
  { value: 17, label: 'Adult Services' },
  { value: 18, label: 'Cryptocurrency' },
  { value: 19, label: 'Money Transfer' },
  { value: 20, label: 'Other' }
]

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<TransactionData>({
    transaction_amount: 15000,
    merchant_category: 15,
    time_of_day: 3.5,
    location_mismatch: true,
    previous_fraud_history: true,
    device_risk_score: 85
  })

  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof TransactionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const inputVariants = {
    focused: { scale: 1.02, boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
    unfocused: { scale: 1, boxShadow: '0 0 0px rgba(59, 130, 246, 0)' }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Transaction Amount */}
      <motion.div 
        className="floating-label"
        variants={inputVariants}
        animate={focusedField === 'amount' ? 'focused' : 'unfocused'}
      >
        <div className="relative">
          <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />
          <input
            type="number"
            step="0.01"
            value={formData.transaction_amount}
            onChange={(e) => handleInputChange('transaction_amount', parseFloat(e.target.value) || 0)}
            onFocus={() => setFocusedField('amount')}
            onBlur={() => setFocusedField(null)}
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-all duration-200 text-white placeholder-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Transaction Amount"
          />
          <label className="absolute left-12 top-3 text-gray-400 transition-all duration-200 pointer-events-none">
            Transaction Amount ($)
          </label>
        </div>
      </motion.div>

      {/* Merchant Category */}
      <motion.div 
        className="floating-label"
        variants={inputVariants}
        animate={focusedField === 'merchant' ? 'focused' : 'unfocused'}
      >
        <div className="relative">
          <Shield className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />
          <select
            value={formData.merchant_category}
            onChange={(e) => handleInputChange('merchant_category', parseInt(e.target.value))}
            onFocus={() => setFocusedField('merchant')}
            onBlur={() => setFocusedField(null)}
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-all duration-200 text-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {merchantCategories.map(category => (
              <option key={category.value} value={category.value} className="bg-card text-white">
                {category.label}
              </option>
            ))}
          </select>
          <label className="absolute left-12 -top-2 text-xs text-primary bg-background px-2">
            Merchant Category
          </label>
        </div>
      </motion.div>

      {/* Time of Day */}
      <motion.div 
        className="floating-label"
        variants={inputVariants}
        animate={focusedField === 'time' ? 'focused' : 'unfocused'}
      >
        <div className="relative">
          <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />
          <input
            type="number"
            step="0.1"
            min="0"
            max="23.9"
            value={formData.time_of_day}
            onChange={(e) => handleInputChange('time_of_day', parseFloat(e.target.value) || 0)}
            onFocus={() => setFocusedField('time')}
            onBlur={() => setFocusedField(null)}
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-all duration-200 text-white placeholder-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Time of Day"
          />
          <label className="absolute left-12 top-3 text-gray-400 transition-all duration-200 pointer-events-none">
            Time of Day (24hr format)
          </label>
        </div>
        <div className="mt-1 text-xs text-gray-400">
          Current: {Math.floor(formData.time_of_day)}:{String(Math.round((formData.time_of_day % 1) * 60)).padStart(2, '0')}
        </div>
      </motion.div>

      {/* Location Mismatch Toggle */}
      <motion.div 
        className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg"
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
      >
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div>
            <div className="font-medium">Location Mismatch</div>
            <div className="text-sm text-gray-400">Transaction from unusual location</div>
          </div>
        </div>
        <motion.button
          type="button"
          onClick={() => handleInputChange('location_mismatch', !formData.location_mismatch)}
          disabled={isLoading}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            formData.location_mismatch ? 'bg-primary' : 'bg-gray-600'
          }`}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
        >
          <motion.div
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
            animate={{ x: formData.location_mismatch ? 26 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.button>
      </motion.div>

      {/* Previous Fraud History Toggle */}
      <motion.div 
        className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg"
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
      >
        <div className="flex items-center space-x-3">
          <History className="w-5 h-5 text-gray-400" />
          <div>
            <div className="font-medium">Previous Fraud History</div>
            <div className="text-sm text-gray-400">Customer has fraud history</div>
          </div>
        </div>
        <motion.button
          type="button"
          onClick={() => handleInputChange('previous_fraud_history', !formData.previous_fraud_history)}
          disabled={isLoading}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            formData.previous_fraud_history ? 'bg-primary' : 'bg-gray-600'
          }`}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
        >
          <motion.div
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
            animate={{ x: formData.previous_fraud_history ? 26 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.button>
      </motion.div>

      {/* Device Risk Score Slider */}
      <motion.div 
        className="space-y-3"
        variants={inputVariants}
        animate={focusedField === 'device' ? 'focused' : 'unfocused'}
      >
        <div className="flex items-center space-x-3">
          <Smartphone className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">Device Risk Score</span>
              <span className="text-primary font-bold">{formData.device_risk_score}</span>
            </div>
            <div className="text-sm text-gray-400">Risk level of the device used</div>
          </div>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={formData.device_risk_score}
            onChange={(e) => handleInputChange('device_risk_score', parseInt(e.target.value))}
            onFocus={() => setFocusedField('device')}
            onBlur={() => setFocusedField(null)}
            disabled={isLoading}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #22c55e 0%, #f59e0b 50%, #ef4444 100%)`
            }}
          />
          <div 
            className="absolute top-0 h-2 bg-primary rounded-lg pointer-events-none"
            style={{ width: `${formData.device_risk_score}%` }}
          />
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-semibold rounded-lg transition-all duration-300 ripple disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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