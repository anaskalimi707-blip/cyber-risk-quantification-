import React from 'react';
import { X, FileCode, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface ConfigDriftModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetName: string;
  onRemediateDrift: () => void;
}

export const ConfigDriftModal: React.FC<ConfigDriftModalProps> = ({
  isOpen,
  onClose,
  assetName,
  onRemediateDrift
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-2xl rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-ledger/10 text-ledger border border-ledger/20">
              <FileCode size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Infrastructure Drift & CIS Benchmark Inspection</h2>
              <p className="text-xs text-sub m-0">Terraform State vs Live Cloud Baseline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="p-3 rounded bg-paper border border-line flex items-center justify-between">
            <div>
              <div className="text-[11px] text-sub uppercase font-semibold">Inspected Asset</div>
              <div className="text-sm font-bold text-ink">{assetName}</div>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-crimson/10 text-crimson border border-crimson/20">
              2 Non-Compliant Rules
            </span>
          </div>

          <div>
            <div className="text-xs font-semibold text-text mb-1.5">Terraform HCL State Drift Diff:</div>
            <div className="p-3 rounded bg-[#0A192F] text-slate-200 font-mono text-[11.5px] leading-relaxed overflow-x-auto border border-white/10">
              <div className="text-slate-400"># main.tf (Security Group Configuration)</div>
              <div className="text-emerald-400 font-medium">+ ingress {'{'}</div>
              <div className="text-emerald-400 font-medium">+   description = "Disallow public 0.0.0.0/0 inbound"</div>
              <div className="text-emerald-400 font-medium">+   cidr_blocks = ["10.240.0.0/16"] # Corporate VPC Only</div>
              <div className="text-emerald-400 font-medium">+ {'}'}</div>
              <div className="text-rose-400 font-medium">- ingress {'{'}</div>
              <div className="text-rose-400 font-medium">-   cidr_blocks = ["0.0.0.0/0"] # DRIFT DETECTED: Port 5432 Exposed</div>
              <div className="text-rose-400 font-medium">- {'}'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded bg-paper border border-line">
              <div className="text-[11px] text-sub">CIS Benchmark Rule</div>
              <div className="text-xs font-semibold text-ink mt-0.5">CIS AWS 1.4 - 5.1 Ensure no SG allows ingress from 0.0.0.0/0 to port 5432</div>
            </div>
            <div className="p-3 rounded bg-paper border border-line">
              <div className="text-[11px] text-sub">Estimated Financial Risk Impact</div>
              <div className="text-xs font-semibold text-crimson mt-0.5">₹1.40 Crore EAL increase due to direct internet exposure</div>
            </div>
          </div>

          <div className="p-3 rounded bg-teal/5 border border-teal/20 text-xs text-sub">
            Remediating this drift will automatically apply the golden IaC template and run an automated post-apply validation check.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-line bg-paper flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-sub hover:text-ink rounded border border-line hover:bg-card transition-colors"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={() => {
              onRemediateDrift();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-teal hover:bg-teal/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Apply Golden Terraform State & Fix Drift</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
