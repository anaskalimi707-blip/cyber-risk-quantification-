import React, { useState } from 'react';
import { X, ShieldPlus, CheckCircle2, ArrowRight } from 'lucide-react';
import { DefensiveControl } from '../../types';

interface AddControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddControl: (control: Partial<DefensiveControl>) => void;
}

export const AddControlModal: React.FC<AddControlModalProps> = ({
  isOpen,
  onClose,
  onAddControl
}) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<'Preventive' | 'Detective' | 'Responsive' | 'Recover'>('Preventive');
  const [frameworkRef, setFrameworkRef] = useState<string>('NIST PR.AC-1');
  const [coveragePct, setCoveragePct] = useState<number>(85);
  const [owner, setOwner] = useState<string>('SecOps Engineering');
  const [cost, setCost] = useState<string>('₹35 Lakh');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddControl({
      name,
      description,
      category,
      frameworkRef,
      coveragePct,
      implementationPct: 90,
      effectivenessScore: 0.88,
      owner,
      status: 'Effective',
      evidenceFreshness: 'Just added',
      evidenceFreshnessHours: 1,
      potentialRiskReductionFormatted: '₹95 Lakh / yr'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-xl rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-teal/10 text-teal border border-teal/20">
              <ShieldPlus size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Add Defensive Control</h2>
              <p className="text-xs text-sub m-0">Register New Enterprise Security Mechanism</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Control Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Automated Kubernetes Network Policy Ingress Enforcement"
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Description & Scope</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enforces default-deny micro-segmentation across production VPCs..."
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Defense Lifecycle Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              >
                <option value="Preventive">Preventive</option>
                <option value="Detective">Detective</option>
                <option value="Responsive">Responsive</option>
                <option value="Recover">Recover</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Regulatory Framework Tag</label>
              <input
                type="text"
                value={frameworkRef}
                onChange={(e) => setFrameworkRef(e.target.value)}
                placeholder="e.g. NIST PR.AC-1 / SEBI 3.2.1"
                className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Coverage Target (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={coveragePct}
                onChange={(e) => setCoveragePct(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Operational Owner</label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
                required
              />
            </div>
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
              <ShieldPlus size={14} />
              <span>Register Defensive Control</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
