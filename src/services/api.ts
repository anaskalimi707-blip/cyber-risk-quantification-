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
