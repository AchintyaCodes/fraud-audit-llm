#!/usr/bin/env python3
"""
Load fraud detection models from Hugging Face Hub with local caching
"""

import os
import joblib
from pathlib import Path
from dotenv import load_dotenv
from huggingface_hub import hf_hub_download

def load_models():
    """
    Load fraud detection models with automatic download and caching
    
    Returns:
        tuple: (fraud_model, scaler) - The loaded XGBoost model and scaler
    """
    
    # Load environment variables
    load_dotenv()
    
    # Get repository from environment
    hf_repo = os.getenv('HUGGINGFACE_REPO')
    if not hf_repo:
        raise ValueError("HUGGINGFACE_REPO not found in .env file")
    
    # Create models directory if it doesn't exist
    models_dir = Path('models')
    models_dir.mkdir(exist_ok=True)
    
    # Define local file paths
    local_model_path = models_dir / 'fraud_model.pkl'
    local_scaler_path = models_dir / 'scaler.pkl'
    
    # Check if models exist locally
    if local_model_path.exists() and local_scaler_path.exists():
        print("📁 Loading models from local cache...")
        try:
            fraud_model = joblib.load(local_model_path)
            scaler = joblib.load(local_scaler_path)
            print("✅ Models loaded from local cache successfully")
            return fraud_model, scaler
        except Exception as e:
            print(f"⚠️  Failed to load from cache: {e}")
            print("🔄 Downloading fresh models...")
    
    # Download models from Hugging Face Hub
    print(f"📥 Downloading models from {hf_repo}...")
    
    try:
        # Download fraud model
        print("  📤 Downloading fraud_model.pkl...")
        model_path = hf_hub_download(
            repo_id=hf_repo,
            filename="fraud_model.pkl",
            cache_dir=str(models_dir.parent),
            local_dir=str(models_dir),
            local_dir_use_symlinks=False
        )
        
        # Download scaler
        print("  📤 Downloading scaler.pkl...")
        scaler_path = hf_hub_download(
            repo_id=hf_repo,
            filename="scaler.pkl",
            cache_dir=str(models_dir.parent),
            local_dir=str(models_dir),
            local_dir_use_symlinks=False
        )
        
        # Load the downloaded models
        print("🔄 Loading downloaded models...")
        fraud_model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        
        print("✅ Models downloaded and loaded successfully")
        print(f"📁 Cached in: {models_dir.absolute()}")
        
        return fraud_model, scaler
        
    except Exception as e:
        print(f"❌ Failed to download models: {str(e)}")
        
        # Fallback: try to load from root directory
        root_model_path = Path('fraud_model.pkl')
        root_scaler_path = Path('scaler.pkl')
        
        if root_model_path.exists() and root_scaler_path.exists():
            print("🔄 Falling back to models in root directory...")
            try:
                fraud_model = joblib.load(root_model_path)
                scaler = joblib.load(root_scaler_path)
                
                # Copy to models directory for future use
                joblib.dump(fraud_model, local_model_path)
                joblib.dump(scaler, local_scaler_path)
                
                print("✅ Models loaded from root directory and cached")
                return fraud_model, scaler
            except Exception as fallback_error:
                print(f"❌ Fallback also failed: {fallback_error}")
        
        raise Exception(f"Could not load models from any source: {str(e)}")

def get_model_info():
    """Get information about the loaded models"""
    try:
        fraud_model, scaler = load_models()
        
        print("\n📊 Model Information:")
        print("=" * 30)
        print(f"Model Type: {type(fraud_model).__name__}")
        print(f"Scaler Type: {type(scaler).__name__}")
        
        # Try to get feature names if available
        if hasattr(scaler, 'feature_names_in_'):
            print(f"Features: {list(scaler.feature_names_in_)}")
        
        # Try to get model parameters if available
        if hasattr(fraud_model, 'get_params'):
            params = fraud_model.get_params()
            print(f"Model Parameters: {len(params)} parameters configured")
        
        return True
        
    except Exception as e:
        print(f"❌ Could not get model info: {e}")
        return False

if __name__ == "__main__":
    print("🤖 FraudGuard AI - Model Loading Utility")
    print("=" * 50)
    
    try:
        fraud_model, scaler = load_models()
        print(f"\n🎉 Success! Models are ready for use.")
        
        # Show model info
        get_model_info()
        
    except Exception as e:
        print(f"\n💥 Failed to load models: {e}")
        print("\nTroubleshooting:")
        print("1. Check your .env file has HUGGINGFACE_REPO set")
        print("2. Ensure you have internet connection")
        print("3. Verify the Hugging Face repository exists and is accessible")
        print("4. Try placing fraud_model.pkl and scaler.pkl in the root directory")