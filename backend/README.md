# CyberOptix Enterprise Backend

> **"Know your cyber risk in money, understand what is driving it, and invest where every rupee reduces the most risk."**

CyberOptix is an AI-powered continuous cyber-risk quantification and cybersecurity investment optimization backend platform built for enterprise, financial, and regulated organizations.

---

## 🚀 Key Capabilities

1. **FAIR Quantitative Risk Engine**:
   - Decomposes cyber risk into Loss Event Frequency ($\text{LEF} = \text{TEF} \times \text{Vuln} \times (1 - \text{Control})$) and Loss Magnitude ($\text{LM}$).
   - Derives Expected Annual Loss ($\text{EAL}$), Value-at-Risk ($\text{VaR 95\%}$), and Conditional VaR / Expected Shortfall in real currency (e.g. INR ₹ / USD $).
2. **10,000+ Iteration Monte Carlo Simulation**:
   - Probabilistic sampling using Poisson (event frequency), Triangular/Beta-PERT (vulnerability exploitation), and Lognormal (financial loss magnitude).
   - Generates empirical Loss Exceedance Curves and interactive histogram bins.
3. **MIP Investment Optimizer (PuLP)**:
   - Solves budget-constrained 0/1 Knapsack portfolio selection.
   - Accounts for dependency chains, mandatory regulatory controls, and discounts for overlapping defenses.
4. **Grounded AI Copilot**:
   - Strict tool-calling architecture (cannot directly query or alter databases).
   - Returns evidence citations (SHA-256 hashes), explicit assumptions, data freshness indicators, and refuses to auto-approve material financial actions without human signoff.
5. **Multi-Factor Control Strength Evaluator**:
   $$\text{Control Strength} = \text{Coverage} \times \text{Implementation Quality} \times \text{Freshness} \times \text{Test Effectiveness} \times (1 - \text{Failure Rate})$$
6. **Multi-Tenant RBAC & Cryptographic Audit Trail**:
   - 9 granular enterprise roles (Board Viewer, CFO, CISO, SOC Analyst, GRC Analyst, IT Owner, Auditor, Org Admin, Platform Admin).
   - Cryptographically chained SHA-256 tamper-evident audit log.

---

## 🛠️ Technology Stack

- **Framework**: Python 3.12+, FastAPI, Pydantic v2
- **ORM & Database**: SQLAlchemy 2 (Async), SQLite / PostgreSQL
- **Mathematical & Optimization**: NumPy, SciPy, PuLP, Pandas
- **Security**: OAuth 2.1 / JWT tokens, bcrypt password hashing, RFC 7807 problem details
- **Testing**: Pytest, Pytest-Asyncio, HTTPX

---

## 📦 Quick Start & Local Execution

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Backend API Server
```bash
uvicorn app.main:app --reload --port 8000
```
- **Interactive OpenAPI Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

### 3. Run Automated Tests
```bash
pytest -v
```

---

## 📑 Pre-Configured Seed Data (Acme Financial Services)

- **Organization**: Acme Financial Services (Currency: INR ₹, Risk Appetite: ₹1.00 Crore)
- **Primary Scenario**: *Ransomware affecting Core Payment Processing Gateway*
  - **Annual Threat Frequency**: 0.20
  - **Probability of Success**: 0.25
  - **Defensive Control Strength**: 0.64
  - **Loss Magnitude**: ₹5.00 Crore (Median), ₹15.00 Crore (P95)
  - **Expected Annual Loss (EAL)**: **₹9.00 Lakh**
  - **Value at Risk (VaR 95%)**: **₹15.00 Crore**
- **Candidate Investments**:
  1. *Phishing-Resistant FIDO2 MFA*: ₹25 Lakh (60 days)
  2. *Air-Gapped Immutable Backups*: ₹35 Lakh (90 days)
  3. *Zero-Trust Network Microsegmentation*: ₹70 Lakh (180 days)
  4. *Automated Cyber Recovery Drills*: ₹10 Lakh (30 days)

---

## 🔌 Example API Requests

### 1. Executive Risk Dashboard
```bash
curl -X GET http://localhost:8000/api/v1/dashboard/executive
```

### 2. Optimize Security Investment Portfolio (PuLP)
```bash
curl -X POST http://localhost:8000/api/v1/investments/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "budget": 6000000.0,
    "planning_period": "FY 2026-2027",
    "objective": "Maximize Total Risk Reduction"
  }'
```

### 3. Run Probabilistic What-If Simulation
```bash
curl -X POST http://localhost:8000/api/v1/simulations/what-if \
  -H "Content-Type: application/json" \
  -d '{
    "scenario_id": "scen_ransomware_payment_01",
    "name": "Simulate FIDO2 MFA & Immutable Backups Upgrade"
  }'
```

### 4. Query Grounded AI Copilot
```bash
curl -X POST http://localhost:8000/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is our highest risk scenario and what investment reduces it most?"
  }'
```
