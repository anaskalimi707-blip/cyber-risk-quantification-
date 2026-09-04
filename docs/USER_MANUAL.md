# CyberOptix Enterprise — Comprehensive User Manual
**Continuous Cyber-Risk Quantification (CRQ), Causal Optimization & Executive Governance Platform**
*Version 2.4 Enterprise Edition • September 2026*

---

## 1. Executive Introduction & Philosophy

### 1.1 The Core Mission
> **"Know your cyber risk in money, understand what is driving it, and invest where every rupee reduces the most risk."**

Traditional cybersecurity reporting relies on qualitative "High/Medium/Low" heatmaps, subjective risk matrices, and compliance tick-boxes that fail to communicate business realities to the Board of Directors, CEO, and CFO. 

**CyberOptix Enterprise** bridges technical telemetry and board-level fiduciary responsibility by:
1. Translating technical threat events, vulnerabilities, and telemetry into exact financial figures (**Expected Annual Loss [EAL]**, **Loss Exceedance Curves**, **Value-at-Risk [VaR 95%]**).
2. Grounding every calculation in immutable, cryptographic evidence hashes from live tools (Qualys, Okta, CrowdStrike, AWS, Azure, GCP).
3. Utilizing **Robinson's Double Machine Learning (DML)** in the **CRIM-X Apex Engine** to eliminate confounding bias and compute isolated causal risk reduction ($\Delta\text{EAL}$).
4. Optimizing capital allocation with Mixed-Integer Linear Programming (PuLP) and 5D Pareto multi-objective frontiers to maximize Return on Security Investment (ROSI).

---

## 2. Platform Architecture & Theoretical Grounding

```
                     +--------------------------------------------+
                     |         Telemetry Connectors Hub          |
                     |  Qualys • Okta • CrowdStrike • AWS • Splunk|
                     +---------------------+----------------------+
                                           |
                   Live Telemetry Stream   | Cryptographic Evidence Hash
                                           v
                     +--------------------------------------------+
                     |    Analytical FAIR & Monte Carlo Engine    |
                     | Loss Frequency (Beta/Pert) × Magnitude    |
                     |        50,000 Vectorized Iterations        |
                     +---------------------+----------------------+
                                           |
                                           v
   +-------------------------------------------------------------------------------+
   |                             CRIM-X Apex Engine                                |
   |  • Layer 0: Deep Foundation Vector Embedding (64-dim)                         |
   |  • Layer 1: Temporal Graph Networks (Dynamic Blast Radius)                   |
   |  • Layer 2: Causal DML Treatment Effects (Orthogonalized $\Delta\text{EAL}$)   |
   |  • Layer 3: Conformal Uncertainty Calibration (Finite-Sample Validity)       |
   |  • Layer 4: Mixture-of-Experts (MoE) Gating Architecture                     |
   |  • Layer 5: Adversarial Red-Team Countermeasure Simulation                   |
   |  • Layer 6: 5D Pareto Frontier Multi-Objective Knapsack Solver               |
   |  • Layer 8: Governance Model Cards & Cryptographic Seals                     |
   +---------------------------------------+---------------------------------------+
                                           |
                                           v
   +-------------------------------------------------------------------------------+
   |                             Enterprise Views                                  |
   |  Overview • Command Center • Scenarios • Optimizer • What-If • Copilot AI     |
   +-------------------------------------------------------------------------------+
```

### 2.1 The FAIR Quantitative Framework
CyberOptix implements the Factor Analysis of Information Risk (FAIR™) ontology:
- **Loss Event Frequency (LEF)**: Frequency with which threat agents act against asset vulnerabilities, modeled via Poisson and Beta-PERT distributions calibrated to Mandiant and CERT-In telemetry.
- **Threat Event Frequency (TEF) & Vulnerability (VULN)**: Dynamically adjusted by continuous control coverage (e.g., MFA adoption, endpoint agent coverage, patch lag).
- **Loss Magnitude (LM)**: Decomposed into 6 distinct financial loss categories:
  1. **Direct Outage & Business Interruption** (Lost gross transaction revenue per hour)
  2. **Incident Response & Digital Forensics** (Specialist retainers and IR hours)
  3. **Regulatory Fines & Penalties** (SEBI CSCRF, RBI, DPDP Act statutory exposure)
  4. **Customer Compensation & Notification** (Breach notification and SLA credits)
  5. **Brand & Reputational Churn** (Projected customer defection over 24 months)
  6. **Ransomware / Extortion Loss** (Demands, negotiation, and recovery fees)

---

## 3. User Roles, Personas & Workspaces

CyberOptix implements Strict Role-Based Access Control (RBAC). Switch active personas via the top-bar role selector or profile dropdown:

| Role Persona | Primary Responsibilities | Recommended Views |
| :--- | :--- | :--- |
| **CISO** | Strategic cyber exposure, capital budgeting, board presentations | Overview, CRIM-X, Command Center, Scenarios, Optimizer, Reports |
| **CFO / CRO** | Loss Value-at-Risk, Insurance underwriting, Capital efficiency | Overview, CRIM-X, Scenarios, Optimizer, Third-Party Risk, Reports |
| **Security Architect** | Attack path mitigation, blast radius reduction, telemetry health | CRIM-X, Command Center, Scenarios, Assets, Controls, What-If, Incidents |
| **Compliance Auditor** | Regulatory audit digests, evidence cryptographic chain integrity | CRIM-X, Compliance, Controls, Vendors, Incidents, Reports, Audit Log |
| **Executive / Board** | Board risk committee overview, capital approval sign-offs | Overview, CRIM-X, Command Center, Optimizer, Reports |
| **SOC Analyst** | Threat intelligence triage, active incident blast radius | Command Center, Scenarios, Assets, Incidents |
| **GRC Analyst** | Framework scoring (NIST, SEBI, ISO), vendor questionnaires | CRIM-X, Compliance, Controls, Vendors, Reports |
| **IT Asset Owner** | Crown jewel SLA monitoring, patching cycle compliance | Assets, Controls, Incidents |
| **Org Admin** | System connectors, role provisioning, tenant appetite limits | All 15 Platform Modules & Settings |

---

## 4. Module-by-Module User Guide

### 4.1 Executive Overview (`/overview`)
- **Hero Metrics**: Instant view of Total Expected Annual Loss (EAL) in ₹ Crore/Lakh, Board Tolerance status (Within Tolerance / Approaching Limit / Above Tolerance), and 95th-Percentile Value-at-Risk (VaR 95%).
- **Top Financial Risk Drivers**: Ranked list of quantified scenarios with monetary exposure and direct drill-downs.
- **Capital Allocation Summary**: Recommended mitigation bundle with projected risk reduction and ROSI multiplier.

### 4.2 CRIM-X Apex Engine (`/crim-x`)
- **5D Pareto Frontier Scatter**: Interactive multi-objective trade-off analysis between:
  1. *Risk Reduction ($\Delta\text{EAL}$ in INR)*
  2. *Total Implementation Capital (INR)*
  3. *Deployment Duration (Days)*
  4. *Regulatory Compliance Boost (% Gain)*
  5. *Operational Disruption Index (1.0 to 10.0)*
- **Preset Portfolios**:
  - `Balanced Frontier`: Optimal trade-off between risk reduction, timeline, and cost.
  - `Max Reduction`: Maximum loss reduction irrespective of budget.
  - `Rapid Sprint`: Controls executable in under 21 days for urgent compliance deadlines.
  - `Budget Minimalist`: Lowest-cost interventions capturing >65% of potential risk reduction.
- **Causal DML vs. Naive Correlation Comparator**:
  - Highlights true causal treatment effects ($\theta$) computed with orthogonalized residuals versus naive observational correlation.
  - Displays Causal Identification Strategies (`natural_experiment`, `instrumental_variable`, `synthetic_control`, `observational_dml`), p-values, and confidence intervals.
- **Budget & SLA Sliders**: Dynamically filter Pareto portfolios by Capital Budget and Implementation SLA.

### 4.3 Risk Command Center (`/command-center`)
- Real-time technical telemetry stream updated continuously.
- **Dynamic Loss Exceedance Curve (LEC)**: Logarithmic curve showing probabilities of exceeding loss thresholds from ₹10 Lakh to ₹50 Crore.
- **Batch Monte Carlo Runner**: Re-runs 50,000 vector iterations across all models simultaneously with live progress feedback.
- **CSV Export**: Downloads complete scenario inventory as RFC 4180-compliant spreadsheet.

### 4.4 Risk Scenarios & Attack Paths (`/scenarios`)
- Detailed breakdown of individual threat scenarios (e.g., *Ransomware on Core Payment Processing Gateway*).
- **Interactive Visual Attack Path**: Node-by-node traversal showing threat actor, entry vector, control friction, pivot points, and impact node.
- **6-Tier Loss Decomposition Chart**: Visual breakdown of financial loss buckets.
- **Control Mitigations**: Direct mapping to active NIST CSF 2.0 defensive controls.

### 4.5 Assets & Exposure (`/assets`)
- Enterprise Crown Jewel asset register categorized by Business Criticality (Tier 1 Mission Critical, Tier 2 Operational, Tier 3 Standard).
- Tracks exposure indicators, active CVSS vulnerabilities, data classification, and owner SLA.
- **Telemetry Scanner Modal**: Real-time scanner connector diagnostics.

### 4.6 Controls Matrix (`/controls`)
- Unified control posture mapped across **NIST CSF 2.0** and **SEBI CSCRF**.
- Implementation status indicators: *Implemented*, *Partially Implemented*, *Planned*, *Non-Compliant*.
- Quantified control strength coefficients ($0.00$ to $1.00$) feeding into FAIR vulnerability algorithms.

### 4.7 Investment Optimizer (`/optimizer`)
- Mixed-Integer Linear Programming (MIP) knapsack solver powered by PuLP.
- Input available budget (₹ Lakh / Crore) and target implementation timeline.
- Recommends optimal control combinations maximizing $\frac{\Delta\text{EAL}}{\text{Cost}}$ while penalizing overlapping control synergies.
- Shows 3-Year Projected Net Financial Benefit and ROSI ratios.

### 4.8 What-If Simulator (`/what-if`)
- Probabilistic counterfactual sandbox.
- Adjust sliders for:
  - *Threat Frequency Multiplier* ($0.2\times$ to $5.0\times$)
  - *Control Efficacy Delta* ($-50\%$ to $+50\%$)
  - *Outage Duration Sensitivity*
- Recomputes new EAL, VaR 95%, and tolerance gap in real time.

### 4.9 Incidents & Operational Resilience (`/incidents`)
- Real-world incident log tracking actual post-mortem financial losses vs. simulated expectations.
- Compares Mean Time to Detect (MTTD) and Mean Time to Recover (MTTR) against board SLAs.

### 4.10 Third-Party Vendor Risk (`/vendors`)
- Tier 1–3 third-party vendor risk register.
- Quantifies concentration risk (e.g., dependency on core cloud providers or payment aggregators).
- Direct link to vendor SOC 2 / ISO 27001 evidence digests.

### 4.11 Compliance & Evidence Vault (`/compliance`)
- Cryptographic evidence items collected automatically from external security APIs.
- Displays collector source, SHA-256 hash, freshness timestamp, and auditor verification status.

### 4.12 Connectors Hub (`/connectors`)
- Native integration connectors for enterprise telemetry:
  - *Qualys VMDR / Tenable*: Vulnerability and exposure telemetry
  - *Okta / Microsoft Entra ID*: Privileged access, MFA enforcement rate
  - *CrowdStrike Falcon*: EDR coverage and endpoint isolation latency
  - *AWS Security Hub / Azure Defender*: Cloud posture and bucket exposure
  - *Splunk / Sentinel*: Active security incident telemetry

### 4.13 Tamper-Evident Audit Log (`/audit-log`)
- SHA-256 chained audit ledger of every privileged action, model recalculation, risk acceptance, and policy sign-off.
- Tamper-evident proof ensures regulatory compliance for SEBI, RBI, and external audit committees.

### 4.14 Reports & Board Briefings (`/reports`)
- Executive board dossiers, CISO posture briefs, and regulatory compliance packages.
- **One-Click PDF Export**: Generates cryptographically sealed, print-ready PDF reports with embedded verification seals.
- **Custom Report Builder**: Drag-and-drop report module compiler.
- **Automated Dispatch Scheduler**: Schedules weekly/monthly delivery to board members and auditors.

### 4.15 Grounded AI Copilot ("Ask CyberOptix AI")
- Accessible via the **"Ask AI"** button in the TopBar or bottom navigation.
- Grounded strictly in the 11-tool backend API contract (`search_risks`, `calculate_risk`, `run_simulation`, `compare_portfolios`, etc.).
- Never hallucinates numbers; provides explicit evidence citations, confidence ratings (High / Medium / Low), and identifies causal DML estimation strategies.
- Enforces strict human approval boundaries on financial decisions.

---

## 5. Navigation & Productivity Features

### 5.1 Global Command Palette (`Ctrl + K` / `Cmd + K`)
- Press `Ctrl + K` anywhere on the platform to instantly open the search palette.
- Search across risk scenarios, assets, controls, evidence items, reports, and actions.

### 5.2 Responsive Mobile View
- **Bottom Navigation Bar**: Instant thumb navigation between Overview, CRIM-X, Scenarios, Optimizer, and Copilot.
- **Slide-Over Mobile Drawer**: Tap the hamburger icon to access the complete list of 15 modules and persona switcher.

### 5.3 Deep Obsidian Dark Theme
- Toggle between the Editorial Light Ledger theme and the Deep Obsidian Dark Theme via the Sun/Moon button in the TopBar or mobile drawer.
- Theme preferences persist automatically across sessions via `localStorage`.

---

## 6. Regulatory Mapping & Compliance Standards

CyberOptix natively complies with and maps findings to major financial and cyber governance frameworks:

1. **SEBI Cyber Security and Cyber Resilience Framework (CSCRF)**: Continuous telemetry monitoring, board-level reporting, and third-party risk concentration limits.
2. **NIST CSF 2.0**: Full coverage across GOVERN, IDENTIFY, PROTECT, DETECT, RESPOND, and RECOVER functions.
3. **RBI Cyber Security Framework for Banks**: Stress-testing financial loss limits and air-gapped backup recovery validation.
4. **Digital Personal Data Protection Act (DPDP 2023)**: Statutory penalty exposure modeling for customer KYC and identity breach scenarios.
5. **ISO/IEC 27001:2022**: Cryptographic evidence chaining and controls audit traceability.

---

## 7. Support & Troubleshooting

- **API Documentation**: Interactive OpenAPI Swagger documentation is available at `http://localhost:8000/docs`.
- **System Health Check**: Verify live backend connectivity at `http://localhost:8000/health`.
- **Readiness Probe**: Check engine status at `http://localhost:8000/ready`.
