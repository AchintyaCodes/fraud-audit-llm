#!/usr/bin/env python3
"""
Download fraud detection models from Hugging Face Hub on startup.
"""

import os
from pathlib import Path
from huggingface_hub import hf_hub_download

def download_models_if_missing():
    """Download models from Hugging Face if they don't exist locally."""
    
    model_dir = Path(__file__).parent / "model"
    model_path = model_dir / "fraud_model.pkl"
    scaler_path = model_dir / "scaler.pkl"
    
    # Check if models already exist
    if model_path.exists() and scaler_path.exists():
        print("✓ Models already exist locally")
        return True
    
    # Try to download from Hugging Face
    hf_repo = "AchintyaCodes/fraud-audit-models"
    
    try:
        print(f"📥 Downloading models from {hf_repo}...")
        
        # Download fraud model
        if not model_path.exists():
            print("  📤 Downloading fraud_model.pkl...")
            downloaded_model = hf_hub_download(
                repo_id=hf_repo,
                filename="fraud_model.pkl",
                local_dir=str(model_dir),
                local_dir_use_symlinks=False
            )
            print(f"  ✅ Model downloaded to {downloaded_model}")
        
        # Download scaler
        if not scaler_path.exists():
            print("  📤 Downloading scaler.pkl...")
            downloaded_scaler = hf_hub_download(
                repo_id=hf_repo,
                filename="scaler.pkl",
                local_dir=str(model_dir),
                local_dir_use_symlinks=False
            )
            print(f"  ✅ Scaler downloaded to {downloaded_scaler}")
        
        print("🎉 Models downloaded successfully!")
        return True
        
    except Exception as e:
        print(f"⚠️  Failed to download models: {e}")
        print("🔄 Will run in demo mode with mock predictions")
        return False

if __name__ == "__main__":
    download_models_if_missing()