import React, { useState } from 'react';
import { NavigationPage } from '../../types';

interface IncidentsResilienceProps {
  onNavigate: (page: NavigationPage) => void;
}

export const IncidentsResilience: React.FC<IncidentsResilienceProps> = ({ onNavigate }) => {
  const [activeChip, setActiveChip] = useState('Risk scenario');

  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Incidents &amp; Resilience</div>
          <h1>Incidents</h1>
          <div className="period">Loss calibration &amp; empirical model updating</div>
        </div>
        <div className="masthead-actions">
          <button className="btn">Log incident</button>
        </div>
      </div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Incident</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Affected service</th>
            <th>Estimated loss</th>
            <th>Actual loss</th>
            <th>Discovered</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>INC-2026-014</strong> · Phishing led to account lockouts</td>
            <td><span className="badge warn">High</span></td>
            <td><span className="badge neutral">Contained</span></td>
            <td>Corporate IT</td>
            <td className="num">₹18 lakh</td>
            <td className="num">₹6 lakh</td>
            <td style={{ color: 'var(--sub)' }}>2 days ago</td>
          </tr>
          <tr>
            <td><strong>INC-2026-011</strong> · Vendor API outage</td>
            <td><span className="badge warn">Medium</span></td>
            <td><span className="badge good">Recovered</span></td>
            <td>Trading Platform</td>
            <td className="num">₹9 lakh</td>
            <td className="num">₹4 lakh</td>
            <td style={{ color: 'var(--sub)' }}>9 days ago</td>
          </tr>
          <tr>
            <td><strong>INC-2026-006</strong> · Attempted credential-stuffing</td>
            <td><span className="badge crit">Critical</span></td>
            <td><span className="badge good">Closed</span></td>
            <td>Customer Data</td>
            <td className="num">₹40 lakh</td>
            <td className="num">₹0</td>
            <td style={{ color: 'var(--sub)' }}>31 days ago</td>
          </tr>
        </tbody>
      </table>

      <div className="callout" style={{ marginTop: '22px' }}>
        <b>INC-2026-006 closed.</b> Root cause: missing rate limiting on the login endpoint. Update risk model with this finding?
        <div style={{ marginTop: '10px' }}>
          <button className="btn sm primary" onClick={() => onNavigate('scenarios')}>
            Review changes &amp; calibrate model →
          </button>
        </div>
      </div>

      <h2 className="section">Connect this incident to</h2>
      <div className="chip-row">
        {['Risk scenario', 'Control failure', 'Asset', 'Business service', 'New investment recommendation'].map((chip) => (
          <div 
            key={chip} 
            className={`chip ${activeChip === chip ? 'active' : ''}`}
            onClick={() => setActiveChip(chip)}
          >
            {chip}
          </div>
        ))}
      </div>
    </div>
  );
};
