import React from 'react';
import { X, Printer, Download, CheckCircle2, Shield, Lock, FileText, QrCode } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  documentType?: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentTitle = "Q3 2026 Board Cyber Risk Quantification & Investment Dossier",
  documentType = "Executive Board Briefing"
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[92vh] bg-card rounded-lg border border-line shadow-2xl flex flex-col overflow-hidden text-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Toolbar Header */}
        <div className="px-6 py-3.5 border-b border-line flex items-center justify-between bg-paper/60 backdrop-blur-xs">
          <div className="flex items-center gap-2.5">
            <FileText size={18} className="text-ledger" />
            <span className="font-semibold text-sm text-ink">
              Document Preview: {documentType}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded border border-line bg-card hover:bg-paper text-ink transition-colors cursor-pointer shadow-xs"
              onClick={() => window.print()}
            >
              <Printer size={13} />
              <span>Print Document</span>
            </button>
            <button 
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded border border-ink bg-ink hover:bg-slate-900 text-white transition-colors cursor-pointer shadow-xs"
              onClick={() => {
                alert(`Downloaded ${documentTitle} (PDF with Cryptographic Seal).`);
                onClose();
              }}
            >
              <Download size={13} />
              <span>Download PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded text-sub hover:text-text hover:bg-paper cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Document Body (Printable Paper Canvas) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-100">
          <div className="max-w-2xl mx-auto p-8 md:p-12 font-sans bg-white text-slate-900 shadow-xl rounded border border-slate-200">
            {/* Header with Organization and Classification */}
            <div className="flex justify-between items-start border-b-2 border-ink pb-5 mb-6">
              <div>
                <div className="text-[11px] font-bold tracking-widest text-ledger uppercase">
                  CyberOptix Enterprise Risk Intelligence
                </div>
                <h1 className="text-xl font-bold font-serif text-ink mt-1">
                  Acme Financial Services Limited
                </h1>
                <div className="text-xs text-sub mt-0.5">
                  Board Risk Committee • Executive Financial Cyber Risk Briefing
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-crimson rounded border border-red-200 inline-block">
                  CONFIDENTIAL • BOARD ONLY
                </span>
                <div className="text-[11px] text-sub mt-1.5 font-mono">
                  Date: 03 September 2026
                </div>
                <div className="text-[11px] text-sub font-mono">
                  Ledger Ref: #COX-2026-Q3-0994
                </div>
              </div>
            </div>

            {/* Executive Summary Block */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-ink mb-2 border-b border-line pb-1">
                1. Executive Summary & Financial Exposure
              </h2>
              <p className="text-[13px] text-slate-700 leading-relaxed">
                As of Q3 2026, Acme Financial Services' total aggregate Value-at-Risk (VaR 95%) is estimated at <strong className="text-crimson font-serif">₹18.40 Crore</strong>, which currently exceeds the Board Risk Tolerance Limit of <strong className="font-serif text-ink">₹10.00 Crore</strong>. The Expected Annual Loss (EAL) is <strong className="font-serif text-crimson">₹8.60 Crore</strong>, driven primarily by payment settlement disruption vectors and administrative credential exposure.
              </p>
            </div>

            {/* Financial Risk Summary Table */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-ink mb-2 border-b border-line pb-1">
                2. Quantified Exposure by Core Business Service
              </h2>
              <table className="w-full border-collapse text-xs text-left mt-2">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-300 text-slate-600 font-semibold">
                    <th className="p-2">Business Service</th>
                    <th className="p-2">Expected Yearly Loss</th>
                    <th className="p-2">95th-Percentile Loss</th>
                    <th className="p-2">Tolerance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 font-medium">Payment Processing (UPI & NetBanking)</td>
                    <td className="p-2 font-serif font-bold text-crimson">₹4.20 Crore</td>
                    <td className="p-2 font-serif">₹13.80 Crore</td>
                    <td className="p-2 text-crimson font-semibold">Above Tolerance</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Customer KYC & Account Vault</td>
                    <td className="p-2 font-serif font-bold text-crimson">₹3.60 Crore</td>
                    <td className="p-2 font-serif">₹9.40 Crore</td>
                    <td className="p-2 text-crimson font-semibold">Above Tolerance</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Algorithmic Trading & Settlement</td>
                    <td className="p-2 font-serif font-bold text-crimson">₹2.80 Crore</td>
                    <td className="p-2 font-serif">₹7.20 Crore</td>
                    <td className="p-2 text-crimson font-semibold">Above Tolerance</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recommended Investment Package */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-ink mb-2 border-b border-line pb-1">
                3. Recommended Security Capital Allocation (₹70 Lakh Portfolio)
              </h2>
              <p className="text-[13px] text-slate-700 leading-relaxed mb-3">
                The Mixed-Integer Linear Programming (MIP) optimization solver prescribes a targeted ₹70.0 Lakh capital commitment across three controls to bring overall enterprise exposure below board tolerance:
              </p>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 leading-relaxed">
                <div className="font-bold mb-1">Approved Mitigation Bundle:</div>
                <ul className="pl-4 space-y-1 list-disc">
                  <li><strong>FIDO2 Hardware Keys (₹25L):</strong> Eliminates SMS credential bypass (Risk Reduced: ₹1.40 Cr)</li>
                  <li><strong>Air-Gapped Immutable Backups (₹35L):</strong> Guarantees 2-hour RTO (Risk Reduced: ₹1.10 Cr)</li>
                  <li><strong>Automated Recovery Drills (₹10L):</strong> Validates quarterly restore (Risk Reduced: ₹60 Lakh)</li>
                </ul>
                <div className="mt-2.5 pt-2 border-t border-emerald-200 font-bold text-emerald-950 flex justify-between">
                  <span>Total Risk Reduced: ₹2.10 Crore</span>
                  <span>Illustrative ROI: 200% (3.0x Capital Multiplier)</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Verification Seal & Signatures */}
            <div className="flex justify-between items-center border-t-2 border-ink pt-4 mt-6">
              <div>
                <div className="flex items-center gap-1.5 text-teal font-bold text-xs">
                  <CheckCircle2 size={15} />
                  <span>SHA-256 Cryptographic Tamper-Evident Seal Verified</span>
                </div>
                <div className="font-mono text-[10px] text-sub mt-0.5">
                  HASH: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-ink">
                  Authorized Signoff:
                </div>
                <div className="text-xs italic text-slate-600 mt-0.5">
                  CISO & CFO Risk Committee
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

