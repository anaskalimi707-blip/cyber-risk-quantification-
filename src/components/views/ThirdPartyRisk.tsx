import React from 'react';
import { NavigationPage } from '../../types';

interface ThirdPartyRiskProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ThirdPartyRisk: React.FC<ThirdPartyRiskProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Third-Party Risk</div>
          <h1>Vendors</h1>
          <div className="period">Supply chain exposure and evidence freshness</div>
        </div>
        <div className="masthead-actions">
          <button className="btn">Add vendor</button>
        </div>
      </div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Criticality</th>
            <th>Inherent risk</th>
            <th>External score</th>
            <th>Evidence</th>
            <th>Risk contribution</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>CloudPay Processing Ltd.</strong></td>
            <td><span className="badge crit">Critical</span></td>
            <td>High</td>
            <td>62 / 100</td>
            <td><span className="badge crit">Stale · 214 days</span></td>
            <td className="num">₹64 lakh</td>
            <td style={{ textAlign: 'right' }}>
              <a className="link-btn" onClick={() => alert('Assessment requested from CloudPay Processing Ltd.')}>
                Request assessment →
              </a>
            </td>
          </tr>
          <tr>
            <td><strong>SecureID Auth Services</strong></td>
            <td><span className="badge warn">High</span></td>
            <td>Medium</td>
            <td>78 / 100</td>
            <td><span className="badge good">Fresh</span></td>
            <td className="num">₹21 lakh</td>
            <td style={{ textAlign: 'right' }}>
              <a className="link-btn">Review evidence →</a>
            </td>
          </tr>
          <tr>
            <td><strong>DataVault Storage Inc.</strong></td>
            <td><span className="badge neutral">Medium</span></td>
            <td>Medium</td>
            <td>81 / 100</td>
            <td><span className="badge good">Fresh</span></td>
            <td className="num">₹12 lakh</td>
            <td style={{ textAlign: 'right' }}>
              <a className="link-btn">Send questionnaire →</a>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="callout crimson" style={{ marginTop: '22px' }}>
        <b>CloudPay Processing Ltd.</b> — assessment overdue. This vendor is a critical supplier to Payment Processing; contract requires annual reassessment.
      </div>
    </div>
  );
};
