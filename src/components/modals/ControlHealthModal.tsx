import React, { useState } from 'react';
import { X, Activity, CheckCircle2, AlertTriangle, RefreshCw, Terminal, ShieldCheck } from 'lucide-react';
import { DefensiveControl } from '../../types';

interface ControlHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  control: DefensiveControl | null;
  onRunTest: () => void;
}

export const ControlHealthModal: React.FC<ControlHealthModalProps> = ({
  isOpen,
  onClose,
  control,
  onRunTest
}) => {
  const [isProbing, setIsProbing] = useState<boolean>(false);
  const [probeLogs, setProbeLogs] = useState<string[]>([
    '2026-09-04 08:30:12 UTC - Initiating automated API test probe against Okta / Duo API endpoint...',
    '2026-09-04 08:30:13 UTC - Polling 420 active admin accounts across 12 AWS accounts...',
    '2026-09-04 08:30:14 UTC - Verified 395 accounts with valid WebAuthn/FIDO2 hardware tokens (94% coverage).',
    '2026-09-04 08:30:15 UTC - Health probe passed. SHA-256 evidence digest generated.'
  ]);

  if (!isOpen || !control) return null;

  const handleExecuteProbe = () => {
    setIsProbing(true);
    setTimeout(() => {
      setIsProbing(false);
      setProbeLogs(prev => [
        `2026-09-04 ${new Date().toLocaleTimeString()} UTC - Live active synthetic test executed successfully.`,
        ...prev
      ]);
      onRunTest();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-2xl rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-teal/10 text-teal border border-teal/20">
              <Activity size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Live Control Health & Telemetry Probe</h2>
              <p className="text-xs text-sub m-0">{control.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded bg-paper border border-line">
              <div className="text-[11px] text-sub uppercase">Status</div>
              <div className="text-sm font-bold text-teal mt-0.5">{control.status}</div>
            </div>
            <div className="p-3 rounded bg-paper border border-line">
              <div className="text-[11px] text-sub uppercase">Measured Coverage</div>
              <div className="text-sm font-bold text-ink mt-0.5">{control.coveragePct}%</div>
            </div>
            <div className="p-3 rounded bg-paper border border-line">
              <div className="text-[11px] text-sub uppercase">Effectiveness Score</div>
              <div className="text-sm font-bold text-ledger mt-0.5">{Math.round(control.effectivenessScore * 100)}%</div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-text flex items-center gap-1.5">
                <Terminal size={14} className="text-teal" />
                <span>Automated Telemetry Test Probe Logs</span>
              </span>
              <span className="text-[11px] text-sub">Continuous Ingestion (5m interval)</span>
            </div>
            <div className="p-3 rounded bg-[#0A192F] text-slate-300 font-mono text-[11px] leading-relaxed h-40 overflow-y-auto border border-white/10">
              {probeLogs.map((log, idx) => (
                <div key={idx} className="mb-1 text-slate-300">
                  <span className="text-teal">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded bg-paper border border-line flex items-center justify-between text-xs">
            <div>
              <span className="text-sub">Regulatory Alignment:</span>
              <span className="font-semibold text-text ml-1.5">{control.frameworkRef}</span>
            </div>
            <div>
              <span className="text-sub">Owner:</span>
              <span className="font-semibold text-text ml-1.5">{control.owner}</span>
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
            onClick={handleExecuteProbe}
            disabled={isProbing}
            className="px-5 py-2 text-xs font-semibold text-white bg-teal hover:bg-teal/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {isProbing ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Executing Automated Probe...</span>
              </>
            ) : (
              <>
                <Activity size={13} />
                <span>Run Synthetic Telemetry Test</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
