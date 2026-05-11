"""
Fraud detection model prediction with feature importance analysis.
"""

import joblib
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Any
from pathlib import Path

class FraudPredictor:
    """
    Fraud detection model with feature importance analysis.
    """
    
    def __init__(self, model_path: str = None, scaler_path: str = None):
        """
        Initialize the fraud predictor.
        
        Args:
            model_path: Path to the trained XGBoost model
            scaler_path: Path to the feature scaler
        """
        self.model_path = model_path or Path(__file__).parent / "fraud_model.pkl"
        self.scaler_path = scaler_path or Path(__file__).parent / "scaler.pkl"
        self.model = None
        self.scaler = None
        self.feature_names = [
            "transaction_amount", "merchant_category", "time_of_day", 
            "location_mismatch", "previous_fraud_history", "device_risk_score",
            "account_age_days", "transaction_frequency", "amount_deviation",
            "velocity_1h", "velocity_24h", "merchant_risk_score",
            "payment_method", "cross_border", "weekend_transaction",
            "late_night_transaction", "high_amount_flag", "new_merchant",
            "suspicious_pattern", "ip_risk_score", "email_risk_score",
            "phone_risk_score", "billing_shipping_match", "cvv_match",
            "address_verification", "transaction_type", "channel_risk",
            "customer_segment", "seasonal_pattern", "geographic_risk"
        ]
        self._load_models()
    
    def _load_models(self) -> None:
        """Load the trained model and scaler."""
        try:
            if Path(self.model_path).exists():
                self.model = joblib.load(self.model_path)
                print("✓ Fraud detection model loaded successfully")
            else:
                print("⚠️  Model file not found, using demo mode")
                self.model = None
                
            # Note: Scaler might have feature mismatch, handle gracefully
            try:
                if Path(self.scaler_path).exists():
                    self.scaler = joblib.load(self.scaler_path)
                else:
                    print("⚠️  Scaler file not found")
                    self.scaler = None
            except Exception as e:
                print(f"Warning: Could not load scaler: {e}")
                self.scaler = None
            
        except Exception as e:
            print(f"Warning: Failed to load fraud detection model: {e}")
            print("Running in demo mode with mock predictions")
            self.model = None
            self.scaler = None
    
    def _prepare_features(self, transaction_data: Dict[str, Any]) -> np.ndarray:
        """
        Convert transaction data to model features.
        
        Args:
            transaction_data: Dictionary containing transaction information
            
        Returns:
            Feature array ready for model prediction
        """
        # Create feature vector with defaults
        features = np.zeros(30)  # Model expects 30 features
        
        # Map input fields to feature positions
        feature_mapping = {
            "transaction_amount": 0,
            "merchant_category": 1,
            "time_of_day": 2,
            "location_mismatch": 3,
            "previous_fraud_history": 4,
            "device_risk_score": 5
        }
        
        # Fill in provided features
        for field, index in feature_mapping.items():
            if field in transaction_data:
                features[index] = float(transaction_data[field])
        
        # Generate realistic values for other features based on input
        np.random.seed(42)  # For consistent demo data
        
        # Make some features correlate with fraud indicators
        fraud_indicators = (
            float(transaction_data.get("location_mismatch", False)) +
            float(transaction_data.get("previous_fraud_history", False)) +
            (transaction_data.get("device_risk_score", 0) / 100)
        )
        
        features[6] = np.random.uniform(30, 1000)  # account_age_days
        features[7] = np.random.uniform(1, 50)     # transaction_frequency
        features[8] = fraud_indicators * 0.3 + np.random.uniform(0, 0.5)  # amount_deviation
        features[9] = fraud_indicators * 5 + np.random.uniform(0, 5)       # velocity_1h
        features[10] = fraud_indicators * 20 + np.random.uniform(0, 50)    # velocity_24h
        features[11] = fraud_indicators * 0.4 + np.random.uniform(0, 0.6)  # merchant_risk_score
        
        # Fill remaining features with reasonable defaults
        for i in range(12, 30):
            features[i] = fraud_indicators * 0.2 + np.random.uniform(0, 0.8)
        
        return features.reshape(1, -1)
    
    def _get_feature_importance(self, features: np.ndarray, prediction_proba: float) -> List[Dict[str, Any]]:
        """
        Generate mock feature importance values (simulating SHAP).
        
        Args:
            features: Input features
            prediction_proba: Fraud probability
            
        Returns:
            List of feature importance dictionaries
        """
        # Create mock importance values based on feature values and fraud probability
        feature_importance = []
        
        for i, (feature_name, feature_val) in enumerate(zip(self.feature_names, features[0])):
            # Create realistic importance values
            if i < 6:  # Input features get higher importance
                base_importance = feature_val * 0.1 * (prediction_proba if prediction_proba > 0.5 else (1 - prediction_proba))
            else:  # Generated features get lower importance
                base_importance = feature_val * 0.05 * np.random.uniform(0.5, 1.5)
            
            # Add some randomness
            importance = base_importance + np.random.uniform(-0.02, 0.02)
            
            # Determine contribution direction
            contribution = "fraud" if importance > 0 else "legitimate"
            
            feature_importance.append({
                "feature": feature_name,
                "shap_value": float(importance),
                "contribution": contribution,
                "abs_value": abs(float(importance))
            })
        
        # Sort by absolute importance and return top features
        return sorted(feature_importance, key=lambda x: x["abs_value"], reverse=True)
    
    def predict(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict fraud probability and generate feature explanations.
        
        Args:
            transaction_data: Dictionary containing transaction information
            
        Returns:
            Dictionary containing prediction results and explanations
        """
        # Prepare features
        features = self._prepare_features(transaction_data)
        
        # If no model is loaded, generate realistic demo predictions
        if self.model is None:
            return self._generate_demo_prediction(transaction_data, features)
        
        # Scale features if scaler is available and compatible
        if self.scaler is not None:
            try:
                if self.scaler.n_features_in_ == features.shape[1]:
                    features = self.scaler.transform(features)
            except Exception:
                pass  # Use unscaled features if scaling fails
        
        # Make prediction
        fraud_probability = float(self.model.predict_proba(features)[0][1])
        
        # Determine risk level
        if fraud_probability < 0.3:
            risk_level = "LOW"
        elif fraud_probability < 0.7:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"
        
        # Generate feature importance (mock SHAP values)
        feature_importance = self._get_feature_importance(features, fraud_probability)
        
        # Get top 6 features
        top_features = feature_importance[:6]
        
        return {
            "fraud_probability": fraud_probability,
            "risk_level": risk_level,
            "top_features": top_features,
            "raw_features": features.tolist()[0]
        }
    
    def _generate_demo_prediction(self, transaction_data: Dict[str, Any], features: np.ndarray) -> Dict[str, Any]:
        """
        Generate realistic demo predictions when model is not available.
        
        Args:
            transaction_data: Original transaction data
            features: Prepared feature array
            
        Returns:
            Demo prediction results
        """
        # Calculate fraud score based on risk indicators
        risk_score = 0.0
        
        # High transaction amount increases risk
        amount = transaction_data.get("transaction_amount", 0)
        if amount > 10000:
            risk_score += 0.3
        elif amount > 5000:
            risk_score += 0.15
        
        # Location mismatch increases risk
        if transaction_data.get("location_mismatch", False):
            risk_score += 0.25
        
        # Previous fraud history increases risk significantly
        if transaction_data.get("previous_fraud_history", False):
            risk_score += 0.35
        
        # High device risk score increases risk
        device_risk = transaction_data.get("device_risk_score", 0) / 100
        risk_score += device_risk * 0.2
        
        # Time of day (late night/early morning is riskier)
        time_of_day = transaction_data.get("time_of_day", 12)
        if time_of_day < 6 or time_of_day > 23:
            risk_score += 0.1
        
        # High-risk merchant category
        merchant_cat = transaction_data.get("merchant_category", 0)
        if merchant_cat > 15:
            risk_score += 0.15
        
        # Add some randomness but keep it realistic
        np.random.seed(int(amount) % 1000)  # Deterministic based on amount
        risk_score += np.random.uniform(-0.1, 0.1)
        
        # Clamp between 0 and 1
        fraud_probability = max(0.05, min(0.95, risk_score))
        
        # Determine risk level
        if fraud_probability < 0.3:
            risk_level = "LOW"
        elif fraud_probability < 0.7:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"
        
        # Generate feature importance
        feature_importance = self._get_feature_importance(features, fraud_probability)
        top_features = feature_importance[:6]
        
        return {
            "fraud_probability": fraud_probability,
            "risk_level": risk_level,
            "top_features": top_features,
            "raw_features": features.tolist()[0]
        }

# Global predictor instance
_predictor = None

def get_predictor() -> FraudPredictor:
    """Get or create the global fraud predictor instance."""
    global _predictor
    if _predictor is None:
        _predictor = FraudPredictor()
    return _predictor