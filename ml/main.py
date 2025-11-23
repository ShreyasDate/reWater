from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS so your React frontend (running on port 5173) can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory where train_model.py saved the files
ARTIFACT_DIR = "models_v1"

# Global variable to hold loaded artifacts
artifacts = {}

@app.on_event("startup")
def load_artifacts():
    """Load model and preprocessors on server startup."""
    try:
        artifacts["model"] = joblib.load(os.path.join(ARTIFACT_DIR, "model.joblib"))
        artifacts["imputer"] = joblib.load(os.path.join(ARTIFACT_DIR, "imputer.joblib"))
        artifacts["scaler"] = joblib.load(os.path.join(ARTIFACT_DIR, "scaler.joblib"))
        artifacts["label_encoder"] = joblib.load(os.path.join(ARTIFACT_DIR, "label_encoder.joblib"))
        artifacts["features"] = joblib.load(os.path.join(ARTIFACT_DIR, "features.joblib"))
        print("✅ ML Artifacts Loaded Successfully")
    except Exception as e:
        print(f"❌ Error loading artifacts: {e}")
        print("HINT: Did you run 'python train_model.py' to generate the models_v1 folder?")

# Define the input data structure (matches the 'features' list)
class WastewaterInput(BaseModel):
    flow_rate: float
    influent_BOD: float
    influent_COD: float
    influent_TSS: float
    influent_pH: float
    influent_TDS: float
    aeration_rate: float
    chemical_dose: float
    sludge_recycle_rate: float
    retention_time: float
    temperature: float
    # Note: dose_per_m3 and influent_BOD_roll24 are derived, but we need 'effluent_BOD_lag1' from user/system
    effluent_BOD_lag1: float

@app.post("/predict")
def predict(data: WastewaterInput):
    if "model" not in artifacts:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # 1. Convert input JSON to DataFrame
        input_data = data.dict()
        df = pd.DataFrame([input_data])

        # 2. Feature Engineering (Replicating logic from app.py/train_model.py)
        
        # Calculate dose_per_m3
        if df['flow_rate'][0] > 0:
            df['dose_per_m3'] = df['chemical_dose'] / df['flow_rate']
        else:
            df['dose_per_m3'] = 0.0
        
        # Calculate influent_BOD_roll24
        # Since this is a single prediction request, we can't really calculate a rolling average 
        # from history. We will use the current 'influent_BOD' as a proxy, similar to the training logic fallback.
        df['influent_BOD_roll24'] = df['influent_BOD']

        # 3. Ensure columns are in the exact order the model expects
        model_features = artifacts["features"]
        df = df[model_features]

        # 4. Preprocessing (Impute -> Scale)
        X_imp = artifacts["imputer"].transform(df)
        X_scaled = artifacts["scaler"].transform(X_imp)

        # 5. Prediction
        # Get probabilities for all classes
        probs = artifacts["model"].predict_proba(X_scaled)[0]
        
        # Get the class with the highest probability
        pred_idx = np.argmax(probs)
        pred_label = artifacts["label_encoder"].inverse_transform([pred_idx])[0]
        confidence = float(probs[pred_idx])

        # Create a dictionary of all class probabilities
        class_probs = {
            cls: float(prob) 
            for cls, prob in zip(artifacts["label_encoder"].classes_, probs)
        }

        return {
            "prediction": pred_label,
            "confidence": confidence,
            "probabilities": class_probs
        }

    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"message": "EduBotx ML API is running"}