import React, { useState } from 'react';
import { X, ShieldCheck, Download, Calculator, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface InsuranceQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarioName: string;
  expectedAnnualLoss: string;
  p95Loss: string;
  onConfirmTransfer: (details: { policyLimit: string; deductible: string; premium: string; underwriter: string }) => void;
}

export const InsuranceQuoteModal: React.FC<InsuranceQuoteModalProps> = ({
  isOpen,
  onClose,
  scenarioName,
  expectedAnnualLoss,
  p95Loss,
  onConfirmTransfer
}) => {
  const [coverageLimit, setCoverageLimit] = useState<number>(100000000); // ₹10 Cr
  const [deductible, setDeductible] = useState<number>(5000000); // ₹50 Lakh
  const [underwriter, setUnderwriter] = useState<string>('Munich Re / ICICI Lombard Cyber Consortium');
  const [hasRansomwareExclusion, setHasRansomwareExclusion] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  // Premium calculation based on FAIR exposure and deductible
  const calculatedPremium = Math.round((coverageLimit * 0.022) - (deductible * 0.04));
  const residualUninsuredLoss = Math.max(0, 184000000 - coverageLimit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmTransfer({
        policyLimit: `₹${(coverageLimit / 10000000).toFixed(1)} Crore`,
        deductible: `₹${(deductible / 100000).toFixed(0)} Lakh`,
        premium: `₹${(calculatedPremium / 100000).toFixed(1)} Lakh / yr`,
        underwriter
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-2xl rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-teal/10 text-teal border border-teal/20">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Cyber Insurance & Risk Transfer Portal</h2>
              <p className="text-xs text-sub m-0">FAIR Underwriting Quote & Policy Binder Calculator</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Target Scenario Overview */}
          <div className="p-3.5 rounded bg-paper border border-line flex items-center justify-between">
            <div>
              <div className="text-[11px] text-sub uppercase font-semibold">Target Scenario</div>
              <div className="text-sm font-semibold text-ink">{scenarioName}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-sub">Estimated P95 Loss</div>
              <div className="text-sm font-bold text-crimson">{p95Loss}</div>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-text mb-1">
                <span>Coverage Policy Limit</span>
                <span className="text-ledger font-bold">₹{(coverageLimit / 10000000).toFixed(1)} Crore</span>
              </div>
              <input 
                type="range" 
                min="20000000" 
                max="250000000" 
                step="10000000"
                value={coverageLimit}
                onChange={(e) => setCoverageLimit(Number(e.target.value))}
                className="w-full accent-ledger"
              />
              <div className="flex justify-between text-[10.5px] text-sub mt-1">
                <span>Min: ₹2.0 Cr</span>
                <span>Max: ₹25.0 Cr</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-text mb-1">
                <span>Self-Insured Retention (Deductible)</span>
                <span className="text-amber font-bold">₹{(deductible / 100000).toFixed(0)} Lakh</span>
              </div>
              <input 
                type="range" 
                min="1000000" 
                max="20000000" 
                step="1000000"
                value={deductible}
                onChange={(e) => setDeductible(Number(e.target.value))}
                className="w-full accent-amber"
              />
              <div className="flex justify-between text-[10.5px] text-sub mt-1">
                <span>Min: ₹10 Lakh</span>
                <span>Max: ₹2.0 Cr</span>
              </div>
            </div>
          </div>

          {/* Underwriter Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Syndicate / Underwriting Carrier</label>
              <select 
                value={underwriter}
                onChange={(e) => setUnderwriter(e.target.value)}
                className="w-full text-xs p-2 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              >
                <option value="Munich Re / ICICI Lombard Cyber Consortium">Munich Re / ICICI Lombard</option>
                <option value="Lloyds of London Specialty Syndicate 2003">Lloyd's of London (Syndicate 2003)</option>
                <option value="AIG CyberEdge Global">AIG CyberEdge Global</option>
                <option value="Tata AIG Comprehensive Cyber Security">Tata AIG Cyber Corporate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Policy Structure & Endorsement</label>
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="ransomwareExclusion"
                  checked={hasRansomwareExclusion}
                  onChange={(e) => setHasRansomwareExclusion(e.target.checked)}
                  className="rounded border-line text-ledger focus:ring-0"
                />
                <label htmlFor="ransomwareExclusion" className="text-xs text-text cursor-pointer">
                  Includes Extortion & Regulatory Fines Sub-limit
                </label>
              </div>
            </div>
          </div>

          {/* Policy Calculation Summary */}
          <div className="p-4 rounded-lg bg-ink text-white space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-teal">Actuarial Quotation Summary</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded bg-white/5 border border-white/10">
                <div className="text-[10.5px] text-slate-300">Estimated Annual Premium</div>
                <div className="text-sm font-bold text-teal mt-0.5">₹{(calculatedPremium / 100000).toFixed(1)} L / yr</div>
              </div>
              <div className="p-2 rounded bg-white/5 border border-white/10">
                <div className="text-[10.5px] text-slate-300">Transferred Risk</div>
                <div className="text-sm font-bold text-white mt-0.5">₹{(coverageLimit / 10000000).toFixed(1)} Cr</div>
              </div>
              <div className="p-2 rounded bg-white/5 border border-white/10">
                <div className="text-[10.5px] text-slate-300">Uninsured Gap</div>
                <div className="text-sm font-bold text-amber mt-0.5">₹{(residualUninsuredLoss / 10000000).toFixed(1)} Cr</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              * Based on automated FAIR quantification. Underwriting requires cryptographic evidence package verification (NIST CSF & MFA logs).
            </div>
          </div>

          {/* Footer Buttons */}
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
              {isSubmitting ? (
                <span>Binding Policy...</span>
              ) : (
                <>
                  <span>Bind Policy & Transfer Risk</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
