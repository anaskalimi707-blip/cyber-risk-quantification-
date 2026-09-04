import React, { createContext, useContext, useState, useEffect } from 'react';
import { RiskScenario, RiskTreatmentRecord, AuditEventRecord, RiskDecisionAction, UserRole } from '../types';
import { mockRiskScenarios } from '../data/mockData';

interface RiskDecisionContextType {
  scenarios: RiskScenario[];
  treatments: Record<string, RiskTreatmentRecord>;
  auditEvents: AuditEventRecord[];
  totalExposureInr: number;
  totalExposureFormatted: string;
  totalEalInr: number;
  totalEalFormatted: string;
  totalRiskReducedInr: number;
  totalRiskReducedFormatted: string;
  riskAppetiteInr: number;
  riskAppetiteFormatted: string;
  isAboveAppetite: boolean;
  appetiteExceededByInr: number;
  appetiteExceededByFormatted: string;
  executeDecision: (params: {
    scenarioId: string;
    action: RiskDecisionAction;
    actor: string;
    role: UserRole;
    rationale: string;
    selectedControlId?: string;
    selectedControlName?: string;
    insurancePolicyRef?: string;
    acceptanceExpiryDate?: string;
  }) => RiskTreatmentRecord;
  resetAllDecisions: () => void;
}

const BASELINE_APPETITE_INR = 100000000; // ₹10.0 Crore
const BASELINE_EXPOSURE_INR = 184000000; // ₹18.4 Crore
const BASELINE_EAL_INR = 86000000;       // ₹8.6 Crore

export const INITIAL_AUDIT_EVENTS: AuditEventRecord[] = [
  {
    id: 'aud-init-001',
    timestamp: '2026-09-04 14:15:22 IST',
    actor: 'Sarah Chen',
    role: 'CISO',
    action: 'Risk Appetite Threshold Calibrated',
    object: 'Board Governance Policy / FinRisk-2026',
    previousState: '₹12.0 Crore Limit',
    newState: '₹10.0 Crore Limit (Board Approved)',
    rationale: 'Calibrated under RBI Master Direction & SEBI CSCRF guidelines for core settlement systems.',
    riskImpact: 'Appetite ceiling tightened by ₹2.0 Crore',
    decisionHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
  },
  {
    id: 'aud-init-002',
    timestamp: '2026-09-04 11:30:10 IST',
    actor: 'Marcus Vance',
    role: 'SecurityArchitect',
    action: 'CVE Remediated via Microsegmentation',
    object: 'Payment API-04 (api-gateway-prod-01)',
    previousState: 'Public Ingress Port 445 Allowed',
    newState: 'Zero-Trust eBPF Perimeter Enforced',
    rationale: 'Immediate mitigation for CVE-2024-21413 pending vendor patch release.',
    riskImpact: 'Reduced API gateway blast radius by 45%',
    decisionHash: 'sha256:1a8b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9012'
  },
  {
    id: 'aud-init-003',
    timestamp: '2026-09-03 16:45:00 IST',
    actor: 'Elena Rostova',
    role: 'Auditor',
    action: 'Cryptographic Evidence Seal Verified',
    object: 'Okta Identity Provider Telemetry Stream',
    previousState: 'Unverified Logs',
    newState: 'Cryptographically Verified (SHA-256 Digest)',
    rationale: 'Quarterly compliance audit trail verification against NIST CSF 2.0 PR.AC-1 controls.',
    riskImpact: 'Telemetry veracity confirmed at 94% confidence',
    decisionHash: 'sha256:8f2a931ce719b456d20394857102938475610293847561029384756102938475'
  }
];

const RiskDecisionContext = createContext<RiskDecisionContextType | undefined>(undefined);

export const RiskDecisionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scenarios, setScenarios] = useState<RiskScenario[]>(mockRiskScenarios);
  
  // Stored treatments from localStorage
  const [treatments, setTreatments] = useState<Record<string, RiskTreatmentRecord>>(() => {
    try {
      const saved = localStorage.getItem('cyberoptix_risk_treatments');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Stored audit events from localStorage
  const [auditEvents, setAuditEvents] = useState<AuditEventRecord[]>(() => {
    try {
      const saved = localStorage.getItem('cyberoptix_audit_events');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_EVENTS;
    } catch {
      return INITIAL_AUDIT_EVENTS;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('cyberoptix_risk_treatments', JSON.stringify(treatments));
  }, [treatments]);

  useEffect(() => {
    localStorage.setItem('cyberoptix_audit_events', JSON.stringify(auditEvents));
  }, [auditEvents]);

  // Compute dynamic financial exposures based on executed treatments
  let totalRiskReducedInr = 0;
  let totalEalReductionInr = 0;

  Object.values(treatments).forEach(t => {
    totalRiskReducedInr += t.riskReductionInr;
    totalEalReductionInr += (t.originalEalInr - t.residualEalInr);
  });

  const totalExposureInr = Math.max(20000000, BASELINE_EXPOSURE_INR - totalRiskReducedInr);
  const totalEalInr = Math.max(10000000, BASELINE_EAL_INR - totalEalReductionInr);
  const isAboveAppetite = totalExposureInr > BASELINE_APPETITE_INR;
  const appetiteExceededByInr = Math.max(0, totalExposureInr - BASELINE_APPETITE_INR);

  const formatInrCr = (val: number) => `₹${(val / 10000000).toFixed(1)} Cr`;

  const executeDecision = (params: {
    scenarioId: string;
    action: RiskDecisionAction;
    actor: string;
    role: UserRole;
    rationale: string;
    selectedControlId?: string;
    selectedControlName?: string;
    insurancePolicyRef?: string;
    acceptanceExpiryDate?: string;
  }): RiskTreatmentRecord => {
    const targetScen = scenarios.find(s => s.id === params.scenarioId) || scenarios[0];
    const origEal = targetScen.expectedAnnualLoss;

    let residualEal = origEal;
    let riskReducedInr = 0;
    let statusLabel = targetScen.status;

    if (params.action === 'TREAT') {
      // Treating with a control reduces EAL significantly (e.g. 50% - 65%)
      riskReducedInr = Math.round(origEal * 0.60);
      residualEal = origEal - riskReducedInr;
      statusLabel = 'Within Tolerance';
    } else if (params.action === 'TRANSFER') {
      // Cyber insurance transfers tail risk (reduces net corporate exposure by 45%)
      riskReducedInr = Math.round(origEal * 0.45);
      residualEal = origEal - riskReducedInr;
      statusLabel = 'Within Tolerance';
    } else if (params.action === 'ACCEPT') {
      // Formally accepted by executive authority
      riskReducedInr = 0;
      residualEal = origEal;
      statusLabel = 'Approaching Limit';
    }

    const decisionRecordId = `dec-${Date.now()}`;
    const timestampStr = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }) + ' IST';

    // Cryptographic simulated SHA-256 decision hash
    const rawDecisionString = `${decisionRecordId}|${params.scenarioId}|${params.action}|${params.actor}|${params.role}|${timestampStr}`;
    const decisionHash = `sha256:${Array.from(rawDecisionString).reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0) | 0, 0).toString(16).padStart(8, '0')}7b91d2c0e81f4a9b2d8e4f1a6c3b8e0d`;

    const newTreatment: RiskTreatmentRecord = {
      id: decisionRecordId,
      scenarioId: params.scenarioId,
      scenarioName: targetScen.name,
      action: params.action,
      actor: params.actor,
      role: params.role,
      timestamp: timestampStr,
      rationale: params.rationale,
      selectedControlId: params.selectedControlId,
      selectedControlName: params.selectedControlName,
      insurancePolicyRef: params.insurancePolicyRef,
      acceptanceExpiryDate: params.acceptanceExpiryDate,
      originalEalInr: origEal,
      residualEalInr: residualEal,
      residualEalFormatted: formatInrCr(residualEal),
      riskReductionInr: riskReducedInr,
      riskReductionFormatted: formatInrCr(riskReducedInr),
      decisionHash
    };

    // Update treatments mapping
    setTreatments(prev => ({
      ...prev,
      [params.scenarioId]: newTreatment
    }));

    // Update scenario status
    setScenarios(prev => prev.map(s => {
      if (s.id === params.scenarioId) {
        return {
          ...s,
          status: statusLabel,
          expectedAnnualLoss: residualEal,
          expectedAnnualLossFormatted: formatInrCr(residualEal),
          lastCalculated: 'Just now (Post-Decision)'
        };
      }
      return s;
    }));

    // Append to immutable audit log
    const auditEvent: AuditEventRecord = {
      id: `aud-${Date.now()}`,
      timestamp: timestampStr,
      actor: params.actor,
      role: params.role,
      action: `Risk Scenario ${params.action} Decision Executed`,
      object: targetScen.name,
      previousState: `Active Risk Exposure (${targetScen.expectedAnnualLossFormatted} EAL)`,
      newState: params.action === 'TREAT' 
        ? `Treated via ${params.selectedControlName || 'Targeted Security Control'} (Residual: ${formatInrCr(residualEal)})`
        : params.action === 'TRANSFER'
        ? `Transferred via Cyber Insurance (${params.insurancePolicyRef || 'Policy Underwritten'})`
        : `Accepted Risk under Executive Rationale (Expires: ${params.acceptanceExpiryDate || '12 Months'})`,
      rationale: params.rationale,
      riskImpact: riskReducedInr > 0 ? `Net Financial Loss Reduced by ${formatInrCr(riskReducedInr)}/yr` : 'Formal Risk Ownership Assumed',
      decisionHash
    };

    setAuditEvents(prev => [auditEvent, ...prev]);

    return newTreatment;
  };

  const resetAllDecisions = () => {
    setTreatments({});
    setAuditEvents(INITIAL_AUDIT_EVENTS);
    setScenarios(mockRiskScenarios);
    localStorage.removeItem('cyberoptix_risk_treatments');
    localStorage.removeItem('cyberoptix_audit_events');
  };

  return (
    <RiskDecisionContext.Provider
      value={{
        scenarios,
        treatments,
        auditEvents,
        totalExposureInr,
        totalExposureFormatted: formatInrCr(totalExposureInr),
        totalEalInr,
        totalEalFormatted: formatInrCr(totalEalInr),
        totalRiskReducedInr,
        totalRiskReducedFormatted: formatInrCr(totalRiskReducedInr),
        riskAppetiteInr: BASELINE_APPETITE_INR,
        riskAppetiteFormatted: formatInrCr(BASELINE_APPETITE_INR),
        isAboveAppetite,
        appetiteExceededByInr,
        appetiteExceededByFormatted: formatInrCr(appetiteExceededByInr),
        executeDecision,
        resetAllDecisions
      }}
    >
      {children}
    </RiskDecisionContext.Provider>
  );
};

export const useRiskDecision = () => {
  const context = useContext(RiskDecisionContext);
  if (!context) {
    throw new Error('useRiskDecision must be used within a RiskDecisionProvider');
  }
  return context;
};
