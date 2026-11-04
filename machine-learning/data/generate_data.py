"""
Synthetic Employee Welfare Dataset Generator
=============================================

Generates a calibrated synthetic dataset representing the Kenyan
formal-sector workforce.

Probability distributions are anchored to published Kenyan sources
wherever available. Where no source exists, assumptions are
documented in DATA_DICTIONARY.md.

Sources used for calibration:
    - Old Mutual Financial Services Monitor (2025)
    - KNCHR Mental Health Report (2024)
    - IHRM Employee Assistance Programme Report (2024)
    - Niche Human Capital Advisory (2026)
"""
import pandas as pd
import numpy as np

# ============================================================
# SETTINGS
# ============================================================

SEED = 42
N_EMPLOYEES = 2000

rng = np.random.default_rng(SEED)


# ============================================================
# HELPERS
# ============================================================

def choose(values, probabilities):
    """Return a single scalar from values, weighted by probabilities."""
    result = rng.choice(values, p=probabilities)
    return result.item()


def yes_no(probability):
    return int(rng.random() < probability)


def randint(low, high):
    return int(rng.integers(low, high))
# ============================================================
# CALIBRATION TARGETS (from real Kenyan sources)
# ============================================================

TARGET_SANDWICH_RATE     = 0.46   # Old Mutual (2025)
TARGET_CHILDREN_RATE     = 0.75   # Old Mutual (2025)
TARGET_ELDERLY_RATE      = 0.58   # Old Mutual (2025)
TARGET_FINANCIAL_RATE    = 0.40   # Old Mutual (2025)
TARGET_MENTAL_RATE       = 0.15   # KNCHR (2024)
TARGET_BEREAVEMENT_RATE  = 0.05   # Assumption
TARGET_DIVORCE_RATE      = 0.03   # Assumption
TARGET_MARRIAGE_RATE     = 0.06   # Assumption
TARGET_BIRTH_RATE        = 0.08   # Assumption


# ============================================================
# DEMOGRAPHIC DISTRIBUTIONS
# ============================================================

age_groups = [
    ("22-24", 0.08),
    ("25-29", 0.17),
    ("30-39", 0.35),
    ("40-49", 0.24),
    ("50-59", 0.13),
    ("60-64", 0.03),
]

departments = ["Operations", "IT", "Finance", "HR", "Marketing"]
department_weights = [0.30, 0.25, 0.20, 0.10, 0.15]

genders = ["Female", "Male"]
gender_weights = [0.50, 0.50]


# ============================================================
# GENERATE EMPLOYEE RECORDS
# ============================================================

records = []

for i in range(N_EMPLOYEES):

    # ---------------- Age ----------------
    age_group = choose(
        [g[0] for g in age_groups],
        [g[1] for g in age_groups]
    )

    if age_group == "22-24":
        age = randint(22, 25)
    elif age_group == "25-29":
        age = randint(25, 30)
    elif age_group == "30-39":
        age = randint(30, 40)
    elif age_group == "40-49":
        age = randint(40, 50)
    elif age_group == "50-59":
        age = randint(50, 60)
    else:
        age = randint(60, 65)

    # ---------------- Gender ----------------
    gender = choose(genders, gender_weights)

    # ---------------- Department ----------------
    department = choose(departments, department_weights)

    # ---------------- Marital Status ----------------
    if age <= 24:
        marital_status = choose(
            ["Single", "Married", "Divorced", "Widowed"],
            [0.88, 0.10, 0.02, 0.00]
        )
    elif age <= 29:
        marital_status = choose(
            ["Single", "Married", "Divorced", "Widowed"],
            [0.68, 0.28, 0.03, 0.01]
        )
    elif age <= 39:
        marital_status = choose(
            ["Single", "Married", "Divorced", "Widowed"],
            [0.32, 0.58, 0.08, 0.02]
        )
    elif age <= 49:
        marital_status = choose(
            ["Single", "Married", "Divorced", "Widowed"],
            [0.18, 0.65, 0.12, 0.05]
        )
    elif age <= 59:
        marital_status = choose(
            ["Single", "Married", "Divorced", "Widowed"],
            [0.15, 0.62, 0.13, 0.10]
        )
    else:
        marital_status = choose(
            ["Single", "Married", "Divorced", "Widowed"],
            [0.18, 0.55, 0.10, 0.17]
        )

    # ---------------- Children (target 75% have at least one) ----------------
    if age < 25:
        children_count = choose([0, 1], [0.97, 0.03])
    elif age < 30:
        children_count = choose([0, 1, 2], [0.70, 0.22, 0.08])
    elif age < 40:
        children_count = choose([0, 1, 2, 3, 4], [0.20, 0.28, 0.30, 0.17, 0.05])
    elif age < 50:
        children_count = choose([0, 1, 2, 3, 4], [0.15, 0.24, 0.32, 0.20, 0.09])
    elif age < 60:
        children_count = choose([0, 1, 2, 3, 4], [0.20, 0.26, 0.30, 0.17, 0.07])
    else:
        children_count = choose([0, 1, 2, 3], [0.35, 0.30, 0.25, 0.10])

    # ---------------- Elderly Dependents (target 58%) ----------------
    if age < 30:
        elderly_dependents = choose([0, 1], [0.94, 0.06])
    elif age < 40:
        elderly_dependents = choose([0, 1, 2], [0.68, 0.26, 0.06])
    elif age < 50:
        elderly_dependents = choose([0, 1, 2], [0.38, 0.43, 0.19])
    elif age < 60:
        elderly_dependents = choose([0, 1, 2], [0.28, 0.46, 0.26])
    else:
        elderly_dependents = choose([0, 1, 2], [0.36, 0.42, 0.22])

    number_of_dependents = int(children_count + elderly_dependents)

    # ---------------- Sandwich Generation Flag ----------------
    is_sandwich = 1 if (children_count > 0 and elderly_dependents > 0) else 0

    # ---------------- Caregiving Responsibility ----------------
    caregiving_probability = 0.03 + 0.12 * min(children_count, 3) + 0.25 * elderly_dependents
    caregiving_probability = min(caregiving_probability, 0.90)
    caregiving_responsibility = yes_no(caregiving_probability)

    # ---------------- Financial Difficulty (target ~40%) ----------------
    financial_probability = 0.15

    if age < 30:
        financial_probability += 0.10
    if children_count > 0:
        financial_probability += 0.08
    if children_count >= 2:
        financial_probability += 0.08
    if elderly_dependents > 0:
        financial_probability += 0.07
    if caregiving_responsibility:
        financial_probability += 0.08
    if marital_status in ["Divorced", "Widowed"]:
        financial_probability += 0.08

    financial_probability = min(financial_probability, 0.85)
    financial_difficulty = yes_no(financial_probability)

    # ---------------- Mental Wellbeing Concern (target ~15%) ----------------
    mental_probability = 0.08

    if financial_difficulty:
        mental_probability += 0.08
    if caregiving_responsibility:
        mental_probability += 0.06
    if marital_status in ["Divorced", "Widowed"]:
        mental_probability += 0.08

    mental_probability = min(mental_probability, 0.55)
    mental_wellbeing_concern = yes_no(mental_probability)

    # ---------------- Health Concern ----------------
    if age < 30:
        health_probability = 0.08
    elif age < 40:
        health_probability = 0.12
    elif age < 50:
        health_probability = 0.18
    elif age < 60:
        health_probability = 0.25
    else:
        health_probability = 0.33

    if elderly_dependents > 0:
        health_probability += 0.04

    health_concern = yes_no(min(health_probability, 0.55))

    # ---------------- Life Events ----------------
    bereavement_probability = 0.03
    if age >= 40:
        bereavement_probability += 0.02
    if elderly_dependents > 0:
        bereavement_probability += 0.02
    bereavement_recent = yes_no(min(bereavement_probability, 0.12))

    if marital_status == "Married" and age < 40:
        marriage_recent = yes_no(0.06)
    else:
        marriage_recent = yes_no(0.01)

    if children_count > 0 and age < 45:
        birth_recent = yes_no(0.08)
    else:
        birth_recent = 0

    if marital_status == "Divorced":
        divorce_recent = yes_no(0.15)
    else:
        divorce_recent = 0

    # ---------------- Welfare Needs ----------------
    if elderly_dependents > 0:
        elderly_care_probability = 0.35 + 0.15 * elderly_dependents + 0.10 * caregiving_responsibility
        elderly_care_need = yes_no(min(elderly_care_probability, 0.85))
    else:
        elderly_care_need = 0

    if children_count > 0:
        education_probability = 0.35
        if children_count >= 2:
            education_probability += 0.15
        if financial_difficulty:
            education_probability += 0.15
        education_support_need = yes_no(min(education_probability, 0.80))
    else:
        education_support_need = 0

    # ---------------- Program Usage (outputs) ----------------
    financial_program_used = yes_no(min(0.05 + 0.35 * financial_difficulty + 0.10 * caregiving_responsibility, 0.70))
    family_support_used = yes_no(min(0.03 + 0.30 * (children_count > 0) + 0.25 * (elderly_dependents > 0) + 0.10 * caregiving_responsibility, 0.75))
    counselling_used = yes_no(min(0.03 + 0.35 * mental_wellbeing_concern + 0.15 * (marital_status in ["Divorced", "Widowed"]) + 0.10 * bereavement_recent, 0.70))

    records.append({
        "employee_id": f"EMP{str(i+1).zfill(5)}",
        "age": age,
        "gender": gender,
        "department": department,
        "marital_status": marital_status,
        "number_of_dependents": number_of_dependents,
        "children_count": int(children_count),
        "elderly_dependents": int(elderly_dependents),
        "is_sandwich": is_sandwich,
        "caregiving_responsibility": caregiving_responsibility,
        "financial_difficulty": financial_difficulty,
        "mental_wellbeing_concern": mental_wellbeing_concern,
        "health_concern": health_concern,
        "bereavement_recent": bereavement_recent,
        "marriage_recent": marriage_recent,
        "birth_recent": birth_recent,
        "divorce_recent": divorce_recent,
        "elderly_care_need": elderly_care_need,
        "education_support_need": education_support_need,
        "financial_program_used": financial_program_used,
        "family_support_used": family_support_used,
        "counselling_used": counselling_used,
    })


# ============================================================
# SAVE
# ============================================================

df = pd.DataFrame(records)
df.to_csv("data/synthetic_employee_welfare.csv", index=False)

print("=" * 65)
print("CALIBRATED SYNTHETIC DATASET CREATED")
print("=" * 65)
print(f"Employees: {len(df)}")
print(f"Columns:   {len(df.columns)}")

print("\n" + "-" * 65)
print("CALIBRATION CHECK (target vs actual)")
print("-" * 65)

checks = [
    ("Children rate (>= 1)",    (df["children_count"] > 0).mean(),            TARGET_CHILDREN_RATE),
    ("Elderly rate (>= 1)",     (df["elderly_dependents"] > 0).mean(),        TARGET_ELDERLY_RATE),
    ("Sandwich generation",     (df["is_sandwich"] == 1).mean(),              TARGET_SANDWICH_RATE),
    ("Financial difficulty",    df["financial_difficulty"].mean(),            TARGET_FINANCIAL_RATE),
    ("Mental wellbeing concern",df["mental_wellbeing_concern"].mean(),        TARGET_MENTAL_RATE),
    ("Bereavement recent",      df["bereavement_recent"].mean(),              TARGET_BEREAVEMENT_RATE),
]

for label, actual, target in checks:
    diff = actual - target
    marker = "OK " if abs(diff) < 0.05 else "OFF"
    print(f"  [{marker}] {label:28s} target={target:.2%}  actual={actual:.2%}  diff={diff:+.2%}")

print("\nDataset saved to data/synthetic_employee_welfare.csv")
print("=" * 65)