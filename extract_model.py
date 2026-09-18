"""
extract_model.py
────────────────
Run this ONCE to pull the learned numbers out of regressor.pkl
and save them as a plain JSON file that Express can read.

Usage:
  python extract_model.py

Output:
  backend/model.json
"""

import pickle
import json
import os
import numpy as np

MODEL_PATH = "models/regressor.pkl"
OUTPUT_PATH = "backend/model.json"

# Load the trained sklearn model
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

# Extract what we need
data = {
    "intercept": float(model.intercept_),
    "coef": [float(c) for c in model.coef_],
    "feature_names": ["temp", "RH", "wind", "rain", "FFMC", "DMC", "DC", "ISI"],
    "note": "Target was log(area+1). Reverse with: area = exp(prediction) - 1"
}

os.makedirs("backend", exist_ok=True)

with open(OUTPUT_PATH, "w") as f:
    json.dump(data, f, indent=2)

print("✅ model.json written to", OUTPUT_PATH)
print(f"   Intercept : {data['intercept']}")
print(f"   Coefficients: {data['coef']}")
