/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        card: '#111111',
        primary: '#2563eb',
        'high-risk': '#ef4444',
        'medium-risk': '#f59e0b',
        'low-risk': '#22c55e',
        'bg-primary': '#0a0a0a',
        'bg-secondary': '#111111',
        'bg-tertiary': '#1a1a1a',
        'border': '#222222',
        'border-hover': '#333333',
        'text-primary': '#ffffff',
        'text-secondary': '#888888',
        'text-tertiary': '#555555',
        'accent-blue': '#2563eb',
        'accent-blue-hover': '#1d4ed8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%': { boxShadow: '0 0 5px rgba(239, 68, 68, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(239, 68, 68, 0.8)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}