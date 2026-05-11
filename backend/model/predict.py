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
        self.feature_names = None
        self._load_models()
    
    def _load_models(self) -> None:
        """Load the trained model and scaler."""
        try:
            if Path(self.model_path).exists():
                self.model = joblib.load(self.model_path)
                print("✓ Fraud detection model loaded successfully")
                
                # Get actual feature names from model
                try:
                    if hasattr(self.model, 'feature_names_in_'):
                        self.feature_names = list(self.model.feature_names_in_)
                        print(f"✓ Model feature names: {self.feature_names}")
                    elif hasattr(self.model, 'get_booster'):
                        booster = self.model.get_booster()
                        if hasattr(booster, 'feature_names'):
                            self.feature_names = booster.feature_names
                            print(f"✓ Booster feature names: {self.feature_names}")
                    else:
                        print("⚠️  Could not get feature names from model")
                except Exception as e:
                    print(f"Warning: Could not extract feature names: {e}")
                    
            else:
                print("⚠️  Model file not found, using demo mode")
                self.model = None
                
            # Load scaler
            if Path(self.scaler_path).exists():
                self.scaler = joblib.load(self.scaler_path)
                print("✓ Scaler loaded successfully")
                if hasattr(self.scaler, 'feature_names_in_'):
                    print(f"✓ Scaler expects features: {list(self.scaler.feature_names_in_)}")
                print(f"✓ Scaler expects {self.scaler.n_features_in_} features")
            else:
                print("⚠️  Scaler file not found")
                self.scaler = None
            
        except Exception as e:
            print(f"Warning: Failed to load fraud detection model: {e}")
            print("Running in demo mode with mock predictions")
            self.model = None
            self.scaler = None
    
    def _prepare_features(self, transaction_data: Dict[str, Any]) -> np.ndarray:
        """
        Convert transaction data to model features in the correct order.
        
        Args:
            transaction_data: Dictionary containing transaction information
            
        Returns:
            Feature array ready for model prediction
        """
        # If we have the actual feature names from the model, use them
        if self.feature_names:
            expected_features = len(self.feature_names)
        elif self.scaler and hasattr(self.scaler, 'n_features_in_'):
            expected_features = self.scaler.n_features_in_
        else:
            expected_features = 6  # Fallback to input features only
        
        print(f"Preparing {expected_features} features for model")
        
        # Create feature array
        features = np.zeros(expected_features)
        
        # Map the 6 input fields to the first 6 positions
        # This assumes the model was trained with these as the first 6 features
        input_mapping = [
            "transaction_amount",
            "merchant_category", 
            "time_of_day",
            "location_mismatch",
            "previous_fraud_history",
            "device_risk_score"
        ]
        
        # Fill in the provided features
        for i, field_name in enumerate(input_mapping):
            if i < expected_features and field_name in transaction_data:
                value = transaction_data[field_name]
                # Convert boolean to float
                if isinstance(value, bool):
                    value = float(value)
                features[i] = value
                print(f"Feature {i} ({field_name}): {value}")
        
        # If model expects more features, fill with zeros (or reasonable defaults)
        if expected_features > 6:
            print(f"Filling remaining {expected_features - 6} features with zeros")
        
        return features.reshape(1, -1)
    
    def _get_shap_values(self, scaled_features: np.ndarray) -> List[Dict[str, Any]]:
        """
        Calculate SHAP values for feature importance.
        
        Args:
            scaled_features: Scaled input features
            
        Returns:
            List of feature importance dictionaries with proper SHAP values
        """
        try:
            import shap
            
            # Create SHAP explainer for tree model
            explainer = shap.TreeExplainer(self.model)
            
            # Calculate SHAP values on scaled input
            shap_values = explainer.shap_values(scaled_features)
            
            # Handle different SHAP output formats
            if isinstance(shap_values, list):
                # Binary classification - use positive class (fraud)
                shap_vals = shap_values[1] if len(shap_values) > 1 else shap_values[0]
            else:
                shap_vals = shap_values
            
            # Create feature importance list
            feature_importance = []
            feature_names = self.feature_names or [f"feature_{i}" for i in range(len(shap_vals[0]))]
            
            for i, (feature_name, shap_val) in enumerate(zip(feature_names, shap_vals[0])):
                contribution = "fraud" if shap_val > 0 else "legitimate"
                
                feature_importance.append({
                    "feature": feature_name,
                    "shap_value": float(shap_val),
                    "contribution": contribution,
                    "abs_value": abs(float(shap_val))
                })
            
            # Sort by absolute importance
            feature_importance.sort(key=lambda x: x["abs_value"], reverse=True)
            
            print(f"✓ SHAP values calculated: {[f'{f['feature']}: {f['shap_value']:.4f}' for f in feature_importance[:3]]}")
            
            return feature_importance
            
        except ImportError:
            print("⚠️  SHAP not available, using mock importance values")
            return self._get_mock_importance(scaled_features)
        except Exception as e:
            print(f"⚠️  SHAP calculation failed: {e}, using mock values")
            return self._get_mock_importance(scaled_features)
    
    def _get_mock_importance(self, features: np.ndarray) -> List[Dict[str, Any]]:
        """
        Generate mock feature importance values when SHAP is not available.
        
        Args:
            features: Input features (scaled or unscaled)
            
        Returns:
            List of mock feature importance dictionaries
        """
        feature_names = self.feature_names or [
            "transaction_amount", "merchant_category", "time_of_day", 
            "location_mismatch", "previous_fraud_history", "device_risk_score"
        ]
        
        feature_importance = []
        
        for i, feature_name in enumerate(feature_names):
            if i < len(features[0]):
                # Create realistic SHAP-like values (-2 to +2 range)
                base_val = features[0][i] if abs(features[0][i]) < 5 else features[0][i] / 1000
                shap_val = base_val * np.random.uniform(-0.5, 0.5)
                
                contribution = "fraud" if shap_val > 0 else "legitimate"
                
                feature_importance.append({
                    "feature": feature_name,
                    "shap_value": float(shap_val),
                    "contribution": contribution,
                    "abs_value": abs(float(shap_val))
                })
        
        # Sort by absolute importance
        feature_importance.sort(key=lambda x: x["abs_value"], reverse=True)
        
        return feature_importance
    
    def predict(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict fraud probability and generate feature explanations.
        
        Args:
            transaction_data: Dictionary containing transaction information
            
        Returns:
            Dictionary containing prediction results and explanations
        """
        print(f"Predicting for transaction: {transaction_data}")
        
        # If no model is loaded, generate realistic demo predictions
        if self.model is None:
            return self._generate_demo_prediction(transaction_data)
        
        # Prepare features in correct order
        features = self._prepare_features(transaction_data)
        print(f"Raw features shape: {features.shape}, values: {features[0][:6]}")
        
        # CRITICAL: Apply scaler BEFORE prediction
        scaled_features = features
        if self.scaler is not None:
            try:
                if self.scaler.n_features_in_ == features.shape[1]:
                    scaled_features = self.scaler.transform(features)
                    print(f"✓ Features scaled successfully")
                    print(f"Scaled features: {scaled_features[0][:6]}")
                else:
                    print(f"⚠️  Feature count mismatch: scaler expects {self.scaler.n_features_in_}, got {features.shape[1]}")
            except Exception as e:
                print(f"⚠️  Scaling failed: {e}")
        else:
            print("⚠️  No scaler available, using raw features")
        
        # Make prediction on SCALED features
        try:
            fraud_probability = float(self.model.predict_proba(scaled_features)[0][1])
            print(f"✓ Fraud probability: {fraud_probability:.4f}")
        except Exception as e:
            print(f"❌ Prediction failed: {e}")
            return self._generate_demo_prediction(transaction_data)
        
        # Determine risk level
        if fraud_probability < 0.3:
            risk_level = "LOW"
        elif fraud_probability < 0.7:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"
        
        # Calculate SHAP values on SCALED features
        feature_importance = self._get_shap_values(scaled_features)
        
        # Get top 6 features
        top_features = feature_importance[:6]
        
        return {
            "fraud_probability": fraud_probability,
            "risk_level": risk_level,
            "top_features": top_features,
            "raw_features": features.tolist()[0]
        }
    
    def _generate_demo_prediction(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate realistic demo predictions when model is not available.
        
        Args:
            transaction_data: Original transaction data
            
        Returns:
            Demo prediction results
        """
        print("🎭 Generating demo prediction")
        
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
        
        # Generate realistic SHAP-like values
        feature_importance = [
            {"feature": "transaction_amount", "shap_value": 0.45 if amount > 10000 else 0.12, "contribution": "fraud", "abs_value": 0.45 if amount > 10000 else 0.12},
            {"feature": "device_risk_score", "shap_value": device_risk * 0.3, "contribution": "fraud", "abs_value": device_risk * 0.3},
            {"feature": "location_mismatch", "shap_value": 0.28 if transaction_data.get("location_mismatch") else -0.15, "contribution": "fraud" if transaction_data.get("location_mismatch") else "legitimate", "abs_value": 0.28 if transaction_data.get("location_mismatch") else 0.15},
            {"feature": "previous_fraud_history", "shap_value": 0.35 if transaction_data.get("previous_fraud_history") else -0.20, "contribution": "fraud" if transaction_data.get("previous_fraud_history") else "legitimate", "abs_value": 0.35 if transaction_data.get("previous_fraud_history") else 0.20},
            {"feature": "time_of_day", "shap_value": 0.18 if time_of_day < 6 or time_of_day > 23 else -0.08, "contribution": "fraud" if time_of_day < 6 or time_of_day > 23 else "legitimate", "abs_value": 0.18 if time_of_day < 6 or time_of_day > 23 else 0.08},
            {"feature": "merchant_category", "shap_value": 0.15 if merchant_cat > 15 else -0.12, "contribution": "fraud" if merchant_cat > 15 else "legitimate", "abs_value": 0.15 if merchant_cat > 15 else 0.12}
        ]
        
        # Sort by absolute value
        feature_importance.sort(key=lambda x: x["abs_value"], reverse=True)
        
        return {
            "fraud_probability": fraud_probability,
            "risk_level": risk_level,
            "top_features": feature_importance,
            "raw_features": [amount, merchant_cat, time_of_day, float(transaction_data.get("location_mismatch", False)), float(transaction_data.get("previous_fraud_history", False)), device_risk * 100]
        }

# Global predictor instance
_predictor = None

def get_predictor() -> FraudPredictor:
    """Get or create the global fraud predictor instance."""
    global _predictor
    if _predictor is None:
        _predictor = FraudPredictor()
    return _predictor