import React from 'react';
import { X, Building2, TrendingUp, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { NavigationPage } from '../../types';

interface ServiceDrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  exposureAmount: string;
  toleranceStatus: string;
  onNavigate: (page: NavigationPage) => void;
}

export const ServiceDrilldownModal: React.FC<ServiceDrilldownModalProps> = ({
  isOpen,
  onClose,
  serviceName,
  exposureAmount,
  toleranceStatus,
  onNavigate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-2xl rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-ledger/10 text-ledger border border-ledger/20">
              <Building2 size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Business Service Risk Drilldown</h2>
              <p className="text-xs text-sub m-0">{serviceName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded bg-paper border border-line">
              <div className="text-[11px] text-sub uppercase">Annual Exposure</div>
              <div className="text-base font-bold text-crimson mt-0.5">{exposureAmount}</div>
            </div>
            <div className="p-3 rounded bg-paper border border-line">
              <div className="text-[11px] text-sub uppercase">Appetite Tolerance</div>
              <div className="text-xs font-bold text-crimson mt-1">{toleranceStatus}</div>
            </div>
            <div className="p-3 rounded bg-paper border border-line">
              <div className="text-[11px] text-sub uppercase">Target RTO SLA</div>
              <div className="text-base font-bold text-ink mt-0.5">2.0 Hours</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-text mb-2">Core Technical Dependencies & Risk Drivers:</div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-paper border border-line flex items-center justify-between">
                <div>
                  <div className="font-semibold text-ink">UPI Switch Gateway & HSM Keyring</div>
                  <div className="text-[11px] text-sub">AWS Elastic Kubernetes Service (EKS) Cluster</div>
                </div>
                <span className="text-crimson font-semibold">₹4.2 Cr EAL</span>
              </div>
              <div className="p-2.5 rounded bg-paper border border-line flex items-center justify-between">
                <div>
                  <div className="font-semibold text-ink">Core Transaction PostgreSQL Database</div>
                  <div className="text-[11px] text-sub">Amazon Aurora Multi-AZ (Encrypted KMS)</div>
                </div>
                <span className="text-amber font-semibold">₹3.1 Cr EAL</span>
              </div>
              <div className="p-2.5 rounded bg-paper border border-line flex items-center justify-between">
                <div>
                  <div className="font-semibold text-ink">Settlement Batch Job Scheduler</div>
                  <div className="text-[11px] text-sub">Legacy Apache Airflow On-Premises</div>
                </div>
                <span className="text-teal font-semibold">₹1.8 Cr EAL</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded bg-paper border border-line text-xs text-sub">
            💡 <strong>Recommended Action:</strong> Deploying immutable air-gapped backups and enforcing hardware MFA will bring this service back within the ₹5.0 Cr board tolerance threshold.
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
              onNavigate('optimizer');
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-teal hover:bg-teal/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Open Investment Protection Plan</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
