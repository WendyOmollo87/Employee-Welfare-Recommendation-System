# Employee Welfare Recommendation System

An integrated platform designed to help organizations provide personalized welfare support to employees. It uses **K-Means Clustering** to segment employees based on dependents and life events, and a **Local Large Language Model (Llama 3.2)** to generate strategic HR analytics reports.

## Repository Structure
* `/frontend` - Next.js UI (Employee and HR dashboards)
* `/backend` - C# ASP.NET Core Web API (Orchestration, Auth, DB)
* `/machine-learning` - Python FastAPI service (K-Means Clustering & LLM integration)

## Prerequisites
* Node.js (v18+)
* .NET SDK (v10)
* Python (v3.13+)
* PostgreSQL
* Ollama (running locally with `llama3.2:1b` pulled)

## Local Setup Instructions

### 1. Database (PostgreSQL)
Create a database named `employee_welfare`. 

### 2. Backend (C# API)
```bash
cd backend/EmployeeWelfare.API
# Update appsettings.json with your PostgreSQL connection string
dotnet ef database update
dotnet run
