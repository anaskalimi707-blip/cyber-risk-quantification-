import { 
  RiskScenario, 
  AssetRecord, 
  DefensiveControl, 
  InvestmentOption, 
  ServiceRisk, 
  AttentionItem, 
  ComplianceFrameworkScore 
} from '../types';

export const mockExecutiveMetrics = [
  {
    title: 'Money at risk',
    value: '₹18.4 crore',
    subtext: 'Above tolerance',
    status: 'critical' as const,
    trend: '↑ 8% this month',
    trendPositive: false,
    tooltip: 'Total aggregate value-at-risk (VaR 95%) across all business operations.'
  },
  {
    title: 'Expected yearly loss',
    value: '₹8.6 crore',
    subtext: 'Confidence: High (92%)',
    status: 'warning' as const,
    trend: 'Estimated annualized loss',
    trendPositive: true,
    tooltip: 'The probabilistic mean loss expected over a 12-month period based on FAIR modeling.'
  },
  {
    title: 'High-risk services',
    value: '3',
    subtext: 'Need attention',
    status: 'critical' as const,
    trend: '1 critical breach vector',
    trendPositive: false,
    tooltip: 'Business services where expected downtime and loss exceed board risk appetite.'
  },
  {
    title: 'Risk reduced this quarter',
    value: '₹2.1 crore',
    subtext: 'Trend: ↑ 18%',
    status: 'success' as const,
    trend: 'Verified post-remediation',
    trendPositive: true,
    tooltip: 'Measurable financial loss reduction achieved from newly deployed security controls.'
  },
  {
    title: 'Data quality',
    value: '86%',
    subtext: 'Good veracity',
    status: 'neutral' as const,
    trend: 'Live telemetry active',
    trendPositive: true,
    tooltip: 'Completeness and evidence freshness score across all integrated telemetry sources.'
  }
];

export const mockAttentionItems: AttentionItem[] = [
  {
    id: 'att-1',
    title: 'Ransomware affecting payments',
    lossValue: '₹4.2 crore expected yearly loss',
    riskChange: 'Risk increased 12%',
    actionText: 'Action: Review ₹70 lakh protection plan (FIDO2 MFA + Immutable Backups)',
    actionType: 'risk',
    primaryActionLabel: 'View risk scenario',
    secondaryActionLabel: 'Open optimizer',
    scenarioId: 'scen-ransomware-payment'
  },
  {
    id: 'att-2',
    title: 'Recovery testing gap',
    lossValue: '₹1.1 crore exposure contribution',
    riskChange: 'Payment services have no recent full recovery test',
    actionText: 'Action: Schedule automated sandbox recovery drill',
    actionType: 'gap',
    primaryActionLabel: 'View control gap',
    secondaryActionLabel: 'Create action'
  },
  {
    id: 'att-3',
    title: 'High-risk vendor evidence stale',
    lossValue: '₹82 lakh indirect exposure',
    riskChange: 'Critical supplier security evidence is 45 days outdated',
    actionText: 'Action: Request updated SOC 2 Type II audit report',
    actionType: 'vendor',
    primaryActionLabel: 'Review vendor',
    secondaryActionLabel: 'Send questionnaire'
  }
];

export const mockServicesRisk: ServiceRisk[] = [
  {
    name: 'Payment Processing (UPI & NetBanking)',
    lossAmount: 42000000,
    lossFormatted: '₹4.2 Cr',
    toleranceLimit: 25000000,
    status: 'Above Tolerance',
    criticality: 'Critical'
  },
  {
    name: 'Customer Data & KYC Vault',
    lossAmount: 36000000,
    lossFormatted: '₹3.6 Cr',
    toleranceLimit: 30000000,
    status: 'Above Tolerance',
    criticality: 'Critical'
  },
  {
    name: 'Algorithmic Trading & Settlement',
    lossAmount: 28000000,
    lossFormatted: '₹2.8 Cr',
    toleranceLimit: 20000000,
    status: 'Above Tolerance',
    criticality: 'High'
  },
  {
    name: 'Corporate ERP & Internal IT',
    lossAmount: 12000000,
    lossFormatted: '₹1.2 Cr',
    toleranceLimit: 15000000,
    status: 'Within Tolerance',
    criticality: 'Medium'
  }
];

export const mockRiskScenarios: RiskScenario[] = [
  {
    id: 'scen-ransomware-payment',
    name: 'Ransomware affecting payment processing',
    description: 'Adversary gains initial access via unpatched Internet-facing API Gateway, executes lateral movement via stolen privileged credentials, and encrypts core payment databases.',
    expectedAnnualLoss: 42000000,
    expectedAnnualLossFormatted: '₹4.2 crore',
    p95LossFormatted: '₹13.8 crore',
    probability: 0.21,
    status: 'Above Tolerance',
    confidence: 'High',
    businessService: 'Payment Processing (UPI & NetBanking)',
    threatActor: 'LockBit 3.0 / FIN7 Syndicate',
    topDrivers: [
      'Incomplete privileged MFA (SMS fallback allows interception)',
      'Legacy database backup snapshot lacks write-lock immutability',
      'Internet-facing Payment API Gateway contains CVE-2024-21413'
    ],
    attackPathNodes: [
      { id: '1', name: 'Phishing Email / Initial Access', status: 'Entry Point' },
      { id: '2', name: 'Stolen Admin Credentials', status: 'Exposed' },
      { id: '3', name: 'MFA SMS Fallback Intercepted', status: 'Weak Control', controlWeakness: 'FIDO2 hardware key not enforced' },
      { id: '4', name: 'Privileged Infrastructure Access', status: 'Compromised' },
      { id: '5', name: 'Core Payment Server & DB', status: 'Target Asset' },
      { id: '6', name: 'Database Encryption & Service Outage', status: 'Impact Realized' },
      { id: '7', name: 'Financial Cyber Loss (₹4.2 Cr EAL)', status: 'Business Impact' }
    ],
    lastCalculated: '8 minutes ago'
  },
  {
    id: 'scen-customer-data-breach',
    name: 'Customer KYC & account data exfiltration',
    description: 'Misconfigured cloud storage bucket combined with API authorization flaw leads to bulk exfiltration of customer PII and banking records.',
    expectedAnnualLoss: 36000000,
    expectedAnnualLossFormatted: '₹3.6 crore',
    p95LossFormatted: '₹9.4 crore',
    probability: 0.18,
    status: 'Above Tolerance',
    confidence: 'Medium',
    businessService: 'Customer Data & KYC Vault',
    threatActor: 'External Cybercriminal / Data Broker',
    topDrivers: [
      'S3 object lock not activated on document repository',
      'Lack of automated data masking on API responses'
    ],
    attackPathNodes: [
      { id: '1', name: 'API Token Abuse', status: 'Entry Point' },
      { id: '2', name: 'Direct S3 Object Query', status: 'Vulnerable Path' },
      { id: '3', name: 'Bulk Exfiltration', status: 'Impact Realized' }
    ],
    lastCalculated: '14 minutes ago'
  },
  {
    id: 'scen-privileged-account-takeover',
    name: 'Privileged cloud console compromise',
    description: 'Developer workstation session hijacking results in cloud IAM role escalation and infrastructure tampering.',
    expectedAnnualLoss: 28000000,
    expectedAnnualLossFormatted: '₹2.8 crore',
    p95LossFormatted: '₹7.2 crore',
    probability: 0.14,
    status: 'Above Tolerance',
    confidence: 'High',
    businessService: 'Algorithmic Trading & Settlement',
    threatActor: 'Targeted APT Actor',
    topDrivers: [
      'Over-privileged IAM service roles',
      'Session token persistence beyond 8 hours'
    ],
    attackPathNodes: [
      { id: '1', name: 'Developer Laptop Malware', status: 'Entry Point' },
      { id: '2', name: 'Cloud Admin Console Access', status: 'Compromised' }
    ],
    lastCalculated: '22 minutes ago'
  }
];

export const mockAssets: AssetRecord[] = [
  {
    id: 'asset-1',
    name: 'Payment API-04 (api-gateway-prod-01)',
    businessService: 'Payment Processing',
    criticality: 'Critical',
    riskContributionFormatted: '₹82 lakh',
    riskContributionAmount: 8200000,
    internetExposed: true,
    criticalVulnsCount: 4,
    controlCoveragePct: 62,
    owner: 'Platform Engineering Team',
    lastSeen: '4 minutes ago',
    recommendedAction: 'Apply urgent security patch (CVE-2024-21413) and restrict public CIDR'
  },
  {
    id: 'asset-2',
    name: 'Core Ledger PostgreSQL Cluster',
    businessService: 'Payment Processing',
    criticality: 'Critical',
    riskContributionFormatted: '₹64 lakh',
    riskContributionAmount: 6400000,
    internetExposed: false,
    criticalVulnsCount: 1,
    controlCoveragePct: 88,
    owner: 'Database Reliability Team',
    lastSeen: '1 minute ago',
    recommendedAction: 'Enable immutable storage vault lock and air-gapped sync'
  },
  {
    id: 'asset-3',
    name: 'KYC Verification S3 Bucket Vault',
    businessService: 'Customer Data & KYC',
    criticality: 'Critical',
    riskContributionFormatted: '₹48 lakh',
    riskContributionAmount: 4800000,
    internetExposed: false,
    criticalVulnsCount: 2,
    controlCoveragePct: 74,
    owner: 'Cloud Security Ops',
    lastSeen: '12 minutes ago',
    recommendedAction: 'Enforce KMS envelope encryption with strict VPC endpoint policy'
  },
  {
    id: 'asset-4',
    name: 'Trading Auth Service (Okta SSO App)',
    businessService: 'Algorithmic Trading',
    criticality: 'High',
    riskContributionFormatted: '₹34 lakh',
    riskContributionAmount: 3400000,
    internetExposed: true,
    criticalVulnsCount: 0,
    controlCoveragePct: 92,
    owner: 'Identity & Access Team',
    lastSeen: '2 minutes ago',
    recommendedAction: 'Migrate remaining 15 administrative accounts to FIDO2 hardware keys'
  }
];

export const mockControls: DefensiveControl[] = [
  {
    id: 'ctrl-mfa',
    name: 'Privileged-user Hardware MFA',
    description: 'FIDO2 / WebAuthn passwordless hardware security keys for all cloud and database administrative consoles.',
    category: 'Preventive',
    status: 'Partly Effective',
    coveragePct: 78,
    implementationPct: 85,
    effectivenessScore: 0.64,
    evidenceFreshness: 'Updated 3 hours ago',
    evidenceFreshnessHours: 3,
    potentialRiskReductionFormatted: '₹1.4 crore',
    owner: 'Identity & Access Team',
    relatedScenarios: ['Ransomware affecting payments', 'Privileged account takeover'],
    frameworkRef: 'NIST PR.AC-1 / SEBI-5.2'
  },
  {
    id: 'ctrl-backup',
    name: 'Immutable Air-Gapped Backups',
    description: 'WORM (Write Once Read Many) locked backup repository isolated from active domain credentials.',
    category: 'Recover',
    status: 'Partly Effective',
    coveragePct: 70,
    implementationPct: 80,
    effectivenessScore: 0.55,
    evidenceFreshness: 'Updated 1 day ago',
    evidenceFreshnessHours: 24,
    potentialRiskReductionFormatted: '₹1.1 crore',
    owner: 'Resilience & IT Ops',
    relatedScenarios: ['Ransomware affecting payments'],
    frameworkRef: 'NIST RC.RP-1 / RBI Cyber Framework'
  },
  {
    id: 'ctrl-segmentation',
    name: 'Zero-Trust Microsegmentation',
    description: 'Dynamic eBPF container and VPC network segmentation restricting lateral movement between environments.',
    category: 'Preventive',
    status: 'Effective',
    coveragePct: 88,
    implementationPct: 92,
    effectivenessScore: 0.81,
    evidenceFreshness: 'Updated 6 hours ago',
    evidenceFreshnessHours: 6,
    potentialRiskReductionFormatted: '₹95 lakh',
    owner: 'Network Security Team',
    relatedScenarios: ['Ransomware affecting payments', 'Customer data exfiltration'],
    frameworkRef: 'NIST PR.AC-5 / ISO 27001 A.13.1'
  },
  {
    id: 'ctrl-drills',
    name: 'Automated Recovery Drills',
    description: 'Quarterly continuous automated validation and data recovery execution drills in isolated sandbox environments.',
    category: 'Recover',
    status: 'Failed',
    coveragePct: 45,
    implementationPct: 50,
    effectivenessScore: 0.22,
    evidenceFreshness: 'Evidence expired 32 days ago',
    evidenceFreshnessHours: 768,
    potentialRiskReductionFormatted: '₹60 lakh',
    owner: 'Disaster Recovery Lead',
    relatedScenarios: ['Ransomware affecting payments'],
    frameworkRef: 'SEBI CSCRF Annexure B'
  }
];

export const mockInvestments: InvestmentOption[] = [
  {
    id: 'inv-fido2-mfa',
    name: 'Phishing-resistant FIDO2 Hardware MFA',
    description: 'Hardware tokens for 100% of privileged and database administrator accounts, eliminating SMS & OTP bypass vectors.',
    category: 'Identity & Access',
    initialCost: 2500000,
    initialCostFormatted: '₹25 lakh',
    recurringCostFormatted: '₹3 lakh / yr',
    implementationDays: 60,
    operationalDisruption: 'Low',
    expectedRiskReduction: 14000000,
    expectedRiskReductionFormatted: '₹1.4 crore',
    roiPct: 220,
    affectedControls: ['ctrl-mfa'],
    selectedByDefault: true
  },
  {
    id: 'inv-immutable-backups',
    name: 'Air-Gapped Immutable Backup Vault',
    description: 'Zero-delete write-locked backup repository preventing ransomware encryption and guaranteeing 2-hour RTO.',
    category: 'Data Protection & Recovery',
    initialCost: 3500000,
    initialCostFormatted: '₹35 lakh',
    recurringCostFormatted: '₹5 lakh / yr',
    implementationDays: 90,
    operationalDisruption: 'Low',
    expectedRiskReduction: 11000000,
    expectedRiskReductionFormatted: '₹1.1 crore',
    roiPct: 185,
    affectedControls: ['ctrl-backup'],
    selectedByDefault: true
  },
  {
    id: 'inv-microsegmentation',
    name: 'Zero-Trust Network Microsegmentation',
    description: 'Isolate payment VPC and database clusters to block lateral adversary traversal across subnets.',
    category: 'Network Security',
    initialCost: 7000000,
    initialCostFormatted: '₹70 lakh',
    recurringCostFormatted: '₹8 lakh / yr',
    implementationDays: 180,
    operationalDisruption: 'Medium',
    expectedRiskReduction: 18000000,
    expectedRiskReductionFormatted: '₹1.8 crore',
    roiPct: 157,
    affectedControls: ['ctrl-segmentation'],
    selectedByDefault: false
  },
  {
    id: 'inv-recovery-exercises',
    name: 'Continuous Cyber Recovery Drills',
    description: 'Automated monthly sandbox restore and resilience testing for payment settlement pipelines.',
    category: 'Resilience & Governance',
    initialCost: 1000000,
    initialCostFormatted: '₹10 lakh',
    recurringCostFormatted: '₹2 lakh / yr',
    implementationDays: 30,
    operationalDisruption: 'Low',
    expectedRiskReduction: 6000000,
    expectedRiskReductionFormatted: '₹60 lakh',
    roiPct: 200,
    affectedControls: ['ctrl-drills'],
    selectedByDefault: true
  }
];

export const mockComplianceScores: ComplianceFrameworkScore[] = [
  {
    name: 'NIST CSF 2.0',
    version: '2.0',
    readinessPct: 82,
    status: 'Substantially Compliant',
    highRiskGapsCount: 2,
    functions: [
      { name: 'Govern', score: 85 },
      { name: 'Identify', score: 90 },
      { name: 'Protect', score: 72 },
      { name: 'Detect', score: 80 },
      { name: 'Respond', score: 75 },
      { name: 'Recover', score: 68 }
    ]
  },
  {
    name: 'SEBI CSCRF',
    version: '2024.1',
    readinessPct: 76,
    status: 'Action Required',
    highRiskGapsCount: 3,
    functions: [
      { name: 'Access Control', score: 74 },
      { name: 'API Security', score: 70 },
      { name: 'Resilience & RTO', score: 65 },
      { name: 'Vendor Oversight', score: 80 }
    ]
  },
  {
    name: 'ISO/IEC 27001',
    version: '2022',
    readinessPct: 85,
    status: 'Certified / Audit Ready',
    highRiskGapsCount: 1,
    functions: [
      { name: 'Organizational', score: 88 },
      { name: 'People Controls', score: 82 },
      { name: 'Physical Security', score: 94 },
      { name: 'Technological Controls', score: 78 }
    ]
  }
];
