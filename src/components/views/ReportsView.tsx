import React from 'react';
import { NavigationPage } from '../../types';

interface ReportsViewProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenDocument: (title: string, type: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onNavigate, onOpenDocument }) => {
  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Reports</div>
          <h1>Reports</h1>
        </div>
        <div className="masthead-actions">
          <button 
            className="btn primary"
            onClick={() => onOpenDocument("Custom Q3 2026 Enterprise Risk Briefing", "Executive Report")}
          >
            New report
          </button>
        </div>
      </div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Report</th>
            <th>Scope</th>
            <th>Generated</th>
            <th>Format</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Executive cyber-risk report</strong></td>
            <td>Organization-wide</td>
            <td style={{ color: 'var(--sub)' }}>Today, 07:40</td>
            <td>PDF</td>
            <td style={{ textAlign: 'right' }}>
              <a 
                className="link-btn" 
                onClick={() => onOpenDocument("Executive Cyber-Risk Report", "Executive Board Briefing")}
              >
                Download →
              </a>
            </td>
          </tr>
          <tr>
            <td><strong>CISO operational report</strong></td>
            <td>Organization-wide</td>
            <td style={{ color: 'var(--sub)' }}>Yesterday</td>
            <td>PDF</td>
            <td style={{ textAlign: 'right' }}>
              <a 
                className="link-btn" 
                onClick={() => onOpenDocument("CISO Operational Posture Report", "Operational Report")}
              >
                Download →
              </a>
            </td>
          </tr>
          <tr>
            <td><strong>Investment recommendation report</strong></td>
            <td>Ransomware — Payment Processing</td>
            <td style={{ color: 'var(--sub)' }}>3 days ago</td>
            <td>PDF, CSV</td>
            <td style={{ textAlign: 'right' }}>
              <a 
                className="link-btn" 
                onClick={() => onOpenDocument("Q3 2026 Investment Recommendation Report", "Investment Plan")}
              >
                Download →
              </a>
            </td>
          </tr>
          <tr>
            <td><strong>Compliance evidence package</strong></td>
            <td>SEBI CSCRF</td>
            <td style={{ color: 'var(--sub)' }}>5 days ago</td>
            <td>ZIP</td>
            <td style={{ textAlign: 'right' }}>
              <a 
                className="link-btn" 
                onClick={() => onOpenDocument("SEBI CSCRF Compliance Evidence Package", "Audit Package")}
              >
                Download →
              </a>
            </td>
          </tr>
          <tr>
            <td><strong>Vendor-risk report</strong></td>
            <td>CloudPay Processing Ltd.</td>
            <td style={{ color: 'var(--sub)' }}>9 days ago</td>
            <td>PDF</td>
            <td style={{ textAlign: 'right' }}>
              <a 
                className="link-btn" 
                onClick={() => onOpenDocument("Vendor Risk Report: CloudPay Processing Ltd.", "Vendor Report")}
              >
                Download →
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="callout" style={{ marginTop: '20px' }}>
        Every report includes generation timestamp, scope, data freshness, assumptions, evidence references, model version, approval history, and an estimate disclaimer.
      </div>
    </div>
  );
};
