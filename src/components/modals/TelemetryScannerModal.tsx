import React, { useState } from 'react';
import { X, Radio, CheckCircle2, RefreshCw, Server, Cloud, ShieldCheck } from 'lucide-react';

interface TelemetryScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: () => void;
}

export const TelemetryScannerModal: React.FC<TelemetryScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedSource, setSelectedSource] = useState<string>('AWS + Azure Multi-Cloud Asset Inventory');
  const [scanLogs, setScanLogs] = useState<string[]>([
    'Connected to AWS Organizations (ap-south-1) - 48 accounts enumerated.',
    'Connected to Azure Resource Graph (Central India) - 310 virtual machines verified.',
    'Connected to ServiceNow CMDB API - Synced 1,248 business service relationships.',
    'Connected to CrowdStrike Falcon API - 98.4% agent sensor health confirmed.'
  ]);

  if (!isOpen) return null;

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanLogs(prev => [
        `Discovered 4 new unmanaged cloud endpoints in staging VPC. Automatically classified as Customer Data Platform dependencies.`,
        ...prev
      ]);
      onScanComplete();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-xl rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-teal/10 text-teal border border-teal/20">
              <Radio size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Continuous Asset & Telemetry Scanner</h2>
              <p className="text-xs text-sub m-0">Multi-Cloud CMDB & Vulnerability Pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Target Ingestion Pipeline</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
            >
              <option value="AWS + Azure Multi-Cloud Asset Inventory">AWS + Azure Multi-Cloud Asset Inventory</option>
              <option value="CrowdStrike Falcon + Microsoft Defender EDR">CrowdStrike Falcon + Microsoft Defender EDR</option>
              <option value="Qualys VMDR + Wiz Cloud Security Posture">Qualys VMDR + Wiz Cloud Security Posture</option>
              <option value="ServiceNow CMDB Enterprise Connector">ServiceNow CMDB Enterprise Connector</option>
            </select>
          </div>

          <div>
            <div className="text-xs font-semibold text-text mb-1 flex items-center gap-1.5">
              <Server size={14} className="text-teal" />
              <span>Real-Time Ingestion Logs</span>
            </div>
            <div className="p-3 rounded bg-[#0A192F] text-slate-300 font-mono text-[11px] leading-relaxed h-44 overflow-y-auto border border-white/10">
              {scanLogs.map((log, idx) => (
                <div key={idx} className="mb-1">
                  <span className="text-teal">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded bg-teal/5 border border-teal/20 text-xs text-sub">
            ✓ Scans use read-only IAM roles with zero performance impact on live transaction processing.
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
            onClick={handleScan}
            disabled={isScanning}
            className="px-5 py-2 text-xs font-semibold text-white bg-teal hover:bg-teal/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {isScanning ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Scanning Telemetry & Syncing CMDB...</span>
              </>
            ) : (
              <>
                <Radio size={13} />
                <span>Trigger Ingestion Scan Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
