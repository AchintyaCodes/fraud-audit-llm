'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Shield, MapPin, History, Smartphone } from 'lucide-react'

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Transaction Amount */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Transaction Amount ($)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-4 w-5 h-5 text-gray-400 z-10" />
          <input
            type="number"
            step="0.01"
            value={formData.transaction_amount}
            onChange={(e) => handleInputChange('transaction_amount', parseFloat(e.target.value) || 0)}
            onFocus={() => setFocusedField('amount')}
            onBlur={() => setFocusedField(null)}
            disabled={isLoading}
            className="w-full h-14 pl-12 pr-4 pt-5 pb-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-all duration-200 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Merchant Category */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Merchant Category
        </label>
        <div className="relative">
          <Shield className="absolute left-3 top-4 w-5 h-5 text-gray-400 z-10" />
          <select
            value={formData.merchant_category}
            onChange={(e) => handleInputChange('merchant_category', parseInt(e.target.value))}
            onFocus={() => setFocusedField('merchant')}
            onBlur={() => setFocusedField(null)}
            disabled={isLoading}
            className="w-full h-14 pl-12 pr-4 pt-5 pb-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-all duration-200 text-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {merchantCategories.map(category => (
              <option key={category.value} value={category.value} className="bg-card text-white">
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Time of Day */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Time of Day (24hr format)
        </label>
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
          className="w-full h-14 px-4 pt-5 pb-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-all duration-200 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="text-xs text-gray-400">
          Current: {Math.floor(formData.time_of_day)}:{String(Math.round((formData.time_of_day % 1) * 60)).padStart(2, '0')}
        </div>
      </div>

      {/* Location Mismatch Toggle */}
      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg min-h-14">
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div>
            <div className="font-medium text-white">Location Mismatch</div>
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
      </div>

      {/* Previous Fraud History Toggle */}
      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg min-h-14">
        <div className="flex items-center space-x-3">
          <History className="w-5 h-5 text-gray-400" />
          <div>
            <div className="font-medium text-white">Previous Fraud History</div>
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
      </div>

      {/* Device Risk Score Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-white">Device Risk Score</span>
          </div>
          <span className="text-primary font-bold text-lg">{formData.device_risk_score}</span>
        </div>
        <div className="text-sm text-gray-400 mb-2">Risk level of the device used</div>
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
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full h-13 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#3b82f6] text-white font-semibold rounded-xl transition-all duration-300 ripple disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ height: '52px' }}
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
      </div>
    </form>
  )
}

export default TransactionForm