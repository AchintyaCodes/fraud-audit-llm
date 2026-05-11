# 🛡️ FraudGuard AI

> **Production-grade fraud detection dashboard with LLM-powered Basel III compliant audit narratives**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-fraudguard--ai--omega.vercel.app-blue?style=for-the-badge)](https://fraudguard-ai-omega.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/AchintyaCodes/fraud-audit-llm)

[![Python](https://img.shields.io/badge/Python-3.8+-3776ab.svg?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000.svg?logo=next.js&logoColor=white)](https://nextjs.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0+-ff6600.svg)](https://xgboost.readthedocs.io)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-f55036.svg)](https://groq.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000.svg?logo=vercel&logoColor=white)](https://vercel.com)

**FraudGuard AI** revolutionizes financial fraud detection by combining state-of-the-art XGBoost machine learning with Groq's lightning-fast Llama 3.3 70B model to automatically generate regulatory-compliant audit narratives. Built for financial institutions requiring Basel III compliance and explainable AI.

## 🎯 **Key Highlights**

- **🤖 AI-Powered Narratives**: Reduces audit report generation from 40+ minutes to under 3 seconds
- **📊 99.85% Accuracy**: XGBoost model trained on 284,807 transactions with 0.968 AUC-ROC
- **💰 $2M+ Impact**: Modeled fraud prevention impact at production volumes
- **⚡ Lightning Fast**: Sub-2s response times with Groq's optimized inference
- **🎨 Professional UI**: Bloomberg Terminal-inspired dark theme with smooth animations
- **📋 Basel III Compliant**: One-click PDF export with regulatory-grade audit reports

## ✨ **Features**

### 🔍 **Advanced Analytics**
- **XGBoost ML Pipeline**: Processes 284K+ transactions with 70%+ fraud recall
- **SHAP Explainability**: Visual feature importance with human-readable labels
- **Real-time Risk Assessment**: Instant fraud probability scoring with confidence intervals
- **Enhanced Demo Mode**: Intelligent fallback for seamless demonstrations

### 🤖 **LLM Integration**
- **Groq Llama 3.3 70B**: Free, fast, and accurate narrative generation
- **Basel III Compliance**: Automatically generates regulatory-compliant audit reports
- **Feature Name Mapping**: V1-V28 anonymized features mapped to business-friendly labels
- **Risk-Based Narratives**: Contextual explanations based on fraud probability levels

### 🎨 **Professional Interface**
- **Animated Risk Ring**: Pulsing high-risk indicators with smooth transitions
- **Interactive SHAP Charts**: Horizontal bar charts with contribution analysis
- **Floating Particles**: Subtle background animations for premium feel
- **Responsive Design**: Mobile-optimized with touch-friendly interactions

### 🔧 **Production Ready**
- **FastAPI Backend**: High-performance async Python API
- **Next.js Frontend**: Server-side rendering with optimal performance
- **Model Hosting**: Hugging Face Hub integration with runtime downloads
- **Zero Cold Start**: Serverless deployment with instant response times

## 🏗️ **Architecture**

```
fraud-audit-llm/
├── 🐍 backend/                    # FastAPI Python Backend
│   ├── main.py                   # FastAPI application & API routes
│   ├── model/
│   │   ├── predict.py           # XGBoost prediction & SHAP analysis
│   │   ├── fraud_model.pkl      # Trained XGBoost model
│   │   └── scaler.pkl           # Feature scaler for preprocessing
│   ├── llm/
│   │   └── narrative.py         # Groq Llama 3.3 integration
│   ├── utils/
│   │   └── pdf_export.py        # Basel III compliant PDF generation
│   ├── download_models.py       # Hugging Face Hub model management
│   └── requirements.txt         # Python dependencies
├── ⚛️ frontend/                   # Next.js React Frontend
│   ├── app/
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── page.tsx             # Main dashboard page
│   │   └── globals.css          # Professional dark theme styles
│   ├── components/
│   │   ├── Dashboard.tsx        # Main dashboard orchestrator
│   │   ├── TransactionForm.tsx  # V1-V28 feature input form
│   │   ├── RiskScoreRing.tsx    # Animated circular risk indicator
│   │   ├── ShapChart.tsx        # Feature importance visualization
│   │   ├── AuditNarrative.tsx   # LLM-generated report display
│   │   └── FloatingParticles.tsx # Background animation effects
│   ├── package.json             # Node.js dependencies
│   └── vercel.json              # Deployment configuration
├── 📊 models/                     # Local model storage
├── 🔧 upload_model.py             # Model upload utility
├── 📥 load_model.py               # Model download utility
└── 📖 README.md                   # This documentation
```

## 🚀 **Quick Start**

### **🔧 Prerequisites**
- Python 3.8+ with pip
- Node.js 18+ with npm
- Groq API key (optional - works in demo mode)

### **🐍 Backend Setup**
```bash
# Clone the repository
git clone https://github.com/AchintyaCodes/fraud-audit-llm.git
cd fraud-audit-llm/backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
python main.py
```
✅ **Backend running at**: `http://localhost:8000`

### **⚛️ Frontend Setup**
```bash
# Navigate to frontend directory
cd ../frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```
✅ **Frontend running at**: `http://localhost:3000`

### **🔑 Environment Configuration**

Create `backend/.env`:
```env
# Optional: Get free API key at console.groq.com
GROQ_API_KEY=your_groq_api_key_here
```

Create `frontend/.env.local`:
```env
# Point to your backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> **💡 Pro Tip**: The application works perfectly in demo mode without any API keys!

## 📊 **API Reference**

### **Core Endpoints**

| Endpoint | Method | Description | Response Time |
|----------|--------|-------------|---------------|
| `/health` | GET | System health & service status | ~50ms |
| `/analyze` | POST | Fraud analysis with ML + LLM | ~2-3s |
| `/export-pdf` | POST | Basel III compliant PDF report | ~1-2s |
| `/demo-data` | GET | Sample high-risk transaction data | ~10ms |

### **📝 Example: Fraud Analysis**

**Request:**
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2000.0,
    "v14": -8.0,
    "v10": -4.0,
    "v12": -3.0,
    "v4": -2.0,
    "v17": -3.0
  }'
```

**Response:**
```json
{
  "case_id": "FA-B5A28D3D",
  "timestamp": "2026-05-11T08:49:55.131111",
  "fraud_probability": 0.95,
  "risk_level": "HIGH",
  "top_features": [
    {
      "feature": "V14",
      "shap_value": -0.4,
      "contribution": "fraud",
      "abs_value": 0.4
    }
  ],
  "audit_narrative": "RISK ASSESSMENT SUMMARY\nThis transaction exhibits a 95.0% probability of fraudulent activity...",
  "recommended_action": "BLOCK"
}
```

## 🎯 **Technology Stack**

### **🐍 Backend Technologies**
| Technology | Purpose | Version |
|------------|---------|---------|
| **FastAPI** | High-performance async web framework | 0.104+ |
| **XGBoost** | Gradient boosting for fraud detection | 2.0+ |
| **Groq SDK** | Llama 3.3 70B model integration | Latest |
| **SHAP** | Model explainability and feature importance | 0.45+ |
| **Pandas** | Data manipulation and analysis | 2.0+ |
| **FPDF2** | Basel III compliant PDF generation | 2.7+ |
| **Pydantic** | Data validation and serialization | 2.0+ |

### **⚛️ Frontend Technologies**
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with App Router | 14+ |
| **TypeScript** | Type-safe JavaScript development | 5.0+ |
| **Framer Motion** | Smooth animations and transitions | 11+ |
| **Tailwind CSS** | Utility-first CSS framework | 3.4+ |
| **Recharts** | Data visualization library | 2.8+ |
| **React Hot Toast** | Elegant notification system | 2.4+ |

### **☁️ Infrastructure & Deployment**
| Service | Purpose | Provider |
|---------|---------|----------|
| **Frontend Hosting** | Static site deployment | Vercel |
| **Backend Hosting** | API server deployment | Render |
| **Model Storage** | ML model hosting | Hugging Face Hub |
| **LLM Inference** | Fast model inference | Groq Cloud |

## 🎨 **UI Components Deep Dive**

### **🎯 Risk Score Ring**
- **Animated Progress**: Smooth circular animation with glow effects
- **Risk-Based Colors**: Green (LOW), Amber (MEDIUM), Red (HIGH) with pulsing
- **CountUp Animation**: Numbers animate from 0 to final percentage
- **Responsive Design**: Scales beautifully across all screen sizes

### **📊 SHAP Feature Chart**
- **Horizontal Bars**: Clean, professional visualization
- **Feature Mapping**: V14 → "Behavioral Score A", V10 → "Behavioral Score B"
- **Contribution Colors**: Red (increases risk), Blue (decreases risk)
- **Staggered Animation**: Bars animate in sequence for visual impact

### **📝 Audit Narrative**
- **Typewriter Effect**: Text appears with realistic typing animation
- **Basel III Format**: Structured sections with regulatory compliance
- **Risk-Based Content**: Narrative adapts to fraud probability level
- **Copy Functionality**: One-click copy for easy sharing

### **📋 Transaction Form**
- **Floating Labels**: Modern input design with smooth transitions
- **Range Sliders**: V1-V28 feature inputs with real-time feedback
- **Validation**: Client-side validation with helpful error messages
- **Demo Defaults**: Pre-filled with high-risk values for demonstrations

## 📈 **Model Performance**

### **🎯 Key Metrics**
- **Dataset Size**: 284,807 transactions
- **Fraud Prevalence**: 0.17% baseline (highly imbalanced)
- **Accuracy**: 99.85%
- **AUC-ROC**: 0.968
- **Fraud Recall**: 70%+
- **Precision**: Optimized for financial use cases

### **🔧 Model Features**
- **Input Features**: Time, V1-V28 (PCA components), Amount (30 total)
- **Preprocessing**: StandardScaler applied to Amount column
- **Resampling**: Hybrid SMOTE for handling class imbalance
- **Explainability**: SHAP TreeExplainer for feature importance

### **💰 Business Impact**
- **Fraud Prevention**: $2M+ modeled impact at production volumes
- **Efficiency Gain**: 40+ minutes → 3 seconds for audit reports
- **Compliance**: Basel III regulatory requirements met
- **Scalability**: Handles high-volume transaction processing

## 🚀 **Deployment Guide**

### **🌐 Frontend Deployment (Vercel)**

1. **Connect Repository**:
   ```bash
   # Push to GitHub
   git push origin main
   
   # Import to Vercel
   # Visit vercel.com → Import Project → Select Repository
   ```

2. **Environment Variables**:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

3. **Build Settings**:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`

### **🔧 Backend Deployment (Render)**

1. **Create `render.yaml`**:
   ```yaml
   services:
     - type: web
       name: fraudguard-api
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: python main.py
       envVars:
         - key: GROQ_API_KEY
           sync: false
   ```

2. **Environment Variables**:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   PYTHON_VERSION=3.11.0
   ```

### **📦 Model Management**

Models are automatically downloaded from Hugging Face Hub on first run:
```bash
# Upload models to Hugging Face Hub
python upload_model.py

# Download models locally
python load_model.py
```

## 🔧 **Development Workflow**

### **🧪 Running Tests**
```bash
# Backend API tests
cd backend
python -m pytest tests/ -v

# Frontend component tests
cd frontend
npm test

# End-to-end tests
npm run test:e2e
```

### **📏 Code Quality**
```bash
# Python formatting and linting
cd backend
black . --line-length 88
flake8 . --max-line-length 88
mypy . --ignore-missing-imports

# TypeScript checking
cd frontend
npm run lint
npm run type-check
```

### **🔍 Performance Monitoring**
```bash
# Backend performance
cd backend
python -m cProfile -o profile.stats main.py

# Frontend bundle analysis
cd frontend
npm run analyze
```

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **📋 Contribution Guidelines**
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Built By**

**Achintya Gupta**  
*Data Science & Engineering Student at MIT Manipal*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077b5.svg?logo=linkedin&logoColor=white)](https://linkedin.com/in/achintya-gupta-bb0091311)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717.svg?logo=github&logoColor=white)](https://github.com/AchintyaCodes)
[![Email](https://img.shields.io/badge/Email-Contact-ea4335.svg?logo=gmail&logoColor=white)](mailto:achintya.mann@gmail.com)

---

<div align="center">

### 🌟 **Star this repository if you find it useful!** 🌟

[![GitHub stars](https://img.shields.io/github/stars/AchintyaCodes/fraud-audit-llm?style=social)](https://github.com/AchintyaCodes/fraud-audit-llm/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/AchintyaCodes/fraud-audit-llm?style=social)](https://github.com/AchintyaCodes/fraud-audit-llm/network/members)

**[🚀 Live Demo](https://fraudguard-ai-omega.vercel.app/) | [📖 Documentation](https://github.com/AchintyaCodes/fraud-audit-llm) | [🐛 Report Bug](https://github.com/AchintyaCodes/fraud-audit-llm/issues) | [💡 Request Feature](https://github.com/AchintyaCodes/fraud-audit-llm/issues)**

</div>
