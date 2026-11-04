from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI(title="Employee Welfare K-Means API")

# 1. Get the absolute path to the 'machine-learning' folder
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE, "models")

# 2. Load the models from your models folder
model        = joblib.load(os.path.join(MODELS_DIR, "kmeans_model.pkl"))
scaler       = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))
feature_list = joblib.load(os.path.join(MODELS_DIR, "feature_list.pkl"))
cluster_map  = joblib.load(os.path.join(MODELS_DIR, "cluster_labels.pkl"))

# 3. Ensure the features match exactly what the model was trained on
EXPECTED = [
    "number_of_dependents",
    "children_count",
    "elderly_dependents",
    "caregiving_responsibility",
    "financial_difficulty",
    "elderly_care_need",
    "education_support_need",
    "bereavement_recent",
]
assert list(feature_list) == EXPECTED, f"Feature order mismatch: {feature_list}"


class Features(BaseModel):
    number_of_dependents: int
    children_count: int
    elderly_dependents: int
    caregiving_responsibility: int
    financial_difficulty: int
    elderly_care_need: int
    education_support_need: int
    bereavement_recent: int


class Prediction(BaseModel):
    clusterId: int
    clusterLabel: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=Prediction)
def predict(f: Features):
    # Build the 8-feature array
    vector = np.array([[
        f.number_of_dependents,
        f.children_count,
        f.elderly_dependents,
        f.caregiving_responsibility,
        f.financial_difficulty,
        f.elderly_care_need,
        f.education_support_need,
        f.bereavement_recent,
    ]], dtype=float)

    # Scale and predict
    scaled = scaler.transform(vector)
    cluster_id = int(model.predict(scaled)[0])
    
    # Look up the name (e.g. 1 -> "Sandwich Caregiver")
    label = cluster_map.get(cluster_id, "Unassigned")

    return Prediction(clusterId=cluster_id, clusterLabel=label)