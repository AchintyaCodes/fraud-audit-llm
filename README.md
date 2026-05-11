# 🛡️ FraudGuard AI

> Production-grade fraud detection dashboard with LLM-powered audit narratives

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-orange.svg)](https://openai.com)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0+-red.svg)](https://xgboost.readthedocs.io)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com)

**FraudGuard AI** extends traditional XGBoost fraud detection with GPT-4o to automatically generate regulatory-compliant audit narratives. Built for financial institutions requiring Basel III compliance and explainable AI.

## ✨ Features

- 🤖 **AI-Powered Analysis**: XGBoost model with GPT-4o narrative generation
- 📊 **Real-time Dashboard**: Bloomberg Terminal-inspired dark theme interface
- 🔍 **Explainable AI**: SHAP-like feature importance visualization
- 📋 **Regulatory Compliance**: Basel III compliant PDF audit reports
- ⚡ **Production Ready**: FastAPI backend with Next.js frontend
- 🎨 **Stunning UI**: Glassmorphism design with smooth animations
- 🔄 **Demo Mode**: Works without API keys for demonstrations

## 🏗️ Architecture

```
fraud-audit-llm/
├── backend/                 # FastAPI Python backend
│   ├── main.py             # FastAPI application
│   ├── model/              # ML model and prediction logic
│   ├── llm/                # GPT-4o narrative generation
│   ├── utils/              # PDF export utilities
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js React frontend
│   ├── app/                # Next.js 13+ app directory
│   ├── components/         # React components
│   └── package.json        # Node.js dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- OpenAI API key (optional for demo mode)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at `http://localhost:3000`

### Environment Variables

Create `backend/.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

> **Note**: The application works in demo mode without an OpenAI API key

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | API health check |
| `/analyze` | POST | Analyze transaction for fraud |
| `/export-pdf` | POST | Export audit report as PDF |
| `/demo-data` | GET | Get sample transaction data |

### Example API Usage

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_amount": 15000.0,
    "merchant_category": 15,
    "time_of_day": 3.5,
    "location_mismatch": true,
    "previous_fraud_history": true,
    "device_risk_score": 85.0
  }'
```

## 🎯 Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **XGBoost**: Gradient boosting for fraud detection
- **OpenAI GPT-4o**: LLM for audit narrative generation
- **FPDF2**: PDF report generation
- **Pydantic**: Data validation and serialization

### Frontend
- **Next.js 14**: React framework with App Router
- **Framer Motion**: Smooth animations and transitions
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization library
- **React Hot Toast**: Elegant notifications

## 🎨 UI Components

- **Risk Score Ring**: Animated circular progress indicator
- **SHAP Chart**: Horizontal bar chart for feature importance
- **Audit Narrative**: Typewriter effect for AI-generated reports
- **Transaction Form**: Floating labels with micro-interactions
- **Floating Particles**: Subtle background animation

## 📱 Screenshots

*Screenshots will be added here after deployment*

## 🚀 Deployment

### Backend (Render)

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: fraudguard-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python main.py
    envVars:
      - key: OPENAI_API_KEY
        sync: false
```

### Frontend (Vercel)

1. Create `vercel.json`:
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-api-url.render.com"
  }
}
```

## 🔧 Development

### Running Tests

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

### Code Quality

```bash
# Python linting
cd backend
black . && flake8 .

# TypeScript checking
cd frontend
npm run lint
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Built by

**Achintya Gupta**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue.svg)](https://linkedin.com/in/your-profile)

---

⭐ **Star this repo if you find it useful!**
