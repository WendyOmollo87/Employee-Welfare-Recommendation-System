"""
Recommendation engine.

Order of importance:
    1. Feature triggers     - individual needs come first
    2. Cluster baseline     - general support fills remaining slots
"""

from catalogue import CLUSTER_RECOMMENDATIONS, FEATURE_TRIGGERS, PRIORITY_RULES


def get_recommendations(employee, max_recommendations=5):
    """
    Return a deduplicated, ordered list of welfare recommendations.

    Feature triggers are placed first so that individual needs
    are never crowded out by cluster-level suggestions.
    """

    recommendations = []

    # --- Layer 1: individual feature triggers ---
    for condition, recs in FEATURE_TRIGGERS:
        try:
            if condition(employee):
                recommendations.extend(recs)
        except Exception:
            continue

    # --- Layer 2: cluster baseline fills remaining slots ---
    cluster = employee.get("cluster_label", "")
    recommendations.extend(CLUSTER_RECOMMENDATIONS.get(cluster, []))

    # --- Deduplicate while preserving order ---
    unique = list(dict.fromkeys(recommendations))

    return unique[:max_recommendations]


def get_priority_alerts(employee):
    alerts = []
    for message, condition in PRIORITY_RULES:
        try:
            if condition(employee):
                alerts.append(message)
        except Exception:
            continue
    return alerts


def needs_priority_intervention(employee):
    return len(get_priority_alerts(employee)) > 0