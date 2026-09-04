import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, Mail, Bell } from 'lucide-react';

interface ReportSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSchedule: (schedule: { frequency: string; recipients: string; reportPackage: string; format: string }) => void;
}

export const ReportSchedulerModal: React.FC<ReportSchedulerModalProps> = ({
  isOpen,
  onClose,
  onSaveSchedule
}) => {
  const [frequency, setFrequency] = useState<string>('Every Monday at 08:00 IST (Weekly Briefing)');
  const [reportPackage, setReportPackage] = useState<string>('Q3 2026 Executive Cyber Risk & Board Briefing');
  const [recipients, setRecipients] = useState<string>('board-risk-committee@acmefinancial.com, ciso@acmefinancial.com');
  const [format, setFormat] = useState<string>('Encrypted PDF + Interactive Portal Link');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSchedule({ frequency, recipients, reportPackage, format });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-ledger/10 text-ledger border border-ledger/20">
              <Calendar size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Schedule Automated Report Dispatch</h2>
              <p className="text-xs text-sub m-0">Recurring Board & Executive Governance Briefings</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Target Report Package</label>
            <select
              value={reportPackage}
              onChange={(e) => setReportPackage(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
            >
              <option value="Q3 2026 Executive Cyber Risk & Board Briefing">Q3 2026 Executive Cyber Risk & Board Briefing</option>
              <option value="Q3 2026 Capital Allocation & Security Knapsack Plan">Q3 2026 Capital Allocation & Security Knapsack Plan</option>
              <option value="SEBI CSCRF Regulatory Readiness Statement">SEBI CSCRF Regulatory Readiness Statement</option>
              <option value="Supply Chain & Third-Party Exposure Dossier">Supply Chain & Third-Party Exposure Dossier</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Dispatch Cadence & Schedule</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
            >
              <option value="Every Monday at 08:00 IST (Weekly Briefing)">Every Monday at 08:00 IST (Weekly Briefing)</option>
              <option value="1st of Every Month at 09:00 IST (Monthly Executive Summary)">1st of Every Month at 09:00 IST (Monthly Executive Summary)</option>
              <option value="Quarterly Board Cycle (Pre-Audit Pack)">Quarterly Board Cycle (Pre-Audit Pack)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Distribution List (Comma-separated emails)</label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Export Security Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
            >
              <option value="Encrypted PDF + Interactive Portal Link">Encrypted PDF + Interactive Portal Link</option>
              <option value="Cryptographic SHA-256 PDF Only">Cryptographic SHA-256 PDF Only</option>
              <option value="JSON Payload to SIEM / GRC Webhook">JSON Payload to SIEM / GRC Webhook</option>
            </select>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-line flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-sub hover:text-ink rounded border border-line hover:bg-paper transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-ledger hover:bg-ledger/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Calendar size={13} />
              <span>Activate Recurring Schedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
