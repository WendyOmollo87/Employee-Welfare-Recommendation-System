import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import joblib
import os

# ============================================================
# Paths
# ============================================================

BASE = r"C:\Users\wendy\OneDrive\Desktop\Employee Welfare Recomendation System\employee-welfare-system\machine-learning"

DATA_RAW       = os.path.join(BASE, "data", "synthetic_employee_welfare.csv")
DATA_CLUSTERED = os.path.join(BASE, "data", "employees_with_clusters.csv")
MODELS_DIR     = os.path.join(BASE, "models")

os.makedirs(MODELS_DIR, exist_ok=True)

# ============================================================
# Load data
# ============================================================

df = pd.read_csv(DATA_RAW)

# ============================================================
# Clustering features
# ============================================================

clustering_features = [
    "number_of_dependents",
    "children_count",
    "elderly_dependents",
    "caregiving_responsibility",
    "financial_difficulty",
    "elderly_care_need",
    "education_support_need",
    "bereavement_recent",
]

X = df[clustering_features].copy()

# ============================================================
# Scale
# ============================================================

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ============================================================
# Train K-Means
# ============================================================

K = 4
km = KMeans(n_clusters=K, random_state=42, n_init=10)
df["cluster_id"] = km.fit_predict(X_scaled)

# ============================================================
# Cluster labels
#
# Verified from centroid analysis and age distribution:
#   Cluster 0 -> Working Parent        (mean age 40.4, high children)
#   Cluster 1 -> Sandwich Caregiver    (mean age 44.9, high elderly)
#   Cluster 2 -> Early Career          (mean age 32.9, low burden)
#   Cluster 3 -> Recent Bereavement    (100% bereaved)
# ============================================================

cluster_labels = {
    0: "Working Parent",
    1: "Sandwich Caregiver",
    2: "Early Career",
    3: "Recent Bereavement",
}

df["cluster_label"] = df["cluster_id"].map(cluster_labels)

# ============================================================
# Evaluation
# ============================================================

sil = silhouette_score(X_scaled, df["cluster_id"])

print("=" * 60)
print("FINAL MODEL TRAINED")
print("=" * 60)
print(f"K = {K}")
print(f"Silhouette Score: {sil:.4f}")
print("\nCluster distribution:")
print(df["cluster_label"].value_counts())

# ============================================================
# Save
# ============================================================

joblib.dump(km, os.path.join(MODELS_DIR, "kmeans_model.pkl"))
joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler.pkl"))
joblib.dump(clustering_features, os.path.join(MODELS_DIR, "feature_list.pkl"))
joblib.dump(cluster_labels, os.path.join(MODELS_DIR, "cluster_labels.pkl"))

df.to_csv(DATA_CLUSTERED, index=False)

print("\nSaved files:")
print("  models/kmeans_model.pkl")
print("  models/scaler.pkl")
print("  models/feature_list.pkl")
print("  models/cluster_labels.pkl")
print("  data/employees_with_clusters.csv")