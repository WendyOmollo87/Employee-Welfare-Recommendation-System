"""
Test the recommendation engine on one employee from each cluster.
"""

import pandas as pd
from recommend import get_recommendations, get_priority_alerts


df = pd.read_csv("../data/employees_with_clusters.csv")

for label in ["Early Career", "Working Parent", "Sandwich Caregiver", "Recent Bereavement"]:
    sample = df[df["cluster_label"] == label].iloc[0].to_dict()

    print("=" * 65)
    print(f"CLUSTER: {label}")
    print("=" * 65)
    print(f"Employee ID           : {sample['employee_id']}")
    print(f"Dependents            : {sample['number_of_dependents']}")
    print(f"Financial difficulty  : {sample['financial_difficulty']}")
    print(f"Bereavement recent    : {sample['bereavement_recent']}")
    print(f"Eldercare need        : {sample['elderly_care_need']}")
    print(f"Education need        : {sample['education_support_need']}")

    print("\nRecommended welfare programs:")
    for rec in get_recommendations(sample, max_recommendations=5):
        print(f"   - {rec}")

    alerts = get_priority_alerts(sample)
    if alerts:
        print("\nHR PRIORITY ALERTS:")
        for a in alerts:
            print(f"   ! {a}")
    else:
        print("\nNo HR alerts.")

    print()