import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { mockRiskScenarios } from '../../data/mockData';
import { ShieldCheck, ShieldAlert, ArrowLeft, CheckCircle2, FileSignature, AlertOctagon } from 'lucide-react';
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
  const scenario = mockRiskScenarios.find(s => s.id === scenarioId) || mockRiskScenarios[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'attack-path' | 'financial' | 'evidence' | 'actions'>('overview');
  const [selectedAttackNode, setSelectedAttackNode] = useState<string>('3');
  const [decisionState, setDecisionState] = useState<'TREAT' | 'TRANSFER' | 'ACCEPT' | null>(null);

  // Modals state
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState<boolean>(false);
  const [isAcceptanceModalOpen, setIsAcceptanceModalOpen] = useState<boolean>(false);
  const [inspectedAttackNode, setInspectedAttackNode] = useState<{ id: string; name: string; status: string; controlWeakness?: string } | null>(null);

  const handleTreat = () => {
    setDecisionState('TREAT');
    onShowToast?.('success', 'Risk Treatment Initiated', `Generated ₹70L mitigation package for "${scenario.name}". Opening Investment Optimizer.`);
    setTimeout(() => onNavigate('optimizer'), 600);
  };

  const handleTransfer = () => {
    setIsInsuranceModalOpen(true);
  };

  const handleAccept = () => {
    setIsAcceptanceModalOpen(true);
  };

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
            className={`btn ${decisionState === 'TREAT' ? 'primary' : ''}`}
            onClick={handleTreat}
            title="Treat via Control Investments"
          >
            <ShieldCheck size={13} />
            <span>Treat (Optimize)</span>
          </button>
          <button 
            className={`btn ${decisionState === 'TRANSFER' ? 'primary' : ''}`}
            onClick={handleTransfer}
            title="Transfer to Cyber Insurance"
          >
            <FileSignature size={13} />
            <span>Transfer (Insurance)</span>
          </button>
          <button 
            className={`btn ${decisionState === 'ACCEPT' ? 'crimson' : ''}`}
            onClick={handleAccept}
            title="Accept Exception"
          >
            <AlertOctagon size={13} />
            <span>Accept Risk</span>
          </button>
        </div>
      </div>


      {/* Hero statement line */}
      <div className="hero">
        <div>
          <div className="label">Expected yearly loss</div>
          <div className="figure mid">{scenario.expectedAnnualLossFormatted}</div>
          <div className="tag">
            <span>↑</span> {Math.round(scenario.probability * 100)}% Annual Probability • 95th Percentile: {scenario.p95LossFormatted}
          </div>
          <div className="note">
            {scenario.description}
          </div>
        </div>
        <div>
          <div className="callout crimson" style={{ margin: 0 }}>
            <strong>Why this matters:</strong> If ransomware disrupts the core payment settlement database, manual rollback and regulatory non-compliance costs would exceed <strong>₹5.00 Crore per day</strong>.
          </div>
        </div>
      </div>

      {/* Tabs */}
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
          Interactive Attack Path (7 Steps)
        </button>
        <button 
          className={`tab ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          Financial Loss Distribution
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
                <div className="meta">Payment API Gateway (api-gateway-prod-01) runs unpatched version with public exploit availability.</div>
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
        <div>
          <h2 className="section">Adversary Attack Path Progression</h2>
          <div className="section-sub">Click any node along the kill chain to see technical chokepoint details.</div>

          <div className="path">
            {scenario.attackPathNodes.map((node, idx) => {
              const isWeak = node.id === '3' || node.id === '5';
              const isSelected = selectedAttackNode === node.id;
              return (
                <React.Fragment key={node.id}>
                  <div 
                    className={`path-node ${isWeak ? 'weak' : ''}`}
                    onClick={() => setSelectedAttackNode(node.id)}
                    style={{
                      borderWidth: isSelected ? '2px' : '1px',
                      borderColor: isSelected ? 'var(--ink)' : undefined
                    }}
                  >
                    <strong>Step {node.id}:</strong> {node.name.split('/')[0]}
                    <div style={{ fontSize: '11px', color: 'var(--sub)', marginTop: '2px' }}>{node.status}</div>
                  </div>
                  {idx < scenario.attackPathNodes.length - 1 && <span className="path-arrow">→</span>}
                </React.Fragment>
              );
            })}
          </div>

          <div className="callout teal" style={{ marginTop: '22px' }}>
            <strong>Selected Node Chokepoint:</strong> {scenario.attackPathNodes.find(n => n.id === selectedAttackNode)?.name}
            <div style={{ marginTop: '4px', fontSize: '12.5px' }}>
              Enforcing FIDO2 Hardware MFA on payment gateway administrators breaks this attack chain and reduces expected yearly loss by <strong>₹1.4 Crore</strong>.
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FINANCIAL */}
      {activeTab === 'financial' && (
        <div>
          <h2 className="section">Probabilistic Financial Loss Breakdown</h2>
          <div className="section-sub">10,000 Monte Carlo simulations under FAIR lognormal distribution.</div>

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
              <div className="t up-bad">Above appetite</div>
            </div>
            <div className="ledger-item">
              <div className="l">Max Modeled Loss</div>
              <div className="v">₹25.0 cr</div>
              <div className="t flat">Catastrophic limit</div>
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
        Figures are estimates produced by the CyberOptix risk engine from connected evidence sources.
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
