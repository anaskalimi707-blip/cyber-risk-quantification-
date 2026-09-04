# CyberOptix — AI-Powered Continuous Cyber-Risk Quantification & Investment Optimization

> **"The AI CFO for Cybersecurity"**  
> *Know your cyber risk in money, understand what is driving it, and invest where every rupee reduces the most risk.*

[![FastAPI Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Pydantic%20v2-009688?style=flat-square)](https://fastapi.tiangolo.com/)
[![Frontend React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript%20%2B%20Vite-1466AA?style=flat-square)](https://vitejs.dev/)
[![Quantitative Models](https://img.shields.io/badge/Quant%20Engines-FAIR%20%7C%20Monte%20Carlo%20%7C%20PuLP%20MIP-0C233F?style=flat-square)](https://www.fairinstitute.org/)
[![Tests](https://img.shields.io/badge/Tests-25%20Passed%20(100%25)-success?style=flat-square)](https://pytest.org/)

---

## 🏛️ Executive Summary

Traditional cybersecurity reporting relies on ambiguous color-coded heatmaps (Red/Amber/Green) and static GRC checklists that fail to communicate business exposure to CFOs, Boards, and executive leadership.

**CyberOptix** bridges the gap between technical telemetry and executive capital allocation. It operates as an **editorial financial statement for cyber risk**, continuously quantifying loss exposure in currency (INR/USD), mapping blast radiuses across business services, and calculating mathematically optimal control investment portfolios using Mixed-Integer Linear Programming.

Every view and API is engineered to answer three fundamental questions:
1. **What is the risk?** *(Quantified financial loss exposure & Value-at-Risk)*
2. **Why does it exist?** *(Root-cause attack vectors, control decay, and vulnerability exploitability)*
3. **What should I do next?** *(MIP-optimized security investment portfolios maximizing risk reduction per unit of budget)*

---

## 📸 Key Capabilities & Architectural Modules

```
                                  ┌─────────────────────────────────────────────────────────┐
                                  │            CyberOptix Statement Interface               │
                                  │   (Fraunces Serif Ledger UI, SVG Curves, Board Dossier) │
                                  └────────────────────────────┬────────────────────────────┘
                                                               │ REST / JSON
                                  ┌────────────────────────────▼────────────────────────────┐
                                  │              FastAPI Enterprise Backend                 │
                                  │       (JWT Auth, RBAC, Async Services, SQLite/Postgres) │
                                  └──────┬─────────────────────┬─────────────────────┬──────┘
                                         │                     │                     │
                ┌────────────────────────▼────────┐ ┌──────────▼──────────┐ ┌────────▼────────────────────────┐
                │       FAIR Monte Carlo Engine   │ │  PuLP MIP Optimizer │ │    Supervised ML Model Suite    │
                │  - 10,000 Iteration Simulations │ │  - Knapsack Solver  │ │  - Threat Probability (EPSS/CVSS)│
                │  - Beta-PERT Loss Distributions │ │  - Budget Bounds    │ │  - Blast Radius & Financial Loss │
                │  - Value-at-Risk (VaR 95%)      │ │  - Marginal ROI     │ │  - Control Decay Multipliers     │
                └─────────────────────────────────┘ └─────────────────────┘ └─────────────────────────────────┘
```

### 1. Executive Cyber Risk Statement (Overview)
- **Hero Financial Figure**: Real-time ₹18.4 Crore exposure figure rendered in high-contrast Fraunces serif typography.
- **Financial Balance Sheet Layout**: Four-column hairline breakdown displaying *Money at Risk Today*, *Expected Annual Loss (EAL)*, *95th Percentile VaR*, and *Board Risk Appetite Exceedance*.
- **90-Day Exposure Sparkline**: Dynamic SVG trend line highlighting exposure delta against active mitigation efforts.
- **Service Breakdown**: Revenue-at-risk bars for high-value banking and transaction rails (Core UPI Switch, Payment Gateway, Wealth Ops).

### 2. Risk Command Center & Scenario Ledger
- **6-Metric Global Ledger Row**: Instant executive rollups across scenarios, critical vulnerabilities, control coverage, and annual loss.
- **Interactive Scatter Matrix**: Visualizes risk scenarios along *Likelihood vs. Financial Impact (INR)* with quadrant thresholds.
- **Searchable Scenario Matrix**: Filter scenarios by line of business, threat vector, and regulatory criticality.

### 3. Scenario Detail & Attack Path Visualizer
- **7-Step Kill-Chain Graph**: Interactive attack path tracking threat execution from Initial Phishing to Lateral Movement, Database Exfiltration, and Ransomware Execution.
- **Loss Exceedance Curve (LEC)**: Log-scale probability vs. loss distribution with 90% confidence intervals.
- **Decision Action Flow**: Direct *Treat*, *Transfer* (Cyber Insurance), or *Accept* workflows with executive sign-off audit logging.

### 4. Assets & Exposure Matrix
- **Asset Financial Ledger**: Asset inventory mapped directly to daily revenue impact, exploitability (EPSS), internet exposure, and active blast radius.
- **Contextual Callouts**: Automated insights identifying single-points-of-failure and unmitigated high-risk nodes.

### 5. Multi-Factor Controls Matrix
- **Tri-Factor Effectiveness Scoring**: Control strength computed via:
  $$\text{Effectiveness} = \text{Coverage \%} \times \text{Implementation \%} \times \text{Evidence Freshness}$$
- **Decay Warnings**: Automated alerts when telemetry evidence exceeds 30-day freshness SLAs.

### 6. Mixed-Integer Linear Programming (PuLP) Investment Optimizer
- **Capital Allocation Solver**: Solves a 0/1 Knapsack optimization problem to select the combination of security controls that minimizes residual loss under arbitrary budget constraints:
  $$\max \sum_{i=1}^n x_i \cdot \Delta \text{Loss}_i \quad \text{subject to} \quad \sum_{i=1}^n x_i \cdot \text{Cost}_i \le \text{Budget}, \quad x_i \in \{0, 1\}$$
- **Live Portfolio Stat Box**: Real-time recalculation of Total Cost, Total Risk Reduction, Residual Risk, and ROI as the budget slider moves.

### 7. What-If Scenario Sandbox
- **Real-Time Sliders**: Live adjustments for FIDO2 MFA Adoption (0–100%), EDR Endpoint Coverage (0–100%), and Disaster Recovery RTO (1–72 hours).
- **Interactive Switches**: Instant toggles for Immutable Cloud Backups and Zero-Trust Network Microsegmentation.
- **Comparative Loss Curve**: Visual overlay contrasting baseline risk curves against proposed architecture changes.

### 8. Enterprise Governance, Third-Party Risk & Compliance
- **Vendor Concentration Risk**: Third-party supplier tiering (Tier 1 Critical to Tier 3) with integrated breach history and supply-chain blast radius.
- **Multi-Framework Mapping**: Complete bidirectional traceability to **RBI Cyber Security Framework** and **ISO 27001:2022** controls.
- **Document & Evidence Inspector**: Slide-over drawer providing raw cryptographic hashes, verification logs, and telemetry timestamps for external auditors.
- **Board Dossier & Report Exporter**: PDF-ready executive dossiers with one-click export and board-ready commentary.

---

## 🛠️ Technology Stack

| Layer | Technologies | Key Highlights |
| :--- | :--- | :--- |
| **Frontend UI/UX** | React 19, TypeScript, Vite, TailwindCSS, Lucide Icons | Fraunces Serif + Inter typography, Hairline ledger rows, SVG analytics, Slide-over drawers, Command Palette (`Ctrl+K`) |
| **Backend API** | FastAPI, Pydantic v2, Python 3.12+, Uvicorn | Strict typing, JWT authentication, RBAC, Async SQLite/PostgreSQL, Structured audit logging |
| **Quant & ML** | NumPy, SciPy, Scikit-Learn, PuLP, Joblib | FAIR Framework, Beta-PERT Monte Carlo, Ridge Regression, Random Forest Classifier, Branch-and-Cut MIP Solver |
| **DevOps & QA** | Pytest, Docker, Docker Compose, Oxlint | 100% test pass rate, multi-stage Docker build, zero-warning TypeScript compilation |

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: v18.0+ & `npm`
- **Python**: v3.10+ & `pip`
- **Git**

---

### 1. Repository Setup
```bash
git clone https://github.com/anaskalimi707-blip/cyber-risk-quantification-.git
cd cyber-risk-quantification-

```

---

### 2. Backend Setup & Run

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations and seed enterprise data
python -c "from app.db.init_db import init_db; init_db()"

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
- API Swagger Docs: `http://localhost:8000/docs`
- ReDoc Docs: `http://localhost:8000/redoc`

---

### 3. Frontend Setup & Run

```bash
# In the root directory (or separate terminal):
npm install

# Start Vite dev server
npm run dev
```
- Open browser at: `http://localhost:5173/`

---

### 4. Running Backend Tests

```bash
cd backend
pytest -v
```
*Expected Output: 25 passed tests covering API endpoints, FAIR simulations, PuLP optimization, ML scoring, and RBAC.*

---

## 📊 Quantitative Engine Specifications

### FAIR Monte Carlo Simulation
- **Iterations**: 10,000 runs per scenario.
- **Threat Event Frequency (TEF)**: Poisson distribution parameterized by threat actor capability and historical attempt telemetry.
- **Vulnerability (Vuln)**: Modeled via Beta distribution based on CVSS, EPSS, and control mitigation strength.
- **Loss Magnitude (LM)**: Lognormal / Beta-PERT distribution parameterized by Primary Loss (downtime revenue, replacement costs) + Secondary Loss (regulatory fines, forensics, customer churn).

### PuLP Mixed-Integer Linear Optimizer
- **Objective Function**: Maximize total risk reduction across candidate controls.
- **Constraints**: Total expenditure $\le$ Allocated Security Budget.
- **Default Budget Recommendation**: ₹70 Lakhs budget allocating FIDO2 MFA (₹25L), Immutable Backups (₹35L), and DR Exercise Automation (₹10L) to achieve ₹2.1 Crore risk reduction (ROI 3.0x).

---

## 🔒 Security & Role-Based Access Control (RBAC)

CyberOptix implements role-specific views tailored to organizational responsibilities:
- **Board / Executive**: Aggregated balance sheet figures, trend lines, and investment ROI.
- **CISO**: Strategic risk command center, scenario modeling, what-if sandboxes, and portfolio optimization.
- **CRO / Risk Committee**: Regulatory compliance mapping (RBI/ISO), vendor concentration risks, and risk appetite governance.
- **SecOps / Engineering**: Asset inventories, vulnerability exploitability (EPSS/CVSS), control effectiveness, and raw audit evidence.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
