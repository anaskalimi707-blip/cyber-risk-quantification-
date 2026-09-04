import React from 'react';
import { NavigationPage } from '../../types';
import { Plus, Calendar, Download, FileText, CheckCircle2 } from 'lucide-react';

interface ReportsViewProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenDocument: (title: string, type: string) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, description: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onNavigate, onOpenDocument, onShowToast }) => {
  const handleScheduleDispatch = () => {
    onShowToast?.('success', 'Automated Dispatch Configured', 'Recurring weekly executive risk briefing scheduled for every Monday at 08:00 AM IST to Board Members.');
  };

  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Reports &amp; Dossiers</div>
          <h1>Executive Reports &amp; Board Briefings</h1>
          <div className="period">Cryptographically sealed financial risk statements ready for board meetings</div>
        </div>
        <div className="masthead-actions flex items-center gap-2">
          <button className="btn" onClick={handleScheduleDispatch}>
            <Calendar size={13} />
            <span>Schedule Dispatch</span>
          </button>
          <button 
            className="btn primary"
            onClick={() => {
              onOpenDocument("Custom Q3 2026 Enterprise Risk Briefing", "Executive Report");
              onShowToast?.('info', 'Report Generator', 'Compiled custom executive dossier with latest FAIR distributions.');
            }}
          >
            <Plus size={13} />
            <span>Generate New Report</span>
          </button>
        </div>
      </div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Report Dossier</th>
            <th>Scope</th>
            <th>Generated</th>
            <th>Format</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Executive cyber-risk statement</strong></td>
            <td>Organization-wide</td>
            <td style={{ color: 'var(--sub)' }}>Today, 07:40</td>
            <td><span className="badge good">PDF (Signed)</span></td>
            <td style={{ textAlign: 'right' }}>
              <button 
                className="link-btn font-medium" 
                onClick={() => onOpenDocument("Executive Cyber-Risk Report", "Executive Board Briefing")}
              >
                Preview &amp; Download →
              </button>
            </td>
          </tr>
          <tr>
            <td><strong>CISO operational posture dossier</strong></td>
            <td>Organization-wide</td>
            <td style={{ color: 'var(--sub)' }}>Yesterday</td>
            <td><span className="badge good">PDF (Signed)</span></td>
            <td style={{ textAlign: 'right' }}>
              <button 
                className="link-btn font-medium" 
                onClick={() => onOpenDocument("CISO Operational Posture Report", "Operational Report")}
              >
                Preview &amp; Download →
              </button>
            </td>
          </tr>
          <tr>
            <td><strong>Investment optimization business case</strong></td>
            <td>Ransomware — Payment Processing</td>
            <td style={{ color: 'var(--sub)' }}>3 days ago</td>
            <td><span className="badge neutral">PDF, CSV</span></td>
            <td style={{ textAlign: 'right' }}>
              <button 
                className="link-btn font-medium" 
                onClick={() => onOpenDocument("Q3 2026 Investment Recommendation Report", "Investment Plan")}
              >
                Preview &amp; Download →
              </button>
            </td>
          </tr>
          <tr>
            <td><strong>Regulatory compliance evidence package</strong></td>
            <td>SEBI CSCRF / RBI</td>
            <td style={{ color: 'var(--sub)' }}>5 days ago</td>
            <td><span className="badge neutral">ZIP (Hashes)</span></td>
            <td style={{ textAlign: 'right' }}>
              <button 
                className="link-btn font-medium" 
                onClick={() => onOpenDocument("SEBI CSCRF Compliance Evidence Package", "Audit Package")}
              >
                Preview &amp; Download →
              </button>
            </td>
          </tr>
          <tr>
            <td><strong>Vendor concentration risk assessment</strong></td>
            <td>CloudPay Processing Ltd.</td>
            <td style={{ color: 'var(--sub)' }}>9 days ago</td>
            <td><span className="badge warn">PDF (Overdue)</span></td>
            <td style={{ textAlign: 'right' }}>
              <button 
                className="link-btn font-medium" 
                onClick={() => onOpenDocument("Vendor Risk Report: CloudPay Processing Ltd.", "Vendor Report")}
              >
                Preview &amp; Download →
              </button>
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

