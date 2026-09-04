import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, ShieldCheck, FileCheck, ArrowRight } from 'lucide-react';

interface ExecutiveSignOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalCost: number;
  riskReduced: number;
  roiPct: number;
  onConfirmSignOff: (signData: { approver: string; costCenter: string; comments: string }) => void;
}

export const ExecutiveSignOffModal: React.FC<ExecutiveSignOffModalProps> = ({
  isOpen,
  onClose,
  totalCost,
  riskReduced,
  roiPct,
  onConfirmSignOff
}) => {
  const [approver, setApprover] = useState<string>('Chief Information Security Officer (CISO)');
  const [costCenter, setCostCenter] = useState<string>('CC-4019 (Enterprise Technology & Security Capital)');
  const [comments, setComments] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setComments(
        `Approved based on the constrained portfolio recommendation: ₹${(riskReduced / 10000000).toFixed(2)} Cr expected risk reduction from ₹${(totalCost / 100000).toFixed(0)} Lakh capital, with ${roiPct}% risk-reduction ROI.`
      );
    }
  }, [isOpen, riskReduced, roiPct, totalCost]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmSignOff({ approver, costCenter, comments });
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-xl rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-teal/10 text-teal border border-teal/20">
              <FileCheck size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Executive Capital Sign-Off Requisition</h2>
              <p className="text-xs text-sub m-0">Board Risk Committee Authorization & Digital Seal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center p-3.5 rounded bg-ink text-white">
            <div>
              <div className="text-[10.5px] text-slate-300">Committed Capital</div>
              <div className="text-sm font-bold text-teal mt-0.5">₹{(totalCost / 100000).toFixed(0)} Lakh</div>
            </div>
            <div>
              <div className="text-[10.5px] text-slate-300">Expected Risk Reduced</div>
              <div className="text-sm font-bold text-white mt-0.5">₹{(riskReduced / 10000000).toFixed(2)} Cr</div>
            </div>
            <div>
              <div className="text-[10.5px] text-slate-300">Portfolio ROI</div>
              <div className="text-sm font-bold text-teal mt-0.5">{roiPct}%</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Executive Sign-Off Authority</label>
            <select
              value={approver}
              onChange={(e) => setApprover(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
            >
              <option value="Chief Information Security Officer (CISO)">Chief Information Security Officer (CISO)</option>
              <option value="Chief Financial Officer & Chief Risk Officer (CFO/CRO)">Chief Financial Officer & Chief Risk Officer (CFO/CRO)</option>
              <option value="Board Risk Committee (Delegated Chair)">Board Risk Committee (Delegated Chair)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Corporate Cost Center & Budget Code</label>
            <input
              type="text"
              value={costCenter}
              onChange={(e) => setCostCenter(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Approval Comments & Governance Rationale</label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
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
              className="px-5 py-2 text-xs font-semibold text-white bg-teal hover:bg-teal/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ShieldCheck size={14} />
              <span>{isSubmitting ? 'Signing Requisition...' : 'Digitally Sign & Authorize Budget'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
