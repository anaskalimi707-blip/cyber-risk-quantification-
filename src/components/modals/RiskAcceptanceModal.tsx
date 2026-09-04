import React, { useState } from 'react';
import { X, FileWarning, CheckCircle2, ShieldAlert, Calendar, ArrowRight } from 'lucide-react';

interface RiskAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarioName: string;
  expectedAnnualLoss: string;
  onConfirmAcceptance: (data: { reason: string; durationDays: number; compensatingControls: string; approver: string }) => void;
}

export const RiskAcceptanceModal: React.FC<RiskAcceptanceModalProps> = ({
  isOpen,
  onClose,
  scenarioName,
  expectedAnnualLoss,
  onConfirmAcceptance
}) => {
  const [reason, setReason] = useState<string>('Legacy ERP migration scheduled for Q1 2027 makes refactoring existing telemetry economically non-viable.');
  const [durationDays, setDurationDays] = useState<number>(90);
  const [compensatingControls, setCompensatingControls] = useState<string>('Enforced 24/7 dedicated SOC watchlist alert + egress rate-limiting on gateway.');
  const [approver, setApprover] = useState<string>('CISO (Board Risk Committee Delegate)');
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acknowledged) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmAcceptance({
        reason,
        durationDays,
        compensatingControls,
        approver
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-xl rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-amber/10 text-amber border border-amber/20">
              <FileWarning size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Board Risk Acceptance & Exception Logging</h2>
              <p className="text-xs text-sub m-0">Cryptographic Exception Ledger Entry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="p-3 rounded bg-crimson/5 border border-crimson/20 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-crimson uppercase font-semibold">Accepted Financial Exposure</div>
              <div className="text-sm font-semibold text-ink">{scenarioName}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-crimson">{expectedAnnualLoss} / yr</div>
              <div className="text-[10px] text-sub">Above Tolerance Limit</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Business Justification & Rationale</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Exception Duration</label>
              <select 
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full text-xs p-2 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              >
                <option value={30}>30 Days (Short-term grace)</option>
                <option value={60}>60 Days (Interim patch window)</option>
                <option value={90}>90 Days (Quarterly board review)</option>
                <option value={180}>180 Days (Semi-annual limit)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Authorized Approver</label>
              <input 
                type="text"
                value={approver}
                onChange={(e) => setApprover(e.target.value)}
                className="w-full text-xs p-2 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Compensating Defensive Controls</label>
            <input 
              type="text"
              value={compensatingControls}
              onChange={(e) => setCompensatingControls(e.target.value)}
              className="w-full text-xs p-2 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              placeholder="e.g. Additional micro-segmentation, heightened EDR scrutiny..."
              required
            />
          </div>

          <div className="p-3 rounded bg-paper border border-line flex items-start gap-2.5">
            <input 
              type="checkbox"
              id="ackRisk"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 rounded border-line text-ink focus:ring-0"
              required
            />
            <label htmlFor="ackRisk" className="text-xs text-sub leading-snug cursor-pointer select-none">
              I acknowledge that this exception will be logged to the SEBI/NIST regulatory audit trail with an immutable SHA-256 seal and will trigger a mandatory re-assessment upon expiration.
            </label>
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
              disabled={!acknowledged || isSubmitting}
              className={`px-5 py-2 text-xs font-semibold text-white rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                acknowledged && !isSubmitting ? 'bg-amber hover:bg-amber/90' : 'bg-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Logging Exception...' : 'Sign & Log Risk Exception'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
