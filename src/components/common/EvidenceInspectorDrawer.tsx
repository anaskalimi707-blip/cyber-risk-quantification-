import React from 'react';
import { X, ShieldCheck, Copy, Check, ExternalLink, Database, Server } from 'lucide-react';

interface EvidenceRecord {
  id: string;
  source: string;
  timestamp: string;
  hash: string;
  description: string;
  rawPayload: any;
}

interface EvidenceInspectorDrawerProps {
  evidence: EvidenceRecord | null;
  onClose: () => void;
}

export const EvidenceInspectorDrawer: React.FC<EvidenceInspectorDrawerProps> = ({
  evidence,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!evidence) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(evidence.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex justify-end animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg h-screen bg-card border-l border-line shadow-2xl p-6 flex flex-col justify-between z-60 animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-teal" />
              <span className="font-bold text-base text-ink">
                Evidence Verifier & Audit Proof
              </span>
            </div>
            <button 
              onClick={onClose} 
              className="p-1 text-sub hover:text-text rounded cursor-pointer transition-colors"
              aria-label="Close drawer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Source and Verification Badge */}
          <div className="p-4 rounded-md bg-paper border border-line mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bold text-sm text-ink">{evidence.source}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-teal/15 text-teal border border-teal/30">
                ✓ Cryptographically Verified
              </span>
            </div>
            <div className="text-xs text-sub font-mono">
              Collected: {evidence.timestamp}
            </div>
            <div className="text-[13px] text-text mt-2 font-normal leading-relaxed">
              {evidence.description}
            </div>
          </div>

          {/* Cryptographic SHA-256 Hash Box */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-sub uppercase tracking-wider">
                SHA-256 Content Digest
              </span>
              <button 
                onClick={handleCopyHash}
                className="text-ledger hover:text-ink text-xs font-medium cursor-pointer flex items-center gap-1 transition-colors"
              >
                {copied ? <Check size={12} className="text-teal" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy Hash'}</span>
              </button>
            </div>
            <div className="p-2.5 rounded bg-slate-900 font-mono text-xs text-teal break-all border border-slate-800 shadow-inner select-all">
              {evidence.hash}
            </div>
          </div>

          {/* Raw Ingestion Payload Inspector */}
          <div>
            <div className="text-xs font-semibold text-sub uppercase tracking-wider mb-1.5">
              Raw Ingestion JSON Telemetry
            </div>
            <pre className="p-3.5 rounded-md bg-slate-950 text-cyan-400 font-mono text-xs max-h-72 overflow-y-auto leading-relaxed border border-slate-800 shadow-inner">
              {JSON.stringify(evidence.rawPayload, null, 2)}
            </pre>
          </div>
        </div>

        <div className="pt-4 border-t border-line">
          <button 
            className="w-full py-2 px-4 rounded border border-line bg-paper hover:bg-card text-ink text-sm font-medium transition-colors cursor-pointer shadow-xs"
            onClick={onClose}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

