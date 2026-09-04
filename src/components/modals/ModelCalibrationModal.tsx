import React, { useState } from 'react';
import { X, Sliders, CheckCircle2, RefreshCw, BarChart2 } from 'lucide-react';

interface ModelCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCalibration: () => void;
}

export const ModelCalibrationModal: React.FC<ModelCalibrationModalProps> = ({
  isOpen,
  onClose,
  onApplyCalibration
}) => {
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [lefMultiplier, setLefMultiplier] = useState<number>(1.12);
  const [rtoActual, setRtoActual] = useState<number>(2.4);

  if (!isOpen) return null;

  const handleRecalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      onApplyCalibration();
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-xl rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-ledger/10 text-ledger border border-ledger/20">
              <Sliders size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">FAIR Risk Model Bayesian Calibration</h2>
              <p className="text-xs text-sub m-0">Empirical Incident Loss Feedback Tuning</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="p-3 rounded bg-paper border border-line text-xs space-y-2">
            <div className="font-semibold text-ink">Empirical Feedback Summary:</div>
            <div className="text-sub">
              • 3 recent incidents recorded an average financial realization of ₹35 Lakh/event.<br />
              • Recovery Time Actual (2.4 hrs) is 20% higher than model baseline (2.0 hrs).<br />
              • Bayesian loss distribution shifted rightward by +8.2% across payment scenarios.
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-text mb-1">
                <span>Loss Event Frequency (LEF) Prior Multiplier</span>
                <span className="text-ledger font-bold">{lefMultiplier.toFixed(2)}x</span>
              </div>
              <input 
                type="range"
                min="0.8"
                max="1.5"
                step="0.02"
                value={lefMultiplier}
                onChange={(e) => setLefMultiplier(Number(e.target.value))}
                className="w-full accent-ledger"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-text mb-1">
                <span>Calibrated Mean RTO (Hours)</span>
                <span className="text-amber font-bold">{rtoActual.toFixed(1)} hrs</span>
              </div>
              <input 
                type="range"
                min="1.0"
                max="6.0"
                step="0.1"
                value={rtoActual}
                onChange={(e) => setRtoActual(Number(e.target.value))}
                className="w-full accent-amber"
              />
            </div>
          </div>

          <div className="p-3 rounded bg-teal/5 border border-teal/20 text-xs text-sub">
            ✓ Recalibration updates 10,000 Monte Carlo trial distributions across all 5 active business risk scenarios.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-line bg-paper flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-sub hover:text-ink rounded border border-line hover:bg-card transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRecalibrate}
            disabled={isCalibrating}
            className="px-5 py-2 text-xs font-semibold text-white bg-ledger hover:bg-ledger/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {isCalibrating ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Running Bayesian Calibration...</span>
              </>
            ) : (
              <>
                <BarChart2 size={13} />
                <span>Apply Bayesian Calibration</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
