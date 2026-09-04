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
  attackPathNodes: { id: string; name: string; status: string; controlWeakness?: string }[];
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
