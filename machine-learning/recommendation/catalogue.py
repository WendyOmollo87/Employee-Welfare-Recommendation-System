"""
Welfare program catalogue.

Two sources of recommendations:
    1. Cluster baselines  - what everyone in a cluster should consider
    2. Feature triggers   - what this specific employee needs
"""

# ============================================================
# Cluster baselines
# ============================================================

CLUSTER_RECOMMENDATIONS = {
    "Early Career": [
        "Career development program",
        "Financial wellness workshop",
        "Retirement planning seminar",
        "Preventive health screening",
    ],
    "Working Parent": [
        "School fee support program",
        "Family health insurance top-up",
        "Childcare assistance",
        "Parental leave advisory",
        "Family counseling service",
    ],
    "Sandwich Caregiver": [
        "Eldercare resource referral",
        "Caregiver support grant",
        "Flexible work arrangement",
        "Respite care service",
        "Family counseling",
        "Stress management program",
    ],
    "Recent Bereavement": [
        "Priority HR check-in",
        "Emergency financial assistance",
        "Bereavement counselling",
        "Compassionate leave options",
        "Mental health support",
        "Legal and estate advisory",
    ],
}


# ============================================================
# Feature triggers
#
# Each entry: (condition function, [recommendations])
# The condition receives the employee dict.
# ============================================================

FEATURE_TRIGGERS = [

    # Bereavement
    (
        lambda e: e.get("bereavement_recent") == 1,
        ["Bereavement counselling", "Compassionate leave options"],
    ),

    # Financial difficulty
    (
        lambda e: e.get("financial_difficulty") == 1,
        ["Financial assistance program"],
    ),

    # High burden + financial strain
    (
        lambda e: (
            e.get("financial_difficulty") == 1
            and e.get("number_of_dependents", 0) >= 2
        ),
        ["Emergency financial grant"],
    ),

    # Eldercare
    (
        lambda e: e.get("elderly_care_need") == 1,
        ["Eldercare support services"],
    ),

    # Education support
    (
        lambda e: e.get("education_support_need") == 1,
        ["Education fee assistance"],
    ),

    # Caregiver + financial strain
    (
        lambda e: (
            e.get("caregiving_responsibility") == 1
            and e.get("financial_difficulty") == 1
        ),
        ["Caregiver financial support"],
    ),

    # Large family
    (
        lambda e: e.get("number_of_dependents", 0) >= 3,
        ["Family support program enrollment"],
    ),

    # Divorce
    (
        lambda e: e.get("divorce_recent") == 1,
        ["Mental health support", "Single-parent support group"],
    ),

    # Multiple children + financial pressure
    (
        lambda e: (
            e.get("children_count", 0) >= 2
            and e.get("financial_difficulty") == 1
        ),
        ["School fee emergency fund"],
    ),

    # Heavy eldercare
    (
        lambda e: e.get("elderly_dependents", 0) >= 2,
        ["Specialist eldercare referral"],
    ),
]


# ============================================================
# Priority alert rules
#
# These do NOT appear as recommendations to the employee.
# They trigger an HR alert.
# ============================================================

PRIORITY_RULES = [
    (
        "Recent bereavement cluster - priority outreach",
        lambda e: e.get("cluster_label") == "Recent Bereavement",
    ),

    (
        "Recent bereavement - HR alert within 48 hours",
        lambda e: e.get("bereavement_recent") == 1,
    ),

    (
        "High dependency + financial strain - financial review",
        lambda e: (
            e.get("financial_difficulty") == 1
            and e.get("number_of_dependents", 0) >= 3
        ),
    ),

    (
        "Caregiver with mental health concern - well-being check",
        lambda e: (
            e.get("caregiving_responsibility") == 1
            and e.get("mental_wellbeing_concern") == 1
        ),
    ),
]