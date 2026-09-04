import React, { useState } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

interface VendorAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  onSendAssessment: (standard: string, deadline: string, recipient: string) => void;
}

export const VendorAssessmentModal: React.FC<VendorAssessmentModalProps> = ({
  isOpen,
  onClose,
  vendorName,
  onSendAssessment
}) => {
  const [standard, setStandard] = useState<string>('Standard Information Gathering (SIG Lite 2026)');
  const [deadline, setDeadline] = useState<string>('14 Days (Standard turnaround)');
  const [recipient, setRecipient] = useState<string>('security-compliance@vendor.com');
  const [isSending, setIsSending] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onSendAssessment(standard, deadline, recipient);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-ledger/10 text-ledger border border-ledger/20">
              <Mail size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Security Assessment Dispatcher</h2>
              <p className="text-xs text-sub m-0">{vendorName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Assessment Standard / Questionnaire</label>
            <select
              value={standard}
              onChange={(e) => setStandard(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
            >
              <option value="Standard Information Gathering (SIG Lite 2026)">Standard Information Gathering (SIG Lite 2026)</option>
              <option value="Cloud Security Alliance CAIQ v4">Cloud Security Alliance (CSA CAIQ v4)</option>
              <option value="SEBI CSCRF Vendor Security Mandate">SEBI CSCRF Vendor Security Schedule</option>
              <option value="SOC 2 Type II Bridge & PenTest Request">SOC 2 Type II Bridge & PenTest Request</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Vendor Security Contact Email</label>
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Response Due Date</label>
            <select
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
            >
              <option value="7 Days (Expedited P1 audit)">7 Days (Expedited P1 audit)</option>
              <option value="14 Days (Standard turnaround)">14 Days (Standard turnaround)</option>
              <option value="30 Days (Annual re-certification)">30 Days (Annual re-certification)</option>
            </select>
          </div>

          <div className="p-3 rounded bg-teal/5 border border-teal/20 text-xs text-sub">
            ✓ Vendor will receive a cryptographic portal magic link to securely upload SOC 2 Type II artifacts, ISO certifications, and architecture diagrams.
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
              disabled={isSending}
              className="px-5 py-2 text-xs font-semibold text-white bg-ledger hover:bg-ledger/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Send size={13} />
              <span>{isSending ? 'Sending Request...' : 'Send Assessment Magic Link'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
