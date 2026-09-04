import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { RotateCcw, BookmarkPlus, ArrowRight, CheckCircle2, Sliders, Shield, AlertCircle } from 'lucide-react';
import { SimulationSnapshotModal } from '../modals/SimulationSnapshotModal';
import { useRiskDecision } from '../../context/RiskDecisionContext';

interface WhatIfSimulatorProps {
  onNavigate: (page: NavigationPage) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, description: string) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ onNavigate, onShowToast }) => {
  const { totalEalInr, riskAppetiteInr } = useRiskDecision();
  const [mfa, setMfa] = useState(88);
  const [edr, setEdr] = useState(72);
  const [rto, setRto] = useState(18);
  const [immutability, setImmutability] = useState(true);
  const [segmentation, setSegmentation] = useState(false);
  const [vendorFailure, setVendorFailure] = useState(false);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState<boolean>(false);

  // Dynamic simulation calculations based on current enterprise baseline
  const enterpriseBaselineCr = totalEalInr / 10000000;
  const toleranceCr = riskAppetiteInr / 10000000;

  // Counterfactual delta calculations
  const mfaDelta = ((mfa - 88) / 100) * 1.6; // MFA marginal impact
  const edrDelta = ((edr - 72) / 100) * 1.2; // EDR marginal impact
  const rtoDelta = ((18 - rto) / 18) * 0.9;  // Downtime reduction impact
  const immutabilityDelta = immutability ? 1.2 : -0.8;
  const segmentationDelta = segmentation ? 0.95 : 0;
  const vendorPenalty = vendorFailure ? 1.8 : 0;

  const totalReduction = mfaDelta + edrDelta + rtoDelta + immutabilityDelta + segmentationDelta - vendorPenalty;
  const simulated = Math.max(0.8, enterpriseBaselineCr - totalReduction);


  const handleReset = () => {
    setMfa(88);
    setEdr(72);
    setRto(18);
    setImmutability(true);
    setSegmentation(false);
    setVendorFailure(false);
    onShowToast?.('info', 'Sandbox Reset', 'Reset all simulation sliders to enterprise telemetry baseline.');
  };

  const handleSaveSnapshot = () => {
    setIsSnapshotModalOpen(true);
  };

  const handleApplyToPlan = () => {
    onShowToast?.('success', 'Simulation Applied to Budget Optimizer', `MIP solver updated with target controls: MFA ${mfa}%, EDR ${edr}%, Immutability: ${immutability ? 'ON' : 'OFF'}.`);
    setTimeout(() => onNavigate('optimizer'), 500);
  };

  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">What-If Simulator</div>
          <h1>Test decisions before spending money</h1>
          <div className="period">Counterfactual security posture sandbox</div>
        </div>
        <div className="masthead-actions flex items-center gap-2">
          <button className="btn" onClick={handleReset}>
            <RotateCcw size={13} />
            <span>Reset Baseline</span>
          </button>
          <button className="btn" onClick={handleSaveSnapshot}>
            <BookmarkPlus size={13} />
            <span>Save Snapshot</span>
          </button>
          <button className="btn primary" onClick={handleApplyToPlan}>
            <span>Apply to Plan</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      <div className="grid2" style={{ borderTop: 'none', marginTop: 0 }}>
        <div style={{ paddingTop: 0 }}>
          <div className="slider-row">
            <div className="top">
              <span>MFA coverage</span>
              <span className="val">{mfa}%</span>
            </div>
            <input type="range" min="0" max="100" value={mfa} onChange={(e) => setMfa(Number(e.target.value))} />
          </div>

          <div className="slider-row">
            <div className="top">
              <span>EDR coverage</span>
              <span className="val">{edr}%</span>
            </div>
            <input type="range" min="0" max="100" value={edr} onChange={(e) => setEdr(Number(e.target.value))} />
          </div>

          <div className="slider-row">
            <div className="top">
              <span>Recovery time (hours)</span>
              <span className="val">{rto}</span>
            </div>
            <input type="range" min="0" max="72" value={rto} onChange={(e) => setRto(Number(e.target.value))} />
          </div>

          <div className="toggle-row">
            <span>Backup immutability</span>
            <div 
              className={`switch ${immutability ? 'on' : ''}`}
              onClick={() => setImmutability(!immutability)}
            ></div>
          </div>

          <div className="toggle-row">
            <span>Network segmentation</span>
            <div 
              className={`switch ${segmentation ? 'on' : ''}`}
              onClick={() => setSegmentation(!segmentation)}
            ></div>
          </div>

          <div className="toggle-row">
            <span>Vendor failure scenario</span>
            <div 
              className={`switch ${vendorFailure ? 'on' : ''}`}
              onClick={() => setVendorFailure(!vendorFailure)}
            ></div>
          </div>

          <button 
            className="btn primary w-full justify-center" 
            style={{ marginTop: '18px' }}
            onClick={handleApplyToPlan}
          >
            Apply to Investment Plan →
          </button>
        </div>

        <div style={{ paddingTop: 0 }}>
          <div className="ledger-row" style={{ margin: '0 0 20px' }}>
            <div className="ledger-item">
              <div className="l">Baseline Enterprise EAL</div>
              <div className="v">₹{enterpriseBaselineCr.toFixed(2)} Cr</div>
            </div>
            <div className="ledger-item">
              <div className="l">Simulated Counterfactual</div>
              <div className="v" style={{ color: 'var(--teal)' }}>₹{simulated.toFixed(2)} Cr</div>
            </div>
            <div className="ledger-item">
              <div className="l">Simulated Delta</div>
              <div className="v" style={{ color: simulated < enterpriseBaselineCr ? 'var(--teal)' : 'var(--crimson)' }}>
                {simulated < enterpriseBaselineCr ? '↓ ' : '↑ '}
                ₹{Math.abs(enterpriseBaselineCr - simulated).toFixed(2)} Cr
              </div>
            </div>
          </div>

          <div className={`callout ${simulated <= toleranceCr ? 'teal' : 'crimson'}`}>
            Status: <b>{simulated <= toleranceCr ? `Within Risk Appetite (≤ ₹${toleranceCr.toFixed(2)} Cr)` : `Above Risk Appetite (> ₹${toleranceCr.toFixed(2)} Cr Limit)`}</b> at current counterfactual slider configurations.
          </div>

          <div className="l" style={{ fontSize: '12px', color: 'var(--sub)', margin: '16px 0 8px' }}>
            Baseline vs. simulated loss distribution
          </div>
          <svg width="100%" height="130" viewBox="0 0 320 130">
            <polyline fill="none" stroke="#B92D37" strokeWidth="2" points="0,20 60,35 120,60 180,85 240,105 300,118" />
            <polyline fill="none" stroke="#009687" strokeWidth="2" points="0,40 60,60 120,85 180,105 240,118 300,126" />
          </svg>
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--sub)', marginTop: '6px' }}>
            <span style={{ color: '#B92D37' }}>— Baseline Loss Curve</span>
            <span style={{ color: '#009687' }}>— Simulated Counterfactual Curve</span>
          </div>
        </div>
      </div>

      {/* Snapshot Persistence Modal */}
      <SimulationSnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        threatLevel={8}
        mfaCoverage={mfa}
        simulatedRisk={`₹${simulated.toFixed(1)} Cr`}
        onSaveSnapshot={(title, notes) => {
          onShowToast?.('success', 'Simulation Snapshot Saved', `Persisted "${title}" to scenario repository.`);
        }}
      />
    </div>
  );
};

