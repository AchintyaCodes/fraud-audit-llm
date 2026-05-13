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
  amount: number
  v1?: number
  v2?: number
  v3?: number
  v4?: number
  v5?: number
  v6?: number
  v7?: number
  v8?: number
  v9?: number
  v10?: number
  v11?: number
  v12?: number
  v13?: number
  v14?: number
  v15?: number
  v16?: number
  v17?: number
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

const Dashboard: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  // Check if backend is available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await fetch(`${apiUrl}/health`)
        if (!response.ok) throw new Error('Backend unavailable')
        const data = await response.json()
        setDemoMode(data.services.llm_service === 'demo_mode')
        console.log('✓ Backend connected:', data)
      } catch (error) {
        console.log('⚠️ Backend unavailable, will use demo mode for analysis')
        setDemoMode(true)
        // DON'T load demo data here - only when user submits form
      }
    }
    checkBackend()
  }, [])

  const loadDemoData = () => {
    console.log('🎭 Loading frontend demo data as fallback')
    const mockResult: AnalysisResult = {
      case_id: 'FA-DEMO123',
      timestamp: new Date().toISOString(),
      fraud_probability: 0.85,
      risk_level: 'HIGH',
      top_features: [
        { feature: 'V14', shap_value: 0.45, contribution: 'fraud', abs_value: 0.45 },
        { feature: 'Amount', shap_value: 0.34, contribution: 'fraud', abs_value: 0.34 },
        { feature: 'V10', shap_value: 0.35, contribution: 'fraud', abs_value: 0.35 },
        { feature: 'V12', shap_value: 0.30, contribution: 'fraud', abs_value: 0.30 },
        { feature: 'V4', shap_value: 0.25, contribution: 'fraud', abs_value: 0.25 },
        { feature: 'V17', shap_value: 0.20, contribution: 'fraud', abs_value: 0.20 }
      ],
      audit_narrative: `RISK ASSESSMENT SUMMARY
This transaction exhibits an 85% probability of fraudulent activity, classified as HIGH RISK. The elevated risk score warrants immediate attention and enhanced due diligence procedures.

PRIMARY RISK DRIVERS
1. Behavioral Score A (V14): Highly anomalous behavioral pattern indicating potential account compromise or synthetic identity usage.
2. Transaction Amount: Significantly elevated beyond normal parameters for this customer profile.
3. Behavioral Score B (V10): Unusual transaction velocity patterns consistent with fraudulent activity.

RECOMMENDED ACTION: BLOCK
Transaction should be blocked pending manual review and customer verification. Implement enhanced authentication protocols before processing.

REGULATORY COMPLIANCE
This assessment aligns with Basel III operational risk management requirements and AML/CFT regulatory standards. Documentation retained per regulatory retention policies.`,
      recommended_action: 'BLOCK'
    }
    setAnalysisResult(mockResult)
  }

  const analyzeTransaction = async (transactionData: TransactionData) => {
    setIsLoading(true)
    
    try {
      // ALWAYS try backend first, regardless of demo mode
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      console.log('🔄 Calling backend API:', `${apiUrl}/analyze`)
      
      const response = await fetch(`${apiUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      })

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Backend response:', result)
      setAnalysisResult(result)
      toast.success('Analysis complete')
      
      // Scroll to results on mobile
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section')
        if (resultsSection && window.innerWidth < 1024) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 500)
      
    } catch (error) {
      console.error('❌ Backend API failed:', error)
      console.log('🎭 Falling back to frontend demo mode')
      
      // Only use frontend demo as absolute last resort
      toast.error('Backend unavailable - using demo data')
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
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await axios({
        method: 'POST',
        url: `${apiUrl}/export-pdf`,
        data: analysisResult,
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `FraudGuard-${Date.now()}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.success('Report downloaded successfully')
    } catch (error: any) {
      console.error('PDF error:', error.response)
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error'
      toast.error(`PDF export failed: ${errorMsg}`)
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
    <div className="min-h-screen bg-bg-primary dot-grid relative">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#111111',
            color: '#fff',
            border: '1px solid #222222',
          },
        }}
      />

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-bg-primary border-b border-border relative"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="w-8 h-8 text-accent-blue" />
            <h1 className="text-2xl font-bold text-text-primary">FraudGuard AI</h1>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            {demoMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 bg-bg-tertiary text-text-secondary rounded-full text-sm border border-border-hover"
              >
                Demo Mode
              </motion.div>
            )}
            <motion.div
              className="flex items-center space-x-2 px-4 py-2 bg-bg-primary border border-border rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-4 h-4 text-accent-blue" />
              <span className="text-sm text-text-primary">Powered by Llama 3.3</span>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Panel - Transaction Form */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass p-6 h-full">
              <h2 className="text-xl font-semibold mb-6 flex items-center text-text-primary">
                <AlertTriangle className="w-5 h-5 mr-2 text-accent-blue" />
                Transaction Analysis
              </h2>
              <TransactionForm 
                onSubmit={analyzeTransaction}
                isLoading={isLoading}
              />
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
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Risk Assessment</h3>
                {analysisResult && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-text-secondary">Case ID:</span>
                    <span className="text-sm font-mono text-text-primary">{analysisResult.case_id}</span>
                  </div>
                )}
              </div>
              
              <RiskScoreRing 
                score={analysisResult?.fraud_probability || 0}
                riskLevel={analysisResult?.risk_level || 'LOW'}
                isLoading={isLoading}
              />
            </div>

            {/* SHAP Chart */}
            <div className="glass p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-text-primary">
                <CheckCircle className="w-5 h-5 mr-2 text-accent-blue" />
                Feature Contributions
              </h3>
              
              <ShapChart 
                features={analysisResult?.top_features || []}
                isLoading={isLoading}
              />
            </div>

            {/* Audit Narrative */}
            <div className="glass p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-accent-blue" />
                  <h3 className="text-lg font-semibold text-text-primary">AI Audit Report</h3>
                  <div className="ml-2 px-2 py-1 bg-bg-tertiary border border-border text-text-secondary rounded text-xs">
                    Llama 3.3
                  </div>
                </div>
                
                {analysisResult && (
                  <motion.button
                    onClick={exportPDF}
                    disabled={isExporting}
                    className="flex items-center space-x-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue-hover rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
                    whileHover={{ scale: isExporting ? 1 : 1.05 }}
                    whileTap={{ scale: isExporting ? 1 : 0.95 }}
                  >
                    {isExporting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-white">Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-white" />
                        <span className="text-white">Export PDF</span>
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
          </motion.div>
        </div>
      </div>
{/* Footer */}
<footer className="border-t border-border py-6 mt-8">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div>
            <span className="text-text-secondary text-xs uppercase tracking-widest">Built by</span>
            <p className="text-text-primary font-semibold text-lg">Achintya Gupta</p>
            <span className="text-text-secondary text-xs">Data Science & Engineering · MIT Manipal</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://github.com/AchintyaCodes" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors flex items-center space-x-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              <span>GitHub</span>
            </a>
            <a href="https://linkedin.com/in/achintya-gupta-bb0091311" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors flex items-center space-x-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard