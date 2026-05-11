"""
LLM-powered audit narrative generation using Groq Llama 3.3.
"""

import os
from typing import Dict, List, Any
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class NarrativeGenerator:
    """
    Generate regulatory-compliant audit narratives using Groq Llama 3.3.
    """
    
    def __init__(self):
        """Initialize the narrative generator."""
        self.api_key = os.getenv("GROQ_API_KEY")
        self.client = None
        self.demo_mode = False
        
        if self.api_key and self.api_key != "your_groq_api_key_here":
            try:
                self.client = Groq(api_key=self.api_key)
                print("✓ Groq client initialized successfully")
            except Exception as e:
                print(f"Warning: Groq initialization failed: {e}")
                self.demo_mode = True
        else:
            print("ℹ️  Running in demo mode - Groq API key not configured")
            self.demo_mode = True
    
    def _get_system_prompt(self) -> str:
        """Get the system prompt for the LLM."""
        return """You are a senior Model Risk analyst at a Tier-1 investment bank writing Basel III compliant fraud audit reports. Your writing is precise, professional, and regulatory-grade.

CRITICAL: Return PLAIN TEXT ONLY. NO HTML tags, NO markdown, NO special formatting.

Use this EXACT format structure:

RISK ASSESSMENT SUMMARY
[2-3 sentences about risk level and overall assessment]

PRIMARY RISK DRIVERS
1. [Feature Name]: [Clear explanation of how this contributes to fraud risk]
2. [Feature Name]: [Clear explanation of how this contributes to fraud risk]  
3. [Feature Name]: [Clear explanation of how this contributes to fraud risk]

RECOMMENDED ACTION: [BLOCK/FLAG FOR REVIEW/APPROVE]
[1-2 sentences explaining the recommendation and next steps]

REGULATORY COMPLIANCE
[1-2 sentences about Basel III operational risk management and AML/CFT alignment]

Write 150-200 words total. Use formal banking language but ensure technical concepts are explained clearly."""
    
    def _create_user_prompt(self, fraud_score: float, risk_level: str, top_features: List[Dict]) -> str:
        """
        Create the user prompt with fraud analysis data.
        
        Args:
            fraud_score: Fraud probability score (0.0 to 1.0)
            risk_level: Risk level (LOW, MEDIUM, HIGH)
            top_features: Top SHAP features with contributions
            
        Returns:
            Formatted user prompt
        """
        features_text = "\n".join([
            f"- {feat['feature'].replace('_', ' ').title()}: "
            f"{feat['shap_value']:.4f} ({'increases' if feat['contribution'] == 'fraud' else 'decreases'} fraud risk)"
            for feat in top_features[:3]
        ])
        
        return f"""Transaction Analysis Results:

Fraud Probability: {fraud_score:.1%}
Risk Level: {risk_level}

Top Risk Drivers:
{features_text}

Please generate a regulatory audit narrative for this transaction analysis."""
    
    def _get_mock_narrative(self, fraud_score: float, risk_level: str, top_features: List[Dict]) -> str:
        """
        Generate a realistic mock narrative for demo mode.
        
        Args:
            fraud_score: Fraud probability score
            risk_level: Risk level
            top_features: Top SHAP features
            
        Returns:
            Mock audit narrative in plain text format
        """
        if risk_level == "HIGH":
            return f"""RISK ASSESSMENT SUMMARY
This transaction exhibits a {fraud_score:.1%} probability of fraudulent activity, classified as HIGH RISK. The elevated risk score warrants immediate attention and enhanced due diligence procedures. Multiple fraud indicators align with known suspicious activity patterns.

PRIMARY RISK DRIVERS
1. {top_features[0]['feature'].replace('_', ' ').title()}: Significantly elevated beyond normal parameters, indicating potential suspicious activity patterns that deviate from established customer behavioral baselines.
2. {top_features[1]['feature'].replace('_', ' ').title()}: Presents concerning risk indicators that align with known fraud typologies and suggest anomalous transaction characteristics requiring investigation.
3. {top_features[2]['feature'].replace('_', ' ').title()}: Demonstrates characteristics inconsistent with legitimate transaction patterns, contributing substantially to the overall fraud risk assessment.

RECOMMENDED ACTION: BLOCK
Transaction should be blocked pending manual review and customer verification. Implement enhanced authentication protocols and conduct thorough investigation before processing.

REGULATORY COMPLIANCE
This assessment aligns with Basel III operational risk management requirements and AML/CFT regulatory standards. Documentation retained per regulatory retention policies and supervisory guidance."""
        
        elif risk_level == "MEDIUM":
            return f"""RISK ASSESSMENT SUMMARY
This transaction presents a {fraud_score:.1%} probability of fraudulent activity, classified as MEDIUM RISK. While not immediately concerning, the transaction requires additional monitoring and verification procedures. Several risk indicators warrant closer examination.

PRIMARY RISK DRIVERS
1. {top_features[0]['feature'].replace('_', ' ').title()}: Shows moderate deviation from typical customer patterns, requiring closer examination and additional verification steps.
2. {top_features[1]['feature'].replace('_', ' ').title()}: Presents some risk indicators that warrant additional scrutiny and enhanced monitoring protocols.
3. {top_features[2]['feature'].replace('_', ' ').title()}: Exhibits characteristics that, while not definitively fraudulent, require ongoing observation and assessment.

RECOMMENDED ACTION: FLAG FOR REVIEW
Transaction may proceed with enhanced monitoring and additional verification steps. Maintain heightened surveillance for subsequent activities and implement secondary authentication measures.

REGULATORY COMPLIANCE
Assessment conducted in accordance with Basel III risk management frameworks and regulatory guidance on transaction monitoring and suspicious activity detection protocols."""
        
        else:  # LOW risk
            return f"""RISK ASSESSMENT SUMMARY
This transaction demonstrates a {fraud_score:.1%} probability of fraudulent activity, classified as LOW RISK. The transaction profile aligns with established customer patterns and presents minimal risk indicators. Standard processing procedures are appropriate.

PRIMARY RISK DRIVERS
1. {top_features[0]['feature'].replace('_', ' ').title()}: Within normal parameters and consistent with historical customer behavior patterns, contributing to the low-risk assessment.
2. {top_features[1]['feature'].replace('_', ' ').title()}: Demonstrates characteristics typical of legitimate transaction activity with no concerning anomalies detected.
3. {top_features[2]['feature'].replace('_', ' ').title()}: Aligns with expected transaction patterns for this customer segment and risk profile category.

RECOMMENDED ACTION: APPROVE
Transaction approved for processing with standard monitoring procedures. No additional controls required at this time, continue with normal operational oversight.

REGULATORY COMPLIANCE
Risk assessment completed in accordance with Basel III operational risk standards and regulatory requirements for transaction monitoring and fraud prevention controls."""
    
    async def generate_narrative(self, fraud_score: float, risk_level: str, top_features: List[Dict]) -> str:
        """
        Generate audit narrative for the fraud analysis.
        
        Args:
            fraud_score: Fraud probability score (0.0 to 1.0)
            risk_level: Risk level (LOW, MEDIUM, HIGH)
            top_features: Top SHAP features with contributions
            
        Returns:
            Generated audit narrative
        """
        if self.demo_mode or self.client is None:
            return self._get_mock_narrative(fraud_score, risk_level, top_features)
        
        try:
            system_prompt = self._get_system_prompt()
            user_prompt = self._create_user_prompt(fraud_score, risk_level, top_features)
            
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating narrative with Groq: {e}")
            print("Falling back to mock narrative...")
            return self._get_mock_narrative(fraud_score, risk_level, top_features)

# Global generator instance
_generator = None

def get_narrative_generator() -> NarrativeGenerator:
    """Get or create the global narrative generator instance."""
    global _generator
    if _generator is None:
        _generator = NarrativeGenerator()
    return _generator