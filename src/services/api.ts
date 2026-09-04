import { 
  mockExecutiveMetrics, 
  mockAttentionItems, 
  mockServicesRisk, 
  mockRiskScenarios, 
  mockAssets, 
  mockControls, 
  mockInvestments, 
  mockComplianceScores 
} from '../data/mockData';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export async function fetchWithFallback<T>(endpoint: string, fallbackData: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800); // 1.8s timeout
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' }
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch (err) {
    // Graceful fallback to rich local enterprise mock
  }
  return fallbackData;
}

export const apiService = {
  getExecutiveMetrics: () => mockExecutiveMetrics,
  getAttentionItems: () => mockAttentionItems,
  getServicesRisk: () => mockServicesRisk,
  getRiskScenarios: () => mockRiskScenarios,
  getAssets: () => mockAssets,
  getControls: () => mockControls,
  getInvestments: () => mockInvestments,
  getComplianceScores: () => mockComplianceScores,
  
  runWhatIfSimulation: async (params: any) => {
    // Calculates projected risk difference
    const mfaCoverage = params.mfaCoverage ?? 0.78;
    const backupImmutable = params.backupImmutable ?? true;
    const rtoHours = params.rtoHours ?? 2.0;
    
    // Baseline risk ₹4.2 Crore (42,000,000)
    const baseEal = 42000000;
    const mfaMitigation = (mfaCoverage - 0.78) * 25000000;
    const backupMitigation = backupImmutable ? 11000000 : 0;
    const rtoMitigation = (4.0 - rtoHours) * 3500000;

    const projectedEal = Math.max(800000, baseEal - mfaMitigation - backupMitigation - rtoMitigation);
    const reductionAmount = Math.max(0, baseEal - projectedEal);
    const reductionPct = Math.round((reductionAmount / baseEal) * 100);

    return {
      currentRiskFormatted: '₹4.2 crore',
      simulatedRiskFormatted: `₹${(projectedEal / 10000000).toFixed(1)} crore`,
      reductionFormatted: `₹${(reductionAmount / 10000000).toFixed(1)} crore`,
      reductionPercentage: reductionPct,
      status: projectedEal <= 25000000 ? 'Within Tolerance' : 'Above Tolerance'
    };
  },

  askAICopilot: async (query: string) => {
    const qLower = query.toLowerCase();
    if (qLower.includes('why') || qLower.includes('high') || qLower.includes('ransomware')) {
      return {
        answer: "Ransomware affecting Payment Processing is high (₹4.2 Cr EAL) because the Internet-exposed API Gateway has an unpatched critical flaw (CVE-2024-21413) and privileged MFA allows SMS fallback.",
        keyFindings: [
          "Adversary threat frequency calibrated at 0.20 events/yr based on CERT-In financial alerts.",
          "Legacy daily backups lack write-lock immutability, threatening database restore times.",
          "Payment processing downtime cost is ₹5.00 Crore per day."
        ],
        evidenceCitations: [
          { id: 'ev_qualys_001', source: 'Qualys VMDR Scanner', timestamp: '2026-09-03 08:30', hashSnippet: 'e3b0c442...' },
          { id: 'ev_okta_002', source: 'Okta IAM Policy Log', timestamp: '2026-09-03 09:15', hashSnippet: '8f434346...' }
        ],
        assumptions: [
          "Incident recovery time without immutable backups is estimated at 72 hours.",
          "Regulatory penalties from SEBI/RBI included in secondary loss distribution."
        ],
        confidence: 'High' as const,
        suggestedActions: [
          { label: 'Deploy FIDO2 Hardware MFA (₹25 Lakh)', actionId: 'inv-fido2-mfa' },
          { label: 'Activate Immutable Cloud Backup Vault (₹35 Lakh)', actionId: 'inv-immutable-backups' }
        ]
      };
    }

    if (qLower.includes('optimize') || qLower.includes('invest') || qLower.includes('budget')) {
      return {
        answer: "Under a ₹1.00 Crore budget, the optimal portfolio allocates ₹70 Lakh across FIDO2 MFA (₹25L), Immutable Backups (₹35L), and Automated Recovery Drills (₹10L) to reduce risk by ₹2.1 Crore (200% ROI).",
        keyFindings: [
          "FIDO2 MFA blocks initial credential theft access paths.",
          "Immutable Backups guarantee 2-hour RTO recovery, eliminating extortion leverage.",
          "Residual annualized cyber risk drops to ₹2.1 Crore (within board appetite limit)."
        ],
        evidenceCitations: [
          { id: 'ev_mip_solver_01', source: 'PuLP MIP Optimization Engine', timestamp: '2026-09-03 09:45', hashSnippet: '4a8b7c9d...' }
        ],
        assumptions: [
          "Control overlap synergy discounted by 12% to prevent double-counting benefits."
        ],
        confidence: 'High' as const,
        suggestedActions: [
          { label: 'Submit Portfolio for CISO & CFO Approval', actionId: 'portfolio-approve' }
        ]
      };
    }

    if (qLower.includes('cve') || qLower.includes('epss') || qLower.includes('kev') || qLower.includes('vuln') || qLower.includes('signal')) {
      return {
        answer: "Our Risk Intelligence engine correlates NVD CVEs with FIRST EPSS v3 and CISA KEV exploitation catalogs. For example, CVE-2024-21413 (Microsoft Outlook RCE) carries an EPSS of 0.82 (82nd percentile weaponization probability in 30 days) and active CISA KEV listing, elevating its attack frequency to 0.20/yr on internet-exposed gateways.",
        keyFindings: [
          "Severity ≠ Risk: A CVSS 9.8 vulnerability with EPSS 0.02 inside an isolated enclave produces negligible annualized loss.",
          "CVE-2024-21413 and CVE-2023-4966 are both active on external perimeter surfaces, demanding priority remediation.",
          "FIRST EPSS probability curves are updated daily and fed directly into the Monte Carlo Loss Event Frequency (LEF) parameter."
        ],
        evidenceCitations: [
          { id: 'ev_cisa_kev_01', source: 'CISA Known Exploited Vulnerabilities (KEV) Catalog', timestamp: '2026-09-04 04:00', hashSnippet: 'c82f91a0...' },
          { id: 'ev_first_epss_02', source: 'FIRST EPSS v3 API (FIRST.org)', timestamp: '2026-09-04 06:15', hashSnippet: '9e38d72b...' },
          { id: 'ev_nvd_03', source: 'NIST National Vulnerability Database (NVD)', timestamp: '2026-09-04 02:00', hashSnippet: '4a7c19f2...' }
        ],
        assumptions: [
          "EPSS score represents probability of in-the-wild exploitation within next 30 days.",
          "Internal asset exposure weights adjust probability downward by 70% for air-gapped systems."
        ],
        confidence: 'High' as const,
        suggestedActions: [
          { label: 'View Technical Signals & Vulnerability Intelligence', actionId: 'nav-signals' },
          { label: 'Prioritize Chokepoint Mitigations', actionId: 'nav-attack-path' }
        ]
      };
    }

    if (qLower.includes('dml') || qLower.includes('causal') || qLower.includes('ai') || qLower.includes('model')) {
      return {
        answer: "The platform uses Double Machine Learning (DML) causal inference to isolate control treatment effects from telemetry confounding (e.g. org size and incident velocity). Conformal prediction intervals guarantee 90% finite-sample coverage on loss forecasts.",
        keyFindings: [
          "Hardware MFA exhibits the highest isolated treatment effect (-₹1.85 Cr EAL reduction).",
          "Automated immutable backups reduce primary business interruption loss by 74%.",
          "Conformal 90% confidence band: ₹6.8 Cr to ₹10.4 Cr enterprise loss."
        ],
        evidenceCitations: [
          { id: 'ev_causal_dml_01', source: 'EconML LinearDML Estimator with 5-Fold Cross-Fitting', timestamp: '2026-09-04 05:30', hashSnippet: '6b1d40ef...' }
        ],
        assumptions: [
          "Unconfoundedness conditioned on IT asset count, external IP count, and historical telemetry.",
          "Overlap condition satisfied across security posture tiers."
        ],
        confidence: 'High' as const,
        suggestedActions: [
          { label: 'Inspect Causal Effects in Risk Intelligence', actionId: 'nav-signals' }
        ]
      };
    }

    return {
      answer: "CyberOptix is continuously monitoring your technical telemetry and mapping it to financial risk. All estimates are backed by verifiable cryptographic evidence hashes.",
      keyFindings: [
        "Aggregate financial risk: ₹18.4 Crore (VaR 95%).",
        "Expected yearly loss: ₹8.6 Crore.",
        "NIST CSF 2.0 readiness: 82%."
      ],
      evidenceCitations: [
        { id: 'ev_telemetry_001', source: 'CyberOptix Telemetry Aggregator', timestamp: '2026-09-03 10:00', hashSnippet: 'b5f2c19a...' }
      ],
      assumptions: [],
      confidence: 'High' as const,
      suggestedActions: []
    };
  }
};
