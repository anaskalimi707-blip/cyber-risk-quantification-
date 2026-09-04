export type UserRole = 
  | 'Executive'
  | 'CFO'
  | 'CISO'
  | 'SOC Analyst'
  | 'GRC Analyst'
  | 'IT Owner'
  | 'Auditor'
  | 'Org Admin';

export type NavigationPage = 
  | 'overview'
  | 'command-center'
  | 'scenarios'
  | 'assets'
  | 'controls'
  | 'optimizer'
  | 'what-if'
  | 'compliance'
  | 'incidents'
  | 'vendors'
  | 'reports'
  | 'settings';

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
