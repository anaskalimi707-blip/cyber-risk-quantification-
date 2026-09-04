import React, { useState } from 'react';
import { X, Wrench, Clock, ShieldCheck, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';

interface PatchRemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetName: string;
  recommendedAction: string;
  onConfirmPatch: (ticketId: string, window: string) => void;
}

export const PatchRemediationModal: React.FC<PatchRemediationModalProps> = ({
  isOpen,
  onClose,
  assetName,
  recommendedAction,
  onConfirmPatch
}) => {
  const [maintenanceWindow, setMaintenanceWindow] = useState<string>('Immediate (Emergency Change Request - P1)');
  const [ticketTarget, setTicketTarget] = useState<string>('Jira Security Ops (SEC-8921)');
  const [assignee, setAssignee] = useState<string>('SecOps Infrastructure Team');
  const [rollbackPlan, setRollbackPlan] = useState<string>('Automated Snapshot Rollback enabled via AWS CloudFormation / Ansible handler.');
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      const ticketId = `CR-${Math.floor(10000 + Math.random() * 90000)}`;
      onConfirmPatch(ticketId, maintenanceWindow);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-crimson/10 text-crimson border border-crimson/20">
              <Wrench size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Remediation & Patch Work Order</h2>
              <p className="text-xs text-sub m-0">Vulnerability Mitigation & Hotfix Dispatch</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="p-3 rounded bg-paper border border-line">
            <div className="text-[11px] text-sub uppercase font-semibold">Target Asset</div>
            <div className="text-sm font-bold text-ink">{assetName}</div>
            <div className="text-xs text-crimson mt-1 font-medium flex items-center gap-1">
              <AlertCircle size={13} />
              <span>{recommendedAction}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Maintenance Window / Execution Schedule</label>
            <select
              value={maintenanceWindow}
              onChange={(e) => setMaintenanceWindow(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
            >
              <option value="Immediate (Emergency Change Request - P1)">Immediate Emergency Execution (P1 hotfix)</option>
              <option value="Tonight 02:00 - 04:00 IST (Low Traffic Window)">Tonight 02:00 - 04:00 IST (Standard maintenance window)</option>
              <option value="Weekend Saturday 23:00 IST (Scheduled Maintenance)">Weekend Saturday 23:00 IST (Batch patch cycle)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">ITSM / Ticket System</label>
              <select
                value={ticketTarget}
                onChange={(e) => setTicketTarget(e.target.value)}
                className="w-full text-xs p-2 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              >
                <option value="Jira Security Ops (SEC-8921)">Jira Security Ops</option>
                <option value="ServiceNow Change Request (CHG-3829)">ServiceNow ITSM</option>
                <option value="GitHub Actions Dispatch (hotfix-pipeline)">GitHub Actions Pipeline</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Assigned Team</label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full text-xs p-2 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Automated Rollback & Health Check Verification</label>
            <textarea
              rows={2}
              value={rollbackPlan}
              onChange={(e) => setRollbackPlan(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div className="p-3 rounded bg-teal/5 border border-teal/20 text-xs text-sub">
            ✓ Post-patch scan will automatically verify CVSS reduction and update residual financial exposure in the Risk Command Center.
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
              disabled={isDeploying}
              className="px-5 py-2 text-xs font-semibold text-white bg-crimson hover:bg-crimson/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isDeploying ? 'Deploying Patch...' : 'Dispatch Remediation Work Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
