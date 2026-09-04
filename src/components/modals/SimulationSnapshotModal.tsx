import React, { useState } from 'react';
import { X, BookmarkPlus, CheckCircle2, ArrowRight } from 'lucide-react';

interface SimulationSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  threatLevel: number;
  mfaCoverage: number;
  simulatedRisk: string;
  onSaveSnapshot: (title: string, notes: string) => void;
}

export const SimulationSnapshotModal: React.FC<SimulationSnapshotModalProps> = ({
  isOpen,
  onClose,
  threatLevel,
  mfaCoverage,
  simulatedRisk,
  onSaveSnapshot
}) => {
  const [title, setTitle] = useState<string>('Q4 Stress Scenario - Zero-Day Exploitation + 60% MFA');
  const [notes, setNotes] = useState<string>('Simulates nation-state threat actor with degraded privileged authentication posture for board audit review.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSaveSnapshot(title, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-ledger/10 text-ledger border border-ledger/20">
              <BookmarkPlus size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Save Simulation Scenario Snapshot</h2>
              <p className="text-xs text-sub m-0">Persist Monte Carlo & What-If Hypotheses</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="p-3 rounded bg-paper border border-line flex items-center justify-between text-xs">
            <div>
              <span className="text-sub">Threat Capability:</span>
              <span className="font-bold text-ink ml-1">{threatLevel}/10</span>
            </div>
            <div>
              <span className="text-sub">MFA Coverage:</span>
              <span className="font-bold text-ink ml-1">{mfaCoverage}%</span>
            </div>
            <div>
              <span className="text-sub">Simulated Risk:</span>
              <span className="font-bold text-crimson ml-1">{simulatedRisk}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Scenario Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Analysis Notes & Hypotheses</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              className="px-5 py-2 text-xs font-semibold text-white bg-ledger hover:bg-ledger/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <BookmarkPlus size={14} />
              <span>Save Scenario Snapshot</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
