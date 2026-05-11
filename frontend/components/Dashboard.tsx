'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import CountUp from 'react-countup'
import axios from 'axios'
import TransactionForm from './TransactionForm'
import RiskScoreRing from './RiskScoreRing'
import ShapChart from './ShapChart'
import AuditNarrative from './AuditNarrative'
import FloatingParticles from './FloatingParticles'

interface AnalysisResult {
  case_id: string
  timestamp: string
  fraud_probability: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH'
  top_features: Array<{
    feature: string
    shap_value: number
    contribution: 'fraud' | 'legitimate'
    abs_value: number
  }>
  audit_narrative: string
  recommended_action: string
}

interface TransactionData {
  transaction_amount: number
  merchant_category: number
  time_of_day: number
  location_mismatch: boolean
  previous_fraud_history: boolean
  device_risk_score: number
}

const Dashboard: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  // Check if backend is available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/health')
        if (!response.ok) throw new Error('Backend unavailable')
        const data = await response.json()
        setDemoMode(data.services.llm_service === 'demo_mode')
      } catch (error) {
        console.log('Backend unavailable, using demo mode')
        setDemoMode(true)
        // Load demo data for immediate visual impact
        loadDemoData()
      }
    }
    checkBackend()
  }, [])

  const loadDemoData = () => {
    const mockResult: AnalysisResult = {
      case_id: 'FA-DEMO123',
      timestamp: new Date().toISOString(),
      fraud_probability: 0.87,
      risk_level: 'HIGH',
      top_features: [
        { feature: 'transaction_amount', shap_value: 0.45, contribution: 'fraud', abs_value: 0.45 },
        { feature: 'device_risk_score', shap_value: 0.32, contribution: 'fraud', abs_value: 0.32 },
        { feature: 'location_mismatch', shap_value: 0.28, contribution: 'fraud', abs_value: 0.28 },
        { feature: 'previous_fraud_history', shap_value: 0.21, contribution: 'fraud', abs_value: 0.21 },
        { feature: 'time_of_day', shap_value: 0.18, contribution: 'fraud', abs_value: 0.18 },
        { feature: 'merchant_category', shap_value: -0.12, contribution: 'legitimate', abs_value: 0.12 }
      ],
      audit_narrative: `**Risk Assessment Summary**
This transaction exhibits an 87% probability of fraudulent activity, classified as HIGH RISK. The elevated risk score warrants immediate attention and enhanced due diligence procedures.

**Primary Risk Drivers**
1. **Transaction Amount**: Significantly elevated beyond normal parameters, indicating potential suspicious activity patterns.
2. **Device Risk Score**: Deviates from established customer behavioral baselines, suggesting anomalous transaction characteristics.
3. **Location Mismatch**: Presents concerning risk indicators that align with known fraud typologies.

**Recommended Action: BLOCK**
Transaction should be blocked pending manual review and customer verification. Implement enhanced authentication protocols before processing.

**Regulatory Compliance**
This assessment aligns with Basel III operational risk management requirements and AML/CFT regulatory standards. Documentation retained per regulatory retention policies.`,
      recommended_action: 'BLOCK'
    }
    setAnalysisResult(mockResult)
  }

  const analyzeTransaction = async (transactionData: TransactionData) => {
    setIsLoading(true)
    
    try {
      if (demoMode && !analysisResult) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        loadDemoData()
        toast.success('Analysis complete (Demo Mode)')
        
        // Scroll to results on mobile
        setTimeout(() => {
          const resultsSection = document.getElementById('results-section')
          if (resultsSection && window.innerWidth < 1024) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 500)
      } else {
        const response = await fetch('http://localhost:8000/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transactionData),
        })

        if (!response.ok) {
          throw new Error('Analysis failed')
        }

        const result = await response.json()
        setAnalysisResult(result)
        toast.success('Analysis complete')
        
        // Scroll to results on mobile
        setTimeout(() => {
          const resultsSection = document.getElementById('results-section')
          if (resultsSection && window.innerWidth < 1024) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 500)
      }
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Analysis failed - using demo data')
      loadDemoData()
      
      // Scroll to results on mobile even for demo data
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section')
        if (resultsSection && window.innerWidth < 1024) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 500)
    } finally {
      setIsLoading(false)
    }
  }

  const exportPDF = async () => {
    if (!analysisResult) return

    try {
      setIsExporting(true)
      
      const response = await axios.post(
        'http://localhost:8000/export-pdf',
        analysisResult,  // Send analysisResult directly, not nested
        { responseType: 'blob' }
      )

      // Create download link
      const url = URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      )
      const link = document.createElement('a')
      link.href = url
      link.download = `FraudGuard-${analysisResult.case_id}.pdf`
      link.click()
      URL.revokeObjectURL(url)
      
      toast.success('Report downloaded successfully')
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error(`PDF export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExporting(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return 'text-high-risk'
      case 'MEDIUM': return 'text-medium-risk'
      case 'LOW': return 'text-low-risk'
      default: return 'text-gray-400'
    }
  }

  const getRiskGlow = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return 'glow-red'
      case 'MEDIUM': return 'glow-amber'
      case 'LOW': return 'glow-green'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-background dot-grid relative">
      <FloatingParticles />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#111118',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass border-b border-white/10 relative"
      >
        <div className="absolute bottom-0 left-0 right-0 h-0.5 gradient-border"></div>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold logo-shimmer">FraudGuard AI</h1>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            {demoMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm border border-amber-500/30"
              >
                Demo Mode
              </motion.div>
            )}
            <motion.div
              className="flex items-center space-x-2 px-4 py-2 glass rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm">Powered by GPT-4o</span>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-[calc(100vh-120px)]">
          
          {/* Left Panel - Transaction Form */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass rounded-2xl p-6 h-full border border-primary/25 relative overflow-hidden">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/30 via-purple-500/30 to-primary/30 opacity-40 blur-sm"></div>
              <div className="relative z-10">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-primary" />
                Transaction Analysis
              </h2>
              <TransactionForm 
                onSubmit={analyzeTransaction}
                isLoading={isLoading}
              />
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Results */}
          <motion.div
            id="results-section"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-3 space-y-6"
          >
            
            {/* Risk Score Ring */}
            <div className="glass rounded-2xl p-6 border border-primary/25 relative overflow-hidden">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/30 via-purple-500/30 to-primary/30 opacity-40 blur-sm"></div>
              <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Risk Assessment</h3>
                {analysisResult && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Case ID:</span>
                    <span className="text-sm font-mono">{analysisResult.case_id}</span>
                  </div>
                )}
              </div>
              
              <RiskScoreRing 
                score={analysisResult?.fraud_probability || 0}
                riskLevel={analysisResult?.risk_level || 'LOW'}
                isLoading={isLoading}
              />
              </div>
            </div>

            {/* SHAP Chart */}
            <div className="glass rounded-2xl p-6 border border-primary/25 relative overflow-hidden">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/30 via-purple-500/30 to-primary/30 opacity-40 blur-sm"></div>
              <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                Feature Contributions
              </h3>
              
              <ShapChart 
                features={analysisResult?.top_features || []}
                isLoading={isLoading}
              />
              </div>
            </div>

            {/* Audit Narrative */}
            <div className="glass rounded-2xl p-6 border border-primary/25 relative overflow-hidden">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/30 via-purple-500/30 to-primary/30 opacity-40 blur-sm"></div>
              <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary" />
                  <h3 className="text-lg font-semibold">AI Audit Report</h3>
                  <div className="ml-2 px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                    GPT-4o
                  </div>
                </div>
                
                {analysisResult && (
                  <motion.button
                    onClick={exportPDF}
                    disabled={isExporting}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 rounded-lg transition-all ripple disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    whileHover={{ scale: isExporting ? 1 : 1.05 }}
                    whileTap={{ scale: isExporting ? 1 : 0.95 }}
                  >
                    {isExporting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Export PDF</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
              
              <AuditNarrative 
                narrative={analysisResult?.audit_narrative || ''}
                recommendedAction={analysisResult?.recommended_action || ''}
                riskLevel={analysisResult?.risk_level || 'LOW'}
                timestamp={analysisResult?.timestamp || ''}
                isLoading={isLoading}
              />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard