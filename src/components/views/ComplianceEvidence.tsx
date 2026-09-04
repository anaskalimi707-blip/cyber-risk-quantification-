import React from 'react';
import { NavigationPage } from '../../types';

interface ComplianceEvidenceProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ComplianceEvidence: React.FC<ComplianceEvidenceProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Compliance &amp; Evidence</div>
          <h1>Compliance</h1>
          <div className="period">Framework mapping to technical controls and financial exposure</div>
        </div>
        <div className="masthead-actions">
          <button className="btn">Export audit package</button>
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
              <a className="link-btn" onClick={() => onNavigate('controls')}>Request evidence →</a>
              <a className="link-btn">Assign owner →</a>
            </div>
          </div>
        </div>

        <div className="priority-item">
          <div className="num">2</div>
          <div className="body">
            <div className="title">Privileged-access review frequency</div>
            <div className="meta">Requirement 4.1 · ISO/IEC 27001</div>
            <div className="actions">
              <a className="link-btn">Approve exception →</a>
            </div>
          </div>
        </div>

        <div className="priority-item">
          <div className="num">3</div>
          <div className="body">
            <div className="title">Third-party incident reporting evidence</div>
            <div className="meta">Requirement 9.4 · SEBI CSCRF</div>
            <div className="actions">
              <a className="link-btn" onClick={() => onNavigate('vendors')}>Review vendor →</a>
            </div>
          </div>
        </div>

        <div className="priority-item">
          <div className="num">4</div>
          <div className="body">
            <div className="title">Continuous monitoring coverage</div>
            <div className="meta">Requirement 3.3 · NIST CSF 2.0</div>
            <div className="actions">
              <a className="link-btn">View history →</a>
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
