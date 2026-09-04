import React, { useState } from 'react';
import { X, AlertOctagon, CheckCircle2, DollarSign } from 'lucide-react';

interface LogIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogIncident: (incident: { title: string; loss: string; rootCause: string; severity: string; service: string }) => void;
}

export const LogIncidentModal: React.FC<LogIncidentModalProps> = ({
  isOpen,
  onClose,
  onLogIncident
}) => {
  const [title, setTitle] = useState<string>('');
  const [service, setService] = useState<string>('Payment Processing');
  const [severity, setSeverity] = useState<string>('P1 - Critical');
  const [loss, setLoss] = useState<string>('₹45 Lakh');
  const [rootCause, setRootCause] = useState<string>('Privileged credential abuse on external staging API');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onLogIncident({ title, service, severity, loss, rootCause });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-crimson/10 text-crimson border border-crimson/20">
              <AlertOctagon size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Declare Enterprise Security Incident</h2>
              <p className="text-xs text-sub m-0">Empirical Loss & Root-Cause Registration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Incident Title / Summary</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Credential Stuffing on UPI Mobile Gateway"
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Impacted Business Service</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              >
                <option value="Payment Processing">Payment Processing</option>
                <option value="Customer Data Platform">Customer Data Platform</option>
                <option value="Trading Platform">Trading Platform</option>
                <option value="Corporate IT">Corporate IT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Incident Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              >
                <option value="P1 - Critical">P1 - Critical (Board Notified)</option>
                <option value="P2 - High">P2 - High (Operational Impairment)</option>
                <option value="P3 - Medium">P3 - Medium (Contained)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Empirical Realized Financial Loss (INR)</label>
            <input
              type="text"
              value={loss}
              onChange={(e) => setLoss(e.target.value)}
              placeholder="e.g. ₹45 Lakh (Response + Downtime + Recovery)"
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Primary Root Cause & Control Failure</label>
            <textarea
              rows={2}
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              placeholder="e.g. WAF rate-limiting rule bypass + missing bot protection..."
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
              className="px-5 py-2 text-xs font-semibold text-white bg-crimson hover:bg-crimson/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <AlertOctagon size={14} />
              <span>Record Incident & Update Resiliency Ledger</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
