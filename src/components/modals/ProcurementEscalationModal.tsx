import React, { useState } from 'react';
import { X, AlertTriangle, FileWarning, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ProcurementEscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  onConfirmEscalation: (escalationType: string, noticeText: string) => void;
}

export const ProcurementEscalationModal: React.FC<ProcurementEscalationModalProps> = ({
  isOpen,
  onClose,
  vendorName,
  onConfirmEscalation
}) => {
  const [escalationType, setEscalationType] = useState<string>('Contract Renewal Hold (SLA Security Breach)');
  const [noticeText, setNoticeText] = useState<string>('Vendor has exceeded the 90-day evidence freshness window for SOC 2 Type II audit. Payment terms subject to security escrow.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmEscalation(escalationType, noticeText);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-crimson/10 text-crimson border border-crimson/20">
              <FileWarning size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Procurement & Legal Escalation</h2>
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
            <label className="block text-xs font-semibold text-text mb-1">Escalation Action Level</label>
            <select
              value={escalationType}
              onChange={(e) => setEscalationType(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
            >
              <option value="Contract Renewal Hold (SLA Security Breach)">Contract Renewal Hold (SLA Security Breach)</option>
              <option value="Payment Milestone Freeze (Pending Evidence)">Payment Milestone Freeze (Pending Evidence)</option>
              <option value="Formal Breach of Security Warranty Notice">Formal Breach of Security Warranty Notice</option>
              <option value="Immediate Vendor Offboarding Initiation">Immediate Vendor Offboarding Initiation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Legal / Procurement Notice Brief</label>
            <textarea
              rows={3}
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div className="p-3 rounded bg-crimson/5 border border-crimson/20 text-xs text-sub">
            ⚠️ This will notify Enterprise Legal, Head of Procurement, and the CISO, attaching the FAIR risk exposure calculation of ₹1.80 Cr.
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
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-crimson hover:bg-crimson/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <AlertTriangle size={14} />
              <span>{isSubmitting ? 'Escalating...' : 'Issue Procurement Escalation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
