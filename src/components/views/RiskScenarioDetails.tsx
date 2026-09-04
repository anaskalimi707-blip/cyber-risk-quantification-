import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { mockRiskScenarios } from '../../data/mockData';
import { useRiskDecision } from '../../context/RiskDecisionContext';
import { intelligenceService } from '../../services/intelligenceService';
import { ShieldCheck, ShieldAlert, ArrowLeft, CheckCircle2, FileSignature, AlertOctagon, Layers, Sliders, Scale, Check, ExternalLink, Hash } from 'lucide-react';
import { InsuranceQuoteModal } from '../modals/InsuranceQuoteModal';
import { RiskAcceptanceModal } from '../modals/RiskAcceptanceModal';
import { AttackStepDetailsModal } from '../modals/AttackStepDetailsModal';

interface RiskScenarioDetailsProps {
  scenarioId: string;
  onNavigate: (page: NavigationPage) => void;
  onBack: () => void;
  onInspectEvidence: (evidence: any) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, description: string) => void;
}

export const RiskScenarioDetails: React.FC<RiskScenarioDetailsProps> = ({
  scenarioId,
  onNavigate,
  onBack,
  onInspectEvidence,
  onShowToast
}) => {
  const { scenarios, treatments, executeDecision } = useRiskDecision();
  const scenario = scenarios.find(s => s.id === scenarioId) || mockRiskScenarios.find(s => s.id === scenarioId) || mockRiskScenarios[0];
  const treatment = treatments[scenario.id];

  const [activeTab, setActiveTab] = useState<'overview' | 'attack-path' | 'financial' | 'decomposition' | 'evidence' | 'actions'>('overview');
  const [selectedAttackNode, setSelectedAttackNode] = useState<string>('3');
  const [decisionState, setDecisionState] = useState<'TREAT' | 'TRANSFER' | 'ACCEPT' | null>(null);
  const [distributionType, setDistributionType] = useState<'lognormal' | 'beta_pert' | 'weibull'>('lognormal');
  const [iterations, setIterations] = useState<number>(10000);

  // Modals state
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState<boolean>(false);
  const [isAcceptanceModalOpen, setIsAcceptanceModalOpen] = useState<boolean>(false);
  const [inspectedAttackNode, setInspectedAttackNode] = useState<{ id: string; name: string; status: string; controlWeakness?: string } | null>(null);

  // 6-Tier Financial Loss Decomposition Data
  const lossTiers = [
    { tier: 'Direct Business Interruption & Revenue Halt', pct: 38, amount: '₹1.59 Crore', p95: '₹5.24 Crore', icon: '⏱️', desc: 'Real-time payment transaction halting & merchant revenue SLA penalties' },
    { tier: 'Ransomware Extortion & Asset Recovery', pct: 24, amount: '₹1.01 Crore', p95: '₹3.31 Crore', icon: '🔐', desc: 'Decryptor negotiations, digital asset restoration & rebuild labor' },
    { tier: 'Incident Response, Digital Forensics & Legal', pct: 14, amount: '₹58.8 Lakh', p95: '₹1.93 Crore', icon: '🔍', desc: 'Retained breach counsel, external CIRT incident response & log triage' },
    { tier: 'Regulatory Penalties (DPDP, GDPR, SEC, RBI)', pct: 11, amount: '₹46.2 Lakh', p95: '₹1.52 Crore', icon: '⚖️', desc: 'Statutory compliance fines & mandatory supervisory audit costs' },
    { tier: 'Third-Party Liability & Customer Redress', pct: 8, amount: '₹33.6 Lakh', p95: '₹1.10 Crore', icon: '🤝', desc: 'Partner merchant indemnification and customer compensation claims' },
    { tier: 'Reputational Damage & Customer Churn', pct: 5, amount: '₹21.0 Lakh', p95: '₹69.0 Lakh', icon: '📉', desc: 'Enterprise churn & new customer acquisition conversion degradation' },
  ];

  // Statutory Regulatory Exposure
  const regulatoryExposures = [
    { reg: 'India DPDP Act (2023)', statutoryLimit: 'Up to ₹250 Crore', modeledFine: '₹35.0 Lakh', trigger: 'Failure to enforce reasonable security safeguards over financial credentials' },
    { reg: 'EU GDPR (Art. 83)', statutoryLimit: 'Up to €20M / 4% Turnover', modeledFine: '₹45.0 Lakh', trigger: 'Unencrypted exfiltration of cross-border payment records' },
    { reg: 'RBI Master Direction / SEBI', statutoryLimit: 'Mandatory Supervisory Audit', modeledFine: '₹25.0 Lakh', trigger: 'Settlement engine downtime exceeding RTO limit of 2 hours' },
    { reg: 'US SEC Cyber Rule 106', statutoryLimit: 'Enforcement Action', modeledFine: '₹15.0 Lakh', trigger: 'Material incident disclosure delayed past 4 business days' },
  ];

  const handleTreat = () => {
    const rec = executeDecision({
      scenarioId: scenario.id,
      action: 'TREAT',
      actor: 'Sarah Chen',
      role: 'CISO',
      rationale: 'Approved multi-layer control deployment (FIDO2 Hardware Keys + Immutable Backups) to break initial access and lateral encryption paths.',
      selectedControlId: 'ctrl-mfa',
      selectedControlName: 'Privileged FIDO2 Hardware Keys & Immutable Backup Vault'
    });
    setDecisionState('TREAT');
    onShowToast?.('success', 'Risk Treatment Executed & Logged', `Net financial loss reduced to ${rec.residualEalFormatted}. Immutable audit log record created.`);
  };

  const handleTransfer = () => {
    executeDecision({
      scenarioId: scenario.id,
      action: 'TRANSFER',
      actor: 'David Miller',
      role: 'CFO',
      rationale: 'Underwritten by ICICI Lombard / Munich Re Cyber Consortium for ₹15.0 Crore aggregate breach limit.',
      insurancePolicyRef: 'POL-CYB-2026-9921',
    });
    setDecisionState('TRANSFER');
    setIsInsuranceModalOpen(true);
    onShowToast?.('success', 'Risk Transfer Executed & Logged', `Underwritten via policy POL-CYB-2026-9921. Audit entry created.`);
  };

  const handleAccept = () => {
    executeDecision({
      scenarioId: scenario.id,
      action: 'ACCEPT',
      actor: 'Sarah Chen',
      role: 'CISO',
      rationale: 'Executive acceptance approved for 90-day operational cycle pending planned core cloud infrastructure migration.',
      acceptanceExpiryDate: '2026-12-31'
    });
    setDecisionState('ACCEPT');
    setIsAcceptanceModalOpen(true);
    onShowToast?.('warning', 'Risk Formally Accepted & Logged', `Accepted under executive rationale until 2026-12-31. Audit record sealed.`);
  };

  const mitreSteps = intelligenceService.getMitreAttackSteps();

  return (
    <div className="animate-fade-in">
      {/* Masthead */}
      <div className="masthead">
        <div>
          <div className="org">Acme Financial Services · Scenario Deep-Dive</div>
          <h1>{scenario.name}</h1>
          <div className="period">Associated Business Service: <strong>{scenario.businessService}</strong></div>
        </div>
        <div className="masthead-actions flex items-center gap-2">
          <button className="btn" onClick={onBack}>
            <ArrowLeft size={13} />
            <span>Command Center</span>
          </button>
          <button 
            className={`btn ${(decisionState === 'TREAT' || treatment?.action === 'TREAT') ? 'primary' : ''}`}
            onClick={handleTreat}
            title="Treat via Control Investments"
          >
            <ShieldCheck size={13} />
            <span>Treat (Optimize)</span>
          </button>
          <button 
            className={`btn ${(decisionState === 'TRANSFER' || treatment?.action === 'TRANSFER') ? 'primary' : ''}`}
            onClick={handleTransfer}
            title="Transfer to Cyber Insurance"
          >
            <FileSignature size={13} />
            <span>Transfer (Insurance)</span>
          </button>
          <button 
            className={`btn ${(decisionState === 'ACCEPT' || treatment?.action === 'ACCEPT') ? 'crimson' : ''}`}
            onClick={handleAccept}
            title="Accept Exception"
          >
            <AlertOctagon size={13} />
            <span>Accept Risk</span>
          </button>
        </div>
      </div>

      {/* Auditable Decision Record Banner */}
      {treatment && (
        <div className="card p-4 border-teal/40 bg-teal/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 my-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal/15 text-teal flex items-center justify-center shrink-0">
              <Check size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge good text-[11px] font-mono font-bold">DECISION EXECUTED: {treatment.action}</span>
                <span className="text-xs text-sub">By <strong>{treatment.actor}</strong> ({treatment.role}) · {treatment.timestamp}</span>
              </div>
              <div className="text-xs text-text font-medium mt-1">
                {treatment.action === 'TREAT' && `Treated via ${treatment.selectedControlName}. Residual risk reduced to ${treatment.residualEalFormatted}.`}
                {treatment.action === 'TRANSFER' && `Transferred via Cyber Policy ${treatment.insurancePolicyRef}. Net corporate loss capped.`}
                {treatment.action === 'ACCEPT' && `Formally accepted risk exception under CISO authority (Expires: ${treatment.acceptanceExpiryDate}).`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-sub bg-card px-3 py-1.5 rounded border border-line">
            <Hash size={12} className="text-teal" />
            <span className="truncate max-w-[160px]" title={treatment.decisionHash}>{treatment.decisionHash}</span>
            <span className="badge good text-[9px]">Verified</span>
          </div>
        </div>
      )}

      {/* Hero statement line */}
      <div className="hero">
        <div>
          <div className="label">Expected yearly loss (CRQ Model)</div>
          <div className="figure mid">{scenario.expectedAnnualLossFormatted}</div>
          <div className="tag">
            <span>↑</span> {Math.round(scenario.probability * 100)}% Annual Probability • 95th Percentile VaR: {scenario.p95LossFormatted}
          </div>
          <div className="note">
            {scenario.description}
          </div>
        </div>
        <div>
          <div className="callout crimson" style={{ margin: 0 }}>
            <strong>Why this matters:</strong> If ransomware disrupts the core payment settlement database, direct business interruption, customer restitution, and regulatory non-compliance costs will exceed <strong>₹5.00 Crore per day</strong>.
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview & Root Causes
        </button>
        <button 
          className={`tab ${activeTab === 'attack-path' ? 'active' : ''}`}
          onClick={() => setActiveTab('attack-path')}
        >
          Attack Path (7 Steps)
        </button>
        <button 
          className={`tab ${activeTab === 'decomposition' ? 'active' : ''}`}
          onClick={() => setActiveTab('decomposition')}
        >
          6-Tier Loss Decomposition
        </button>
        <button 
          className={`tab ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          Probabilistic Monte Carlo & Sensitivity
        </button>
        <button 
          className={`tab ${activeTab === 'evidence' ? 'active' : ''}`}
          onClick={() => setActiveTab('evidence')}
        >
          Verifiable Evidence Ledger
        </button>
        <button 
          className={`tab ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          Recommended Investments
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          <h2 className="section">Why is this risk high?</h2>
          <div className="section-sub">Root cause technical deficiencies contributing to expected financial loss.</div>
          
          <div className="priority">
            <div className="priority-item">
              <div className="num">1</div>
              <div className="body">
                <div className="title">Unpatched Edge Perimeter Flaw (CVE-2024-21413)</div>
                <div className="meta">Payment API Gateway (api-gateway-prod-01) runs unpatched version with public exploit availability (EPSS 0.82).</div>
              </div>
            </div>
            <div className="priority-item">
              <div className="num">2</div>
              <div className="body">
                <div className="title">SMS MFA Fallback on 18 Administrator Accounts</div>
                <div className="meta">Allows adversary session takeover via SIM-swap or OTP phishing.</div>
              </div>
            </div>
            <div className="priority-item">
              <div className="num">3</div>
              <div className="body">
                <div className="title">Missing Write-Lock Backup Immutability</div>
                <div className="meta">Backup snapshots can be deleted by compromised domain admin credentials.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ATTACK PATH */}
      {activeTab === 'attack-path' && (
        <div className="space-y-6">
          <div>
            <h2 className="section">MITRE ATT&CK Adversary Kill-Chain Progression</h2>
            <div className="section-sub">Interactive adversary traversal sequence mapping technical exploitation chokepoints to enterprise financial loss.</div>
          </div>

          <div className="path" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px' }}>
            {mitreSteps.map((node, idx) => {
              const isSelected = selectedAttackNode === String(node.stepNumber);
              const isChokepoint = node.stepNumber === 3 || node.stepNumber === 5;
              return (
                <React.Fragment key={node.id}>
                  <div 
                    className={`path-node ${isChokepoint ? 'weak' : ''}`}
                    onClick={() => setSelectedAttackNode(String(node.stepNumber))}
                    style={{
                      borderWidth: isSelected ? '2px' : '1px',
                      borderColor: isSelected ? 'var(--ink)' : undefined,
                      minWidth: '150px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <strong>Step {node.stepNumber}</strong>
                      <span className="badge neutral font-mono text-[9px]">{node.techniqueId}</span>
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'normal' }}>
                      {node.techniqueName}
                    </div>
                    <div style={{ fontSize: '10px', color: isChokepoint ? 'var(--crimson)' : 'var(--sub)', marginTop: '4px' }}>
                      {node.status}
                    </div>
                  </div>
                  {idx < mitreSteps.length - 1 && <span className="path-arrow" style={{ alignSelf: 'center' }}>→</span>}
                </React.Fragment>
              );
            })}
          </div>

          {/* Selected Chokepoint Inspector Card */}
          {(() => {
            const activeStep = mitreSteps.find(s => String(s.stepNumber) === selectedAttackNode) || mitreSteps[2];
            return (
              <div className="card p-5 border-teal/40 bg-card space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-3 border-b border-line">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="badge teal font-mono text-xs">{activeStep.techniqueId}</span>
                      <span className="badge crit text-xs">{activeStep.tactic}</span>
                      <span className="badge neutral text-xs font-mono">{activeStep.status}</span>
                    </div>
                    <h3 className="font-serif text-lg text-ink font-medium m-0 mt-1">{activeStep.techniqueName}</h3>
                  </div>

                  <a
                    href={activeStep.mitreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link-btn text-xs flex items-center gap-1"
                  >
                    <span>MITRE ATT&CK Docs</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="text-xs text-sub leading-relaxed">
                  {activeStep.description}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-3 bg-paper rounded border border-line">
                    <div className="text-sub font-semibold text-[10px] uppercase">Affected Enterprise Asset</div>
                    <div className="text-ink font-medium mt-1">{activeStep.affectedAsset}</div>
                  </div>

                  <div className="p-3 bg-paper rounded border border-line">
                    <div className="text-sub font-semibold text-[10px] uppercase">Control Vulnerability</div>
                    <div className="text-crimson font-medium mt-1">{activeStep.controlWeakness || 'Perimeter access weakness'}</div>
                  </div>

                  <div className="p-3 bg-teal/5 rounded border border-teal/30">
                    <div className="text-teal font-semibold text-[10px] uppercase">Defensive Chokepoint & Loss Reduction</div>
                    <div className="text-teal font-bold mt-1">{activeStep.chokepointControl}</div>
                    <div className="text-teal text-[11px] font-mono mt-0.5">Saves {activeStep.ealReductionFormatted} EAL / yr</div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    className="btn primary text-xs"
                    onClick={handleTreat}
                  >
                    <ShieldCheck size={13} />
                    <span>Deploy {activeStep.chokepointControl} (Treat)</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB CONTENT: 6-TIER LOSS DECOMPOSITION */}
      {activeTab === 'decomposition' && (
        <div>
          <h2 className="section">6-Tier Granular Financial Loss Decomposition</h2>
          <div className="section-sub">Detailed breakdown of potential breach cost across operational, extortion, legal, regulatory, and reputational vectors.</div>

          <div style={{ border: '1px solid var(--line)', borderRadius: '8px', background: '#FFFFFF', padding: '20px', marginTop: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {lossTiers.map((tier, i) => (
                <div key={i} style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '12px', background: '#F8FAFC' }}>
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>{tier.icon}</div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--sub)' }}>{tier.pct}% of Total</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0C233F', margin: '4px 0' }}>{tier.amount}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--sub)', lineHeight: '1.3' }}>{tier.tier.split(' ')[0]} {tier.tier.split(' ')[1]}</div>
                </div>
              ))}
            </div>

            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Financial Loss Vector</th>
                  <th>Contribution</th>
                  <th>Expected Loss (EAL)</th>
                  <th>95th Percentile Tail (VaR)</th>
                  <th>Impact Mechanism</th>
                </tr>
              </thead>
              <tbody>
                {lossTiers.map((t, idx) => (
                  <tr key={idx}>
                    <td>
                      <span style={{ marginRight: '8px' }}>{t.icon}</span>
                      <strong>{t.tier}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '80px', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${t.pct * 2}%`, height: '100%', background: '#0C233F' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{t.pct}%</span>
                      </div>
                    </td>
                    <td className="num" style={{ fontWeight: 600 }}>{t.amount}</td>
                    <td className="num" style={{ color: 'var(--crimson)', fontWeight: 600 }}>{t.p95}</td>
                    <td style={{ fontSize: '12px', color: 'var(--sub)' }}>{t.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="section" style={{ marginTop: '24px' }}>Statutory Regulatory Penalty Quantification</h2>
          <div className="section-sub">Cross-jurisdictional compliance liability calibrated against active data classifications.</div>

          <table className="ledger-table" style={{ marginTop: '12px' }}>
            <thead>
              <tr>
                <th>Framework & Directive</th>
                <th>Statutory Maximum</th>
                <th>Expected Model Exposure</th>
                <th>Enforcement Trigger</th>
              </tr>
            </thead>
            <tbody>
              {regulatoryExposures.map((r, i) => (
                <tr key={i}>
                  <td><strong>{r.reg}</strong></td>
                  <td style={{ color: 'var(--sub)', fontSize: '12px' }}>{r.statutoryLimit}</td>
                  <td className="num" style={{ color: 'var(--crimson)', fontWeight: 600 }}>{r.modeledFine}</td>
                  <td style={{ fontSize: '12px', color: 'var(--sub)' }}>{r.trigger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: FINANCIAL (MONTE CARLO & SENSITIVITY) */}
      {activeTab === 'financial' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 className="section">Probabilistic Monte Carlo Quantification</h2>
              <div className="section-sub">{iterations.toLocaleString()} trial sampling under {distributionType === 'beta_pert' ? 'Beta-PERT' : distributionType === 'lognormal' ? 'Log-Normal' : 'Weibull'} distribution.</div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--sub)' }}>Distribution:</span>
                <select
                  value={distributionType}
                  onChange={(e) => {
                    setDistributionType(e.target.value as any);
                    onShowToast?.('info', 'Distribution Model Updated', `Monte Carlo recalculated using ${e.target.value.toUpperCase()} loss density.`);
                  }}
                  style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--line)', fontSize: '12px' }}
                >
                  <option value="lognormal">Log-Normal (FAIR Standard)</option>
                  <option value="beta_pert">Beta-PERT (Tail Conservative)</option>
                  <option value="weibull">Weibull (Extreme Event)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--sub)' }}>Trials:</span>
                <select
                  value={iterations}
                  onChange={(e) => {
                    const iters = Number(e.target.value);
                    setIterations(iters);
                    onShowToast?.('info', 'Simulation Runs Updated', `Monte Carlo recalculated with ${iters.toLocaleString()} trials.`);
                  }}
                  style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--line)', fontSize: '12px' }}
                >
                  <option value={10000}>10,000 trials</option>
                  <option value={25000}>25,000 trials</option>
                  <option value={50000}>50,000 trials</option>
                </select>
              </div>
            </div>
          </div>

          <div className="ledger-row" style={{ margin: '14px 0 24px' }}>
            <div className="ledger-item">
              <div className="l">Median Loss (P50)</div>
              <div className="v">₹3.8 cr</div>
              <div className="t flat">Baseline estimate</div>
            </div>
            <div className="ledger-item">
              <div className="l">90th Percentile (P90)</div>
              <div className="v">₹9.2 cr</div>
              <div className="t up-bad">Tail exposure</div>
            </div>
            <div className="ledger-item">
              <div className="l">95th Percentile (P95 VaR)</div>
              <div className="v">₹13.8 cr</div>
              <div className="t up-bad">Above appetite limit</div>
            </div>
            <div className="ledger-item">
              <div className="l">Expected Shortfall (CVaR)</div>
              <div className="v" style={{ color: 'var(--crimson)' }}>₹17.4 cr</div>
              <div className="t up-bad">Mean loss beyond P95</div>
            </div>
          </div>

          <h2 className="section">Sensitivity Driver Attribution (Sobol / Spearman Rank)</h2>
          <div className="section-sub">Relative contribution of threat variables to tail financial risk.</div>

          <div style={{ border: '1px solid var(--line)', borderRadius: '8px', padding: '16px', background: '#FFFFFF', marginTop: '12px' }}>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                <span>1. Threat Event Frequency (Adversary Activity / Port Scans)</span>
                <span style={{ color: '#0C233F' }}>42.5% contribution</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#E2E8F0', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '42.5%', height: '100%', background: '#0C233F' }} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                <span>2. Asset Vulnerability & Public Exploitability (CVE-2024-21413 EPSS)</span>
                <span style={{ color: '#0C233F' }}>34.0% contribution</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#E2E8F0', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '34.0%', height: '100%', background: 'var(--teal)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                <span>3. Defensive Control Barrier Degradation (SMS MFA Fallback)</span>
                <span style={{ color: '#0C233F' }}>23.5% contribution</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#E2E8F0', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '23.5%', height: '100%', background: 'var(--crimson)' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: EVIDENCE */}
      {activeTab === 'evidence' && (
        <div>
          <h2 className="section">Verifiable Telemetry Evidence</h2>
          <div className="section-sub">Cryptographically hashed evidence records backing this scenario.</div>

          <table className="ledger-table">
            <thead>
              <tr>
                <th>Source System</th>
                <th>Observed Evidence Finding</th>
                <th>Ingestion Timestamp</th>
                <th>SHA-256 Digest</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Qualys VMDR Scanner</strong></td>
                <td>CVE-2024-21413 detected on api-gateway-prod-01 (Port 443)</td>
                <td style={{ color: 'var(--sub)' }}>2026-09-03 08:30 UTC</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--teal)' }}>e3b0c44298fc...</td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="link-btn"
                    onClick={() => onInspectEvidence({
                      id: 'ev_1',
                      source: 'Qualys VMDR Scanner',
                      timestamp: '2026-09-03 08:30 UTC',
                      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                      description: 'CVE-2024-21413 detected on api-gateway-prod-01 (CVSS 9.8)',
                      rawPayload: { host: 'api-gateway-prod-01', cve: 'CVE-2024-21413', cvss: 9.8, epss: 0.82 }
                    })}
                  >
                    Inspect JSON →
                  </button>
                </td>
              </tr>
              <tr>
                <td><strong>Okta IAM Policy Engine</strong></td>
                <td>18 Administrator accounts lacking hardware token enforcement</td>
                <td style={{ color: 'var(--sub)' }}>2026-09-03 09:15 UTC</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--teal)' }}>8f434346648f...</td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="link-btn"
                    onClick={() => onInspectEvidence({
                      id: 'ev_2',
                      source: 'Okta IAM Policy Engine',
                      timestamp: '2026-09-03 09:15 UTC',
                      hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
                      description: '18 Administrator accounts lacking hardware token enforcement',
                      rawPayload: { total_admins: 24, hardware_mfa: 6, sms_fallback: 18 }
                    })}
                  >
                    Inspect JSON →
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: ACTIONS */}
      {activeTab === 'actions' && (
        <div>
          <h2 className="section">Recommended Defense Bundle</h2>
          <div className="section-sub">Targeted capital allocation prescribed by the MIP solver.</div>

          <div className="grid2">
            <div className="portfolio-card">
              <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text)' }}>
                1. FIDO2 Hardware MFA Keys (₹25 Lakh)
              </div>
              <div style={{ fontSize: '13px', color: 'var(--sub)', margin: '6px 0 12px' }}>
                Replaces SMS OTP for all 24 privileged infrastructure accounts.
              </div>
              <div className="pstat">
                <div className="l">Expected Risk Reduction</div>
                <div className="v" style={{ color: 'var(--teal)' }}>₹1.40 Crore</div>
              </div>
            </div>

            <div className="portfolio-card">
              <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text)' }}>
                2. Air-Gapped Immutable Backups (₹35 Lakh)
              </div>
              <div style={{ fontSize: '13px', color: 'var(--sub)', margin: '6px 0 12px' }}>
                Guarantees 2-hour clean DB restore without extortion payout.
              </div>
              <div className="pstat">
                <div className="l">Expected Risk Reduction</div>
                <div className="v" style={{ color: 'var(--teal)' }}>₹1.10 Crore</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="disclaimer">
        Figures are estimates produced by the CyberOptix AI risk engine from connected evidence sources.
      </footer>

      {/* Cyber Insurance Modal */}
      <InsuranceQuoteModal
        isOpen={isInsuranceModalOpen}
        onClose={() => setIsInsuranceModalOpen(false)}
        scenarioName={scenario.name}
        expectedAnnualLoss={scenario.expectedAnnualLossFormatted}
        p95Loss={scenario.p95LossFormatted}
        onConfirmTransfer={(details) => {
          setDecisionState('TRANSFER');
          onShowToast?.('success', 'Policy Bound & Risk Transferred', `Bound ${details.policyLimit} policy with ${details.underwriter} at ${details.premium}.`);
        }}
      />

      {/* Risk Acceptance Exception Modal */}
      <RiskAcceptanceModal
        isOpen={isAcceptanceModalOpen}
        onClose={() => setIsAcceptanceModalOpen(false)}
        scenarioName={scenario.name}
        expectedAnnualLoss={scenario.expectedAnnualLossFormatted}
        onConfirmAcceptance={(data) => {
          setDecisionState('ACCEPT');
          onShowToast?.('warning', 'Risk Exception Logged', `Logged ${data.durationDays}-day risk exception under ${data.approver}.`);
        }}
      />

      {/* Attack Step Deep-Dive Modal */}
      <AttackStepDetailsModal
        isOpen={!!inspectedAttackNode}
        onClose={() => setInspectedAttackNode(null)}
        node={inspectedAttackNode}
        onNavigate={onNavigate}
      />
    </div>
  );
};
