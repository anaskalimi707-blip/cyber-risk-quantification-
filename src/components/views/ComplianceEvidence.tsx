import React from 'react';
import { NavigationPage } from '../../types';
import { Download, ShieldCheck, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

interface ComplianceEvidenceProps {
  onNavigate: (page: NavigationPage) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, description: string) => void;
  onOpenDocument?: (title: string, type: string) => void;
}

export const ComplianceEvidence: React.FC<ComplianceEvidenceProps> = ({ 
  onNavigate, 
  onShowToast,
  onOpenDocument
}) => {
  const handleExportAudit = () => {
    if (onOpenDocument) {
      onOpenDocument("Q3 2026 Comprehensive Regulatory Compliance & Audit Ledger", "Regulatory Audit Dossier");
    }
    onShowToast?.('success', 'Audit Package Generated', 'Compiled SEBI CSCRF, RBI & ISO 27001 evidence binder with SHA-256 audit roots.');
  };

  const handleAssignOwner = (task: string) => {
    onShowToast?.('success', 'Remediation Task Assigned', `Assigned "${task}" to Lead Information Security Auditor. Due date: 14 days.`);
  };

  const handleApproveException = (req: string) => {
    onShowToast?.('warning', 'Audit Exception Granted', `30-day temporary exception recorded for ${req} with Chief Risk Officer sign-off.`);
  };

  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Compliance &amp; Evidence</div>
          <h1>Compliance &amp; Regulatory Traceability</h1>
          <div className="period">Bidirectional mapping: Regulation → Technical Control → Telemetry Digest → Financial Risk</div>
        </div>
        <div className="masthead-actions flex items-center gap-2">
          <button className="btn primary" onClick={handleExportAudit}>
            <Download size={13} />
            <span>Export Audit Package</span>
          </button>
        </div>
      </div>

      <div className="ledger-row">
        <div className="ledger-item">
          <div className="l">SEBI CSCRF readiness</div>
          <div className="v">76%</div>
        </div>
        <div className="ledger-item">
          <div className="l">Implemented controls</div>
          <div className="v">58</div>
        </div>
        <div className="ledger-item">
          <div className="l">Partly effective</div>
          <div className="v" style={{ color: 'var(--amber)' }}>14</div>
        </div>
        <div className="ledger-item">
          <div className="l">Failed controls</div>
          <div className="v" style={{ color: 'var(--crimson)' }}>3</div>
        </div>
        <div className="ledger-item">
          <div className="l">Stale evidence</div>
          <div className="v" style={{ color: 'var(--amber)' }}>9</div>
        </div>
      </div>

      <h2 className="section">High-risk gaps</h2>
      <div className="section-sub">Compliance deficiencies mapped to potential regulatory fines and loss vectors.</div>

      <div className="priority">
        <div className="priority-item">
          <div className="num">1</div>
          <div className="body">
            <div className="title">Critical-service recovery testing</div>
            <div className="meta">Requirement 7.2 · SEBI CSCRF</div>
            <div className="actions">
              <button className="link-btn font-medium" onClick={() => onNavigate('controls')}>Request evidence →</button>
              <button className="link-btn font-medium" onClick={() => handleAssignOwner('Critical-service recovery testing')}>Assign owner →</button>
            </div>
          </div>
        </div>

        <div className="priority-item">
          <div className="num">2</div>
          <div className="body">
            <div className="title">Privileged-access review frequency</div>
            <div className="meta">Requirement 4.1 · ISO/IEC 27001</div>
            <div className="actions">
              <button className="link-btn font-medium" onClick={() => handleApproveException('ISO 27001 Req 4.1')}>Approve exception →</button>
            </div>
          </div>
        </div>

        <div className="priority-item">
          <div className="num">3</div>
          <div className="body">
            <div className="title">Third-party incident reporting evidence</div>
            <div className="meta">Requirement 9.4 · SEBI CSCRF</div>
            <div className="actions">
              <button className="link-btn font-medium" onClick={() => onNavigate('vendors')}>Review vendor →</button>
              <button className="link-btn font-medium" onClick={() => handleAssignOwner('Third-party incident reporting')}>Assign owner →</button>
            </div>
          </div>
        </div>

        <div className="priority-item">
          <div className="num">4</div>
          <div className="body">
            <div className="title">Continuous monitoring coverage</div>
            <div className="meta">Requirement 3.3 · NIST CSF 2.0</div>
            <div className="actions">
              <button className="link-btn font-medium" onClick={() => onShowToast?.('info', 'Audit Log History', 'Retrieved 180-day SIEM & EDR telemetry log timestamps.')}>View history →</button>
            </div>
          </div>
        </div>
      </div>

      <div className="callout" style={{ marginTop: '20px' }}>
        Every gap traces: <strong>Requirement → Control → Evidence → Asset → Business service → Financial risk → Remediation action.</strong>
      </div>
    </div>
  );
};

