export type UserRole = 
  | 'CISO'
  | 'CFO'
  | 'SecurityArchitect'
  | 'Auditor'
  | 'Executive'
  | 'SOC Analyst'
  | 'GRC Analyst'
  | 'IT Owner'
  | 'Org Admin';

export type NavigationPage = 
  | 'overview'
  | 'crim-x'
  | 'command-center'
  | 'scenarios'
  | 'assets'
  | 'controls'
  | 'optimizer'
  | 'what-if'
  | 'compliance'
  | 'connectors'
  | 'audit-log'
  | 'incidents'
  | 'vendors'
  | 'reports'
  | 'settings';

export interface CrimXCausalEffect {
  control_id: string;
  name: string;
  category: string;
  cost_inr: number;
  implementation_days: number;
  compliance_boost_pct: number;
  disruption_index: number;
  naive_correlational_risk_reduction_inr: number;
  causal_effect_theta_inr: number;
  causal_identification_strategy: 'natural_experiment' | 'instrumental_variable' | 'synthetic_control' | 'observational_dml';
  causal_confidence_score: number;
  p_value: number;
  instrument_name?: string;
}

export interface CrimXParetoPortfolio {
  portfolio_id: string;
  name: string;
  tag: 'balanced' | 'max_reduction' | 'rapid_sprint' | 'budget_minimalist' | 'custom';
  selected_control_ids: string[];
  selected_control_names: string[];
  total_cost_inr: number;
  causal_risk_reduction_inr: number;
  net_financial_benefit_inr: number;
  rosi_ratio: number;
  total_implementation_days: number;
  compliance_score_gain_pct: number;
  avg_disruption_index: number;
}


export type ToleranceStatus = 'Within Tolerance' | 'Approaching Limit' | 'Above Tolerance';
export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface TopMetric {
  title: string;
  value: string;
  subtext: string;
  status: 'critical' | 'warning' | 'success' | 'neutral';
  trend?: string;
  trendPositive?: boolean;
  tooltip: string;
}

export interface AttentionItem {
  id: string;
  title: string;
  lossValue: string;
  riskChange: string;
  actionText: string;
  actionType: 'risk' | 'gap' | 'vendor';
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  scenarioId?: string;
}

export interface ServiceRisk {
  name: string;
  lossAmount: number;
  lossFormatted: string;
  toleranceLimit: number;
  status: ToleranceStatus;
  criticality: 'Critical' | 'High' | 'Medium';
}

export interface RiskScenario {
  id: string;
  name: string;
  description: string;
  expectedAnnualLoss: number;
  expectedAnnualLossFormatted: string;
  p95LossFormatted: string;
  probability: number;
  status: ToleranceStatus;
  confidence: 'High' | 'Medium' | 'Low';
  businessService: string;
  threatActor: string;
  topDrivers: string[];
  attackPathNodes: {
    id: string;
    name?: string;
    stepNumber?: number;
    techniqueId?: string;
    techniqueName?: string;
    tactic?: string;
    description?: string;
    status: string;
    affectedAsset?: string;
    controlWeakness?: string;
    mitreUrl?: string;
  }[];
  lastCalculated: string;
}

export interface AssetRecord {
  id: string;
  name: string;
  businessService: string;
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  riskContributionFormatted: string;
  riskContributionAmount: number;
  internetExposed: boolean;
  criticalVulnsCount: number;
  controlCoveragePct: number;
  owner: string;
  lastSeen: string;
  recommendedAction: string;
}

export interface DefensiveControl {
  id: string;
  name: string;
  description: string;
  category: 'Preventive' | 'Detective' | 'Responsive' | 'Recover';
  status: 'Effective' | 'Partly Effective' | 'Failed' | 'Not Assessed';
  coveragePct: number;
  implementationPct: number;
  effectivenessScore: number;
  evidenceFreshness: string;
  evidenceFreshnessHours: number;
  potentialRiskReductionFormatted: string;
  owner: string;
  relatedScenarios: string[];
  frameworkRef: string;
}

export interface InvestmentOption {
  id: string;
  name: string;
  description: string;
  category: string;
  initialCost: number;
  initialCostFormatted: string;
  recurringCostFormatted: string;
  implementationDays: number;
  operationalDisruption: 'Low' | 'Medium' | 'High';
  expectedRiskReduction: number;
  expectedRiskReductionFormatted: string;
  roiPct: number;
  affectedControls: string[];
  selectedByDefault?: boolean;
}

export interface ComplianceFrameworkScore {
  name: string;
  version: string;
  readinessPct: number;
  status: string;
  highRiskGapsCount: number;
  functions: { name: string; score: number }[];
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  keyFindings?: string[];
  evidenceCitations?: { id: string; source: string; timestamp: string; hashSnippet: string }[];
  assumptions?: string[];
  confidence?: 'High' | 'Medium' | 'Low';
  suggestedActions?: { label: string; actionId: string }[];
  requiresApproval?: boolean;
}

// ─── Normalized Public Cyber Intelligence & Domain Models ───────────────────

export type DataSourceStatus = 'LIVE' | 'CACHED' | 'STALE' | 'UNAVAILABLE';

export interface ProvenanceMetadata {
  source: 'NVD/NIST' | 'FIRST.org EPSS' | 'CISA KEV' | 'MITRE ATT&CK' | 'CrowdStrike Falcon' | 'Qualys VMDR' | 'Okta IAM' | 'AWS Security Hub' | 'Synthetic Model';
  sourceId: string;
  retrievedAt: string;
  updatedAt?: string;
  confidence: 'High' | 'Medium' | 'Low';
  status: DataSourceStatus;
  hash: string;
}

export interface VulnerabilityRecord {
  id: string;
  cve: string;
  title: string;
  description: string;
  cvss: number;
  cvssVector: string;
  cvssSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  epss: number; // 0.00 to 1.00
  epssPercentile: number; // e.g. 96.4th percentile
  epssVelocity30d?: number; // e.g. +0.14
  kevListed: boolean;
  kevDueDate?: string;
  ransomwareCampaignUse: boolean;
  affectedProducts: string[];
  affectedAssetId?: string;
  affectedAssetName?: string;
  affectedServiceName?: string;
  isInternetExposed: boolean;
  remediationUrgency: 'Immediate (24h)' | 'High (7d)' | 'Standard (30d)';
  remediationAction: string;
  provenance: ProvenanceMetadata;
}

export interface ThreatSignalRecord {
  id: string;
  actor: string;
  campaign: string;
  tactic: string;
  techniqueId: string;
  techniqueName: string;
  activeExploitation: boolean;
  targetedSectors: string[];
  firstObserved: string;
  lastSeen: string;
  confidence: 'High' | 'Medium' | 'Low';
  relatedCves: string[];
  provenance: ProvenanceMetadata;
}

export interface MitreAttackStep {
  id: string;
  stepNumber: number;
  techniqueId: string;
  techniqueName: string;
  tactic: string;
  description: string;
  status: 'Entry Point' | 'Exposed' | 'Weak Control' | 'Compromised' | 'Target Asset' | 'Impact Realized' | 'Business Impact';
  affectedAsset: string;
  controlWeakness?: string;
  chokepointControl?: string;
  chokepointControlId?: string;
  ealReductionInr?: number;
  ealReductionFormatted?: string;
  mitreUrl: string;
}

export type RiskDecisionAction = 'TREAT' | 'TRANSFER' | 'ACCEPT';

export interface RiskTreatmentRecord {
  id: string;
  scenarioId: string;
  scenarioName: string;
  action: RiskDecisionAction;
  actor: string;
  role: UserRole;
  timestamp: string;
  rationale: string;
  selectedControlId?: string;
  selectedControlName?: string;
  insurancePolicyRef?: string;
  acceptanceExpiryDate?: string;
  originalEalInr: number;
  residualEalInr: number;
  residualEalFormatted: string;
  riskReductionInr: number;
  riskReductionFormatted: string;
  decisionHash: string;
}

export interface AuditEventRecord {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  object: string;
  previousState: string;
  newState: string;
  rationale: string;
  riskImpact: string;
  decisionHash: string;
}

