"""
FraudGuard AI - FastAPI Backend
Production-grade fraud detection API with LLM-powered audit narratives.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime
import asyncio
import os
import json

from model.predict import get_predictor
from llm.narrative import get_narrative_generator
from utils.pdf_export import generate_pdf_report

# Initialize FastAPI app
app = FastAPI(
    title="FraudGuard AI API",
    description="Production-grade fraud detection with LLM-powered audit narratives",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response validation
class TransactionInput(BaseModel):
    """Transaction input data model for Kaggle credit card fraud dataset."""
    amount: float = Field(..., ge=0, description="Transaction amount in USD")
    v1: float = Field(default=0.0, description="PCA component V1")
    v2: float = Field(default=0.0, description="PCA component V2")
    v3: float = Field(default=0.0, description="PCA component V3")
    v4: float = Field(default=0.0, description="PCA component V4")
    v5: float = Field(default=0.0, description="PCA component V5")
    v6: float = Field(default=0.0, description="PCA component V6")
    v7: float = Field(default=0.0, description="PCA component V7")
    v8: float = Field(default=0.0, description="PCA component V8")
    v9: float = Field(default=0.0, description="PCA component V9")
    v10: float = Field(default=0.0, description="PCA component V10")
    v11: float = Field(default=0.0, description="PCA component V11")
    v12: float = Field(default=0.0, description="PCA component V12")
    v13: float = Field(default=0.0, description="PCA component V13")
    v14: float = Field(default=0.0, description="PCA component V14")
    v15: float = Field(default=0.0, description="PCA component V15")
    v16: float = Field(default=0.0, description="PCA component V16")
    v17: float = Field(default=0.0, description="PCA component V17")
    v18: float = Field(default=0.0, description="PCA component V18")
    v19: float = Field(default=0.0, description="PCA component V19")
    v20: float = Field(default=0.0, description="PCA component V20")
    v21: float = Field(default=0.0, description="PCA component V21")
    v22: float = Field(default=0.0, description="PCA component V22")
    v23: float = Field(default=0.0, description="PCA component V23")
    v24: float = Field(default=0.0, description="PCA component V24")
    v25: float = Field(default=0.0, description="PCA component V25")
    v26: float = Field(default=0.0, description="PCA component V26")
    v27: float = Field(default=0.0, description="PCA component V27")
    v28: float = Field(default=0.0, description="PCA component V28")

class FeatureContribution(BaseModel):
    """SHAP feature contribution model."""
    feature: str
    shap_value: float
    contribution: str  # "fraud" or "legitimate"
    abs_value: float

class AnalysisResult(BaseModel):
    """Fraud analysis result model."""
    case_id: str
    timestamp: str
    fraud_probability: float
    risk_level: str
    top_features: List[FeatureContribution]
    audit_narrative: str
    recommended_action: str

class PDFExportRequest(BaseModel):
    """PDF export request model."""
    analysis_result: AnalysisResult

# Try to download models if missing
try:
    from download_models import download_models_if_missing
    download_models_if_missing()
except Exception as e:
    print(f"Model download attempt failed: {e}")

# Initialize services
predictor = get_predictor()
narrative_generator = get_narrative_generator()

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "services": {
            "fraud_model": "loaded" if predictor.model is not None else "demo_mode",
            "llm_service": "demo_mode" if narrative_generator.demo_mode else "active"
        }
    }

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_transaction(transaction: TransactionInput):
    """
    Analyze transaction for fraud risk and generate audit narrative.
    
    Args:
        transaction: Transaction data to analyze
        
    Returns:
        Complete fraud analysis with risk assessment and audit narrative
    """
    try:
        # Generate unique case ID
        case_id = f"FA-{uuid.uuid4().hex[:8].upper()}"
        timestamp = datetime.utcnow().isoformat()
        
        # Convert Pydantic model to dict
        transaction_data = transaction.dict()
        
        # Get fraud prediction
        prediction_result = predictor.predict(transaction_data)
        
        # Generate audit narrative
        narrative = await narrative_generator.generate_narrative(
            fraud_score=prediction_result["fraud_probability"],
            risk_level=prediction_result["risk_level"],
            top_features=prediction_result["top_features"]
        )
        
        # Determine recommended action based on risk level
        risk_level = prediction_result["risk_level"]
        if risk_level == "HIGH":
            recommended_action = "BLOCK"
        elif risk_level == "MEDIUM":
            recommended_action = "FLAG FOR REVIEW"
        else:
            recommended_action = "APPROVE"
        
        # Format top features for response
        top_features = [
            FeatureContribution(**feature) 
            for feature in prediction_result["top_features"]
        ]
        
        return AnalysisResult(
            case_id=case_id,
            timestamp=timestamp,
            fraud_probability=prediction_result["fraud_probability"],
            risk_level=risk_level,
            top_features=top_features,
            audit_narrative=narrative,
            recommended_action=recommended_action
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/export-pdf")
async def export_pdf_report(request: Request):
    """
    Export analysis result as Basel III compliant PDF report.
    
    Args:
        request: Raw request with analysis result data
        
    Returns:
        Response with PDF file
    """
    try:
        # Get raw JSON body
        body = await request.json()
        print(f"PDF Export Request Body: {json.dumps(body, indent=2)}")
        
        # Generate PDF report
        return generate_pdf_report(body)
        
    except Exception as e:
        print(f"PDF Export Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF export failed: {str(e)}")

@app.get("/demo-data")
async def get_demo_data():
    """
    Get realistic demo transaction data for testing.
    
    Returns:
        Sample transaction data that will trigger HIGH risk
    """
    return {
        "amount": 2000.0,
        "v14": -10.0,
        "v10": -6.0,
        "v12": -5.0,
        "v4": -4.0,
        "v17": -5.0,
        "v1": 0.0,
        "v2": 0.0,
        "v3": 0.0,
        "v5": 0.0,
        "v6": 0.0,
        "v7": 0.0,
        "v8": 0.0,
        "v9": 0.0,
        "v11": 0.0,
        "v13": 0.0,
        "v15": 0.0,
        "v16": 0.0,
        "v18": 0.0,
        "v19": 0.0,
        "v20": 0.0,
        "v21": 0.0,
        "v22": 0.0,
        "v23": 0.0,
        "v24": 0.0,
        "v25": 0.0,
        "v26": 0.0,
        "v27": 0.0,
        "v28": 0.0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)