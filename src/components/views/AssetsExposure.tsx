import React from 'react';
import { NavigationPage } from '../../types';

interface AssetsExposureProps {
  onNavigate: (page: NavigationPage) => void;
}

export const AssetsExposure: React.FC<AssetsExposureProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Asset Inventory</div>
          <h1>Assets &amp; Exposure</h1>
          <div className="period">Find the systems creating the most business risk</div>
        </div>
        <div className="masthead-actions">
          <button className="btn">Import assets</button>
          <button className="btn primary">Export</button>
        </div>
      </div>

      <div className="filter-bar">
        <input className="search-input" type="text" placeholder="Search by name, IP, owner…" />
        <select><option>All business services</option><option>Payment Processing</option><option>Customer Data</option><option>Trading Platform</option></select>
        <select><option>All criticality</option><option>Critical</option><option>High</option></select>
        <select><option>Internet exposure</option><option>Internet-facing</option><option>Internal only</option></select>
        <select><option>All owners</option><option>Platform Team</option><option>Data Team</option><option>App Team</option></select>
      </div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Business service</th>
            <th>Risk contribution</th>
            <th>Exposure</th>
            <th>Critical vulns</th>
            <th>Control coverage</th>
            <th>Owner</th>
            <th>Recommended action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Payment API-04</strong></td>
            <td>Payment Processing</td>
            <td className="num">₹82 lakh</td>
            <td><span className="badge crit">Internet-facing</span></td>
            <td>4</td>
            <td>62%</td>
            <td>Platform Team</td>
            <td><a className="link-btn" onClick={() => onNavigate('scenarios')}>Patch &amp; restrict exposure →</a></td>
          </tr>
          <tr>
            <td><strong>CardAuth-DB-02</strong></td>
            <td>Payment Processing</td>
            <td className="num">₹61 lakh</td>
            <td><span className="badge neutral">Internal</span></td>
            <td>2</td>
            <td>74%</td>
            <td>Data Team</td>
            <td><a className="link-btn">Rotate credentials →</a></td>
          </tr>
          <tr>
            <td><strong>Customer-CRM-01</strong></td>
            <td>Customer Data</td>
            <td className="num">₹48 lakh</td>
            <td><span className="badge crit">Internet-facing</span></td>
            <td>3</td>
            <td>58%</td>
            <td>App Team</td>
            <td><a className="link-btn" onClick={() => onNavigate('controls')}>Enable MFA →</a></td>
          </tr>
          <tr>
            <td><strong>Trading-GW-11</strong></td>
            <td>Trading Platform</td>
            <td className="num">₹22 lakh</td>
            <td><span className="badge neutral">Internal</span></td>
            <td>1</td>
            <td>81%</td>
            <td>Platform Team</td>
            <td><a className="link-btn">Review config →</a></td>
          </tr>
          <tr>
            <td><strong>Corp-VPN-EU</strong></td>
            <td>Corporate IT</td>
            <td className="num">₹19 lakh</td>
            <td><span className="badge warn">Internet-facing</span></td>
            <td>0</td>
            <td>90%</td>
            <td>IT Team</td>
            <td><span style={{ color: 'var(--sub)' }}>No action needed</span></td>
          </tr>
        </tbody>
      </table>

      <div className="callout" style={{ marginTop: '24px' }}>
        <b>Payment API-04</b> — risk contribution explanation: internet-facing, 4 unpatched critical vulnerabilities, and control coverage of only 62% on the host. Last seen 6 minutes ago via CMDB and vulnerability-scanner connectors.
      </div>
    </div>
  );
};
