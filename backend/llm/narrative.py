"""
LLM-powered audit narrative generation using OpenAI GPT-4o.
"""

import os
from typing import Dict, List, Any
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class NarrativeGenerator:
    """
    Generate regulatory-compliant audit narratives using GPT-4o.
    """
    
    def __init__(self):
        """Initialize the narrative generator."""
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = None
        self.demo_mode = False
        
        if self.api_key and self.api_key != "your_openai_api_key_here":
            try:
                self.client = OpenAI(api_key=self.api_key)
                print("✓ OpenAI client initialized successfully")
            except Exception as e:
                print(f"Warning: OpenAI initialization failed: {e}")
                self.demo_mode = True
        else:
            print("ℹ️  Running in demo mode - OpenAI API key not configured")
            self.demo_mode = True
    
    def _get_system_prompt(self) -> str:
        """Get the system prompt for the LLM."""
        return """You are a senior Model Risk analyst at a Tier-1 investment bank writing Basel III compliant fraud audit reports. Your writing is precise, professional, and regulatory-grade.

Write audit narratives that are:
- 150-200 words exactly
- Professional and regulatory-compliant
- Clear and actionable
- Focused on risk assessment and mitigation

Structure your response with:
1. Risk assessment summary (2-3 sentences)
2. Top 3 fraud drivers explained in plain English
3. Recommended action (Approve / Flag for Review / Block)
4. Regulatory compliance note

Use formal banking language but ensure technical concepts are explained clearly."""
    
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
            Mock audit narrative
        """
        if risk_level == "HIGH":
            return f"""**Risk Assessment Summary**
This transaction exhibits a {fraud_score:.1%} probability of fraudulent activity, classified as HIGH RISK. The elevated risk score warrants immediate attention and enhanced due diligence procedures.

**Primary Risk Drivers**
1. **{top_features[0]['feature'].replace('_', ' ').title()}**: Significantly elevated beyond normal parameters, indicating potential suspicious activity patterns.
2. **{top_features[1]['feature'].replace('_', ' ').title()}**: Deviates from established customer behavioral baselines, suggesting anomalous transaction characteristics.
3. **{top_features[2]['feature'].replace('_', ' ').title()}**: Presents concerning risk indicators that align with known fraud typologies.

**Recommended Action: BLOCK**
Transaction should be blocked pending manual review and customer verification. Implement enhanced authentication protocols before processing.

**Regulatory Compliance**
This assessment aligns with Basel III operational risk management requirements and AML/CFT regulatory standards. Documentation retained per regulatory retention policies."""
        
        elif risk_level == "MEDIUM":
            return f"""**Risk Assessment Summary**
This transaction presents a {fraud_score:.1%} probability of fraudulent activity, classified as MEDIUM RISK. While not immediately concerning, the transaction requires additional monitoring and verification procedures.

**Primary Risk Drivers**
1. **{top_features[0]['feature'].replace('_', ' ').title()}**: Shows moderate deviation from typical customer patterns, requiring closer examination.
2. **{top_features[1]['feature'].replace('_', ' ').title()}**: Presents some risk indicators that warrant additional scrutiny and monitoring.
3. **{top_features[2]['feature'].replace('_', ' ').title()}**: Exhibits characteristics that, while not definitively fraudulent, require ongoing observation.

**Recommended Action: FLAG FOR REVIEW**
Transaction may proceed with enhanced monitoring. Implement additional verification steps and maintain heightened surveillance for subsequent activities.

**Regulatory Compliance**
Assessment conducted in accordance with Basel III risk management frameworks and regulatory guidance on transaction monitoring and suspicious activity detection."""
        
        else:  # LOW risk
            return f"""**Risk Assessment Summary**
This transaction demonstrates a {fraud_score:.1%} probability of fraudulent activity, classified as LOW RISK. The transaction profile aligns with established customer patterns and presents minimal risk indicators.

**Primary Risk Drivers**
1. **{top_features[0]['feature'].replace('_', ' ').title()}**: Within normal parameters, contributing to the low-risk assessment.
2. **{top_features[1]['feature'].replace('_', ' ').title()}**: Consistent with historical customer behavior patterns and risk profile.
3. **{top_features[2]['feature'].replace('_', ' ').title()}**: Demonstrates characteristics typical of legitimate transaction activity.

**Recommended Action: APPROVE**
Transaction approved for processing. Standard monitoring procedures remain in effect with no additional controls required at this time.

**Regulatory Compliance**
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
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=300,
                temperature=0.3,
                top_p=0.9
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating narrative with OpenAI: {e}")
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