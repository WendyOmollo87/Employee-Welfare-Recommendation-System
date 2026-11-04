import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, davies_bouldin_score

df = pd.read_csv("data/synthetic_employee_welfare.csv")

feature_sets = {
    "Proposal set (8 features)": [
        "number_of_dependents", "children_count", "elderly_dependents",
        "caregiving_responsibility", "bereavement_recent",
        "elderly_care_need", "education_support_need", "financial_difficulty"
    ],
    "Proposal set + mental wellbeing (9)": [
        "number_of_dependents", "children_count", "elderly_dependents",
        "caregiving_responsibility", "bereavement_recent",
        "elderly_care_need", "education_support_need",
        "financial_difficulty", "mental_wellbeing_concern"
    ],
    "Proposal set + mental + health (10)": [
        "number_of_dependents", "children_count", "elderly_dependents",
        "caregiving_responsibility", "bereavement_recent",
        "elderly_care_need", "education_support_need",
        "financial_difficulty", "mental_wellbeing_concern",
        "health_concern"
    ],
}

for name, feats in feature_sets.items():
    X = df[feats]
    X_scaled = StandardScaler().fit_transform(X)

    print(f"\n{name}")
    print(f"({len(feats)} features)")
    print("-" * 55)

    for k in [2, 3, 4]:
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = km.fit_predict(X_scaled)
        sil = silhouette_score(X_scaled, labels)
        db  = davies_bouldin_score(X_scaled, labels)
        print(f"  K={k}: silhouette = {sil:.3f}  |  davies-bouldin = {db:.3f}")