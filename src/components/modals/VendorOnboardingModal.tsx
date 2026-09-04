import React, { useState } from 'react';
import { X, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

interface VendorOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVendor: (vendor: { name: string; category: string; tier: string; annualCost: string; dataShared: string }) => void;
}

export const VendorOnboardingModal: React.FC<VendorOnboardingModalProps> = ({
  isOpen,
  onClose,
  onAddVendor
}) => {
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('SaaS Platform');
  const [tier, setTier] = useState<string>('Tier 1 - Mission Critical');
  const [annualCost, setAnnualCost] = useState<string>('₹85 Lakh / yr');
  const [dataShared, setDataShared] = useState<string>('Customer PII & UPI Transaction Identifiers');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddVendor({ name, category, tier, annualCost, dataShared });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-teal/10 text-teal border border-teal/20">
              <Building2 size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Onboard Third-Party Vendor</h2>
              <p className="text-xs text-sub m-0">Supply Chain Risk Tiering & Scope Registration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Vendor / Provider Legal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. PineLabs Payment Gateway Infrastructure"
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Vendor Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              >
                <option value="SaaS Platform">SaaS Platform</option>
                <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                <option value="Payment Gateway">Payment Gateway</option>
                <option value="Managed Security Service">Managed Security Service</option>
                <option value="HR / Payroll Provider">HR / Payroll Provider</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Criticality Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              >
                <option value="Tier 1 - Mission Critical">Tier 1 (Mission Critical)</option>
                <option value="Tier 2 - Significant">Tier 2 (Significant)</option>
                <option value="Tier 3 - Standard">Tier 3 (Standard)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Data Classification & Access Granted</label>
            <input
              type="text"
              value={dataShared}
              onChange={(e) => setDataShared(e.target.value)}
              placeholder="e.g. Masked PII, OAuth tokens, Telemetry logs..."
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Annual Contract Value (INR)</label>
            <input
              type="text"
              value={annualCost}
              onChange={(e) => setAnnualCost(e.target.value)}
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
              className="px-5 py-2 text-xs font-semibold text-white bg-teal hover:bg-teal/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Building2 size={14} />
              <span>Register Vendor & Initialize Assessment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
