import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# --- Load data ---
df = pd.read_csv("data/synthetic_employee_welfare.csv")

# --- Clustering features ---
features = [
    "number_of_dependents",
    "children_count",
    "elderly_dependents",
    "caregiving_responsibility",
    "financial_difficulty",
    "elderly_care_need",
    "education_support_need",
    "bereavement_recent",
]

X = df[features]
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# --- Train with K=4 ---
km = KMeans(n_clusters=4, random_state=42, n_init=10)
df["cluster"] = km.fit_predict(X_scaled)

print("=" * 70)
print("K=4 CLUSTER DIAGNOSTIC")
print("=" * 70)
print(f"Silhouette Score: {silhouette_score(X_scaled, df['cluster']):.4f}")

# --- Cluster sizes ---
print("\nCluster sizes:")
sizes = df["cluster"].value_counts().sort_index()
for cluster_id, size in sizes.items():
    pct = size / len(df) * 100
    print(f"  Cluster {cluster_id}: {size} employees ({pct:.1f}%)")

# --- Centroids in original units ---
print("\nCluster centroids (original units):")
centroids = pd.DataFrame(
    scaler.inverse_transform(km.cluster_centers_),
    columns=features
)
centroids.index.name = "cluster"
print(centroids.round(3))

# --- Per-cluster means for key indicators ---
print("\n" + "=" * 70)
print("PER-CLUSTER AVERAGES (to see if clusters are distinct)")
print("=" * 70)

for col in features:
    print(f"\n{col}:")
    means = df.groupby("cluster")[col].mean().round(3)
    for cid, val in means.items():
        bar = "█" * int(val * 20)
        print(f"  Cluster {cid}: {val:6.3f}  {bar}")