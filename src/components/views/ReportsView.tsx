import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { Plus, Calendar, Download, FileText, CheckCircle2 } from 'lucide-react';
import { ReportSchedulerModal } from '../modals/ReportSchedulerModal';
import { CustomReportBuilderModal } from '../modals/CustomReportBuilderModal';
import { downloadDocumentPdf } from '../../utils/pdfGenerator';

interface ReportsViewProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenDocument: (title: string, type: string) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, description: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onNavigate, onOpenDocument, onShowToast }) => {
  const [isSchedulerOpen, setIsSchedulerOpen] = useState<boolean>(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false);

  const handleScheduleDispatch = () => {
    setIsSchedulerOpen(true);
  };

  const handleGenerateNew = () => {
    setIsBuilderOpen(true);
  };

  const handleDirectDownload = (title: string, type: string) => {
    downloadDocumentPdf({
      documentTitle: title,
      documentType: type,
      organizationName: "Acme Financial Services Limited",
      classification: "CONFIDENTIAL • BOARD ONLY",
      date: "04 September 2026",
      ledgerRef: "#COX-2026-Q3-0994"
    });
    onShowToast?.('success', 'PDF Downloaded', `Generated and downloaded "${title}" with SHA-256 seal.`);
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
            onClick={handleGenerateNew}
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
              <div className="inline-flex items-center gap-3">
                <button 
                  className="link-btn font-medium inline-flex items-center gap-1"
                  onClick={() => handleDirectDownload("Executive Cyber-Risk Report", "Executive Board Briefing")}
                  title="Direct Download PDF"
                >
                  <Download size={12} />
                  <span>PDF</span>
                </button>
                <button 
                  className="link-btn font-medium" 
                  onClick={() => onOpenDocument("Executive Cyber-Risk Report", "Executive Board Briefing")}
                >
                  Preview →
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>CISO operational posture dossier</strong></td>
            <td>Organization-wide</td>
            <td style={{ color: 'var(--sub)' }}>Yesterday</td>
            <td><span className="badge good">PDF (Signed)</span></td>
            <td style={{ textAlign: 'right' }}>
              <div className="inline-flex items-center gap-3">
                <button 
                  className="link-btn font-medium inline-flex items-center gap-1"
                  onClick={() => handleDirectDownload("CISO Operational Posture Report", "Operational Report")}
                  title="Direct Download PDF"
                >
                  <Download size={12} />
                  <span>PDF</span>
                </button>
                <button 
                  className="link-btn font-medium" 
                  onClick={() => onOpenDocument("CISO Operational Posture Report", "Operational Report")}
                >
                  Preview →
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>Investment optimization business case</strong></td>
            <td>Ransomware — Payment Processing</td>
            <td style={{ color: 'var(--sub)' }}>3 days ago</td>
            <td><span className="badge neutral">PDF, CSV</span></td>
            <td style={{ textAlign: 'right' }}>
              <div className="inline-flex items-center gap-3">
                <button 
                  className="link-btn font-medium inline-flex items-center gap-1"
                  onClick={() => handleDirectDownload("Q3 2026 Investment Recommendation Report", "Investment Plan")}
                  title="Direct Download PDF"
                >
                  <Download size={12} />
                  <span>PDF</span>
                </button>
                <button 
                  className="link-btn font-medium" 
                  onClick={() => onOpenDocument("Q3 2026 Investment Recommendation Report", "Investment Plan")}
                >
                  Preview →
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>Regulatory compliance evidence package</strong></td>
            <td>SEBI CSCRF / RBI</td>
            <td style={{ color: 'var(--sub)' }}>5 days ago</td>
            <td><span className="badge neutral">ZIP (Hashes)</span></td>
            <td style={{ textAlign: 'right' }}>
              <div className="inline-flex items-center gap-3">
                <button 
                  className="link-btn font-medium inline-flex items-center gap-1"
                  onClick={() => handleDirectDownload("SEBI CSCRF Compliance Evidence Package", "Audit Package")}
                  title="Direct Download PDF"
                >
                  <Download size={12} />
                  <span>PDF</span>
                </button>
                <button 
                  className="link-btn font-medium" 
                  onClick={() => onOpenDocument("SEBI CSCRF Compliance Evidence Package", "Audit Package")}
                >
                  Preview →
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>Vendor concentration risk assessment</strong></td>
            <td>CloudPay Processing Ltd.</td>
            <td style={{ color: 'var(--sub)' }}>9 days ago</td>
            <td><span className="badge warn">PDF (Overdue)</span></td>
            <td style={{ textAlign: 'right' }}>
              <div className="inline-flex items-center gap-3">
                <button 
                  className="link-btn font-medium inline-flex items-center gap-1"
                  onClick={() => handleDirectDownload("Vendor Risk Report: CloudPay Processing Ltd.", "Vendor Report")}
                  title="Direct Download PDF"
                >
                  <Download size={12} />
                  <span>PDF</span>
                </button>
                <button 
                  className="link-btn font-medium" 
                  onClick={() => onOpenDocument("Vendor Risk Report: CloudPay Processing Ltd.", "Vendor Report")}
                >
                  Preview →
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="callout" style={{ marginTop: '20px' }}>
        Every report includes generation timestamp, scope, data freshness, assumptions, evidence references, model version, approval history, and an estimate disclaimer.
      </div>

      {/* Report Dispatch Scheduler Modal */}
      <ReportSchedulerModal
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
        onSaveSchedule={(sched) => {
          onShowToast?.('success', 'Automated Dispatch Activated', `Scheduled "${sched.reportPackage}" to ${sched.recipients} on cadence: ${sched.frequency}.`);
        }}
      />

      {/* Custom Report Builder Modal */}
      <CustomReportBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onGenerateReport={(title, sections) => {
          onOpenDocument(title, "Custom Executive Dossier");
          onShowToast?.('success', 'Custom Report Compiled', `Generated "${title}" with ${sections.length} modular sections.`);
        }}
      />
    </div>
  );
};

