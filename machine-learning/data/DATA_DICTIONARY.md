# Data Dictionary — Synthetic Employee Welfare Dataset

This dataset is **synthetic**. It was generated to simulate the Kenyan
formal-sector workforce. Distributions are calibrated against published
Kenyan sources where available. Where no source exists, assumptions
are documented below.

## Identity

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| employee_id | string | Unique employee identifier | Generated |

## Demographics

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| age | int | Employee age, 22–64 | Assumption, weighted toward 25–49 |
| gender | cat | Female / Male | Assumption: 50/50 |
| department | cat | Operations, IT, Finance, HR, Marketing | Assumption |
| marital_status | cat | Single, Married, Divorced, Widowed | Assumption, age-weighted |

## Dependents

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| number_of_dependents | int | Total dependents | Arithmetic |
| children_count | int | Number of children | Calibrated to 75% having children — Old Mutual (2025) |
| elderly_dependents | int | Number of elderly dependents | Calibrated to 58% — Old Mutual (2025) |
| is_sandwich | binary | Both children and elderly | Calibrated to 46% — Old Mutual (2025) |

## Stressors

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| caregiving_responsibility | binary | Active caregiver | Derived from dependents |
| financial_difficulty | binary | Financial strain | Calibrated to 40% — Old Mutual (2025) |
| mental_wellbeing_concern | binary | Mental health concern | Calibrated to 15% — KNCHR (2024) |

## Life Events

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| bereavement_recent | binary | Recent bereavement | Assumption ~5% |
| marriage_recent | binary | Recent marriage | Assumption ~6% |
| birth_recent | binary | Recent birth | Assumption ~8% |
| divorce_recent | binary | Recent divorce | Assumption ~3% |

## Welfare Needs

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| elderly_care_need | binary | Needs eldercare support | Derived from elderly dependents |
| education_support_need | binary | Needs education support | Derived from children |
| health_concern | binary | Health concern | Age-based assumption |

## Program Usage (Outputs)

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| financial_program_used | binary | Used financial program | Simulated |
| family_support_used | binary | Used family support | Simulated |
| counselling_used | binary | Used counselling | Simulated |

## Notes

- This dataset is a **simulation**, not an empirical sample.
- No real employee data was used.
- Probability distributions are documented and defensible where sources exist.
- Program availability is configured by HR in the system, not stored in this dataset.