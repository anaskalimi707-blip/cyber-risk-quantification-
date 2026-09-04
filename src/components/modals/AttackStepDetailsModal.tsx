import React from 'react';
import { X, ShieldAlert, Crosshair, CheckCircle2, ArrowRight } from 'lucide-react';
import { NavigationPage } from '../../types';

interface AttackStepDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: { id: string; name: string; status: string; controlWeakness?: string } | null;
  onNavigate: (page: NavigationPage) => void;
}

export const AttackStepDetailsModal: React.FC<AttackStepDetailsModalProps> = ({
  isOpen,
  onClose,
  node,
  onNavigate
}) => {
  if (!isOpen || !node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-crimson/10 text-crimson border border-crimson/20">
              <Crosshair size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Attack Path Step Deep-Dive</h2>
              <p className="text-xs text-sub m-0">{node.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="p-3 rounded bg-paper border border-line flex items-center justify-between text-xs">
            <div>
              <span className="text-sub">Exploitation Status:</span>
              <span className="font-bold text-crimson ml-1.5">{node.status}</span>
            </div>
            <div>
              <span className="text-sub">Control Gap:</span>
              <span className="font-bold text-amber ml-1.5">{node.controlWeakness || 'Partially Effective'}</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-text mb-1">MITRE ATT&CK Mapping & Technique:</div>
            <div className="p-2.5 rounded bg-[#0A192F] text-slate-200 font-mono text-[11.5px] border border-white/10">
              T1078.004 - Valid Cloud Accounts / Stolen Session Tokens<br />
              T1486 - Data Encrypted for Impact (Ransomware Payload)
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-text mb-1">Specific Defensive Countermeasure:</div>
            <div className="text-xs text-sub leading-relaxed p-2.5 rounded bg-paper border border-line">
              Enforcing WebAuthn/FIDO2 hardware-backed MFA breaks this initial compromise path by preventing token replay and adversary-in-the-middle phishing.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-line bg-paper flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-sub hover:text-ink rounded border border-line hover:bg-card transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('controls');
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-teal hover:bg-teal/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Inspect Defensive Controls</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
