import React from 'react';
import { NavigationPage } from '../../types';

interface ControlsMatrixProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ControlsMatrix: React.FC<ControlsMatrixProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Security Controls</div>
          <h1>Controls</h1>
          <div className="period">A control is a security measure such as MFA, backups, encryption, monitoring, or recovery testing</div>
        </div>
        <div className="masthead-actions">
          <button className="btn">Add control</button>
        </div>
      </div>

      <div className="filter-bar">
        <select><option>All frameworks</option><option>NIST CSF 2.0</option><option>SEBI CSCRF</option></select>
        <select><option>All statuses</option><option>Partly effective</option><option>Effective</option><option>Failed</option></select>
        <input className="search-input" type="text" placeholder="Search controls…" />
      </div>

      <div className="control-row" style={{ borderTop: '1px solid var(--line)', fontSize: '12px', color: 'var(--sub)', fontWeight: 500 }}>
        <div>Control</div>
        <div>Coverage</div>
        <div>Effectiveness</div>
        <div>Related risks</div>
        <div>Potential reduction</div>
      </div>

      <div className="control-row">
        <div>
          <div className="name">Privileged-user MFA</div>
          <div className="sub">Evidence updated 3 hours ago · owner: Identity Team</div>
          <span className="badge warn" style={{ marginTop: '4px' }}>Partly effective</span>
        </div>
        <div>78%</div>
        <div>64%</div>
        <div>Ransomware, account takeover</div>
        <div>
          <strong>₹1.4 crore</strong><br />
          <a className="link-btn" onClick={() => onNavigate('scenarios')}>View evidence →</a> &nbsp;
          <a className="link-btn">Test control →</a>
        </div>
      </div>

      <div className="control-row">
        <div>
          <div className="name">Immutable backups</div>
          <div className="sub">Evidence updated 1 day ago · owner: Infrastructure Team</div>
          <span className="badge good" style={{ marginTop: '4px' }}>Effective</span>
        </div>
        <div>95%</div>
        <div>91%</div>
        <div>Ransomware, destructive attack</div>
        <div>
          <strong>₹1.1 crore</strong><br />
          <a className="link-btn">View evidence →</a>
        </div>
      </div>

      <div className="control-row">
        <div>
          <div className="name">Network segmentation</div>
          <div className="sub">Evidence updated 12 days ago · owner: Network Team</div>
          <span className="badge neutral" style={{ marginTop: '4px' }}>Implemented</span>
        </div>
        <div>66%</div>
        <div>53%</div>
        <div>Ransomware, lateral movement</div>
        <div>
          <strong>₹90 lakh</strong><br />
          <a className="link-btn" onClick={() => onNavigate('optimizer')}>Create action →</a>
        </div>
      </div>

      <div className="control-row">
        <div>
          <div className="name">Full recovery testing</div>
          <div className="sub">No test recorded in 9 months</div>
          <span className="badge crit" style={{ marginTop: '4px' }}>Evidence stale</span>
        </div>
        <div>—</div>
        <div>—</div>
        <div>Ransomware, outage</div>
        <div>
          <strong>₹60 lakh</strong><br />
          <a className="link-btn" onClick={() => onNavigate('incidents')}>Schedule test →</a>
        </div>
      </div>
    </div>
  );
};
