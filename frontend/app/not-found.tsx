import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary dot-grid flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Shield className="w-16 h-16 text-accent-blue" />
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">404</h1>
        <p className="text-text-secondary mb-8">Page not found</p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-accent-blue hover:bg-accent-blue-hover text-white rounded-lg transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}
