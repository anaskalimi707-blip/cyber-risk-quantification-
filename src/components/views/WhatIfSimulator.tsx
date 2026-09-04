import React, { useState } from 'react';
import { NavigationPage } from '../../types';

interface WhatIfSimulatorProps {
  onNavigate: (page: NavigationPage) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ onNavigate }) => {
  const [mfa, setMfa] = useState(88);
  const [edr, setEdr] = useState(72);
  const [rto, setRto] = useState(18);
  const [immutability, setImmutability] = useState(true);
  const [segmentation, setSegmentation] = useState(false);
  const [vendorFailure, setVendorFailure] = useState(false);

  // Dynamic simulation calculations
  const baseline = 4.2;
  const reduction = (mfa * 0.008) + (edr * 0.006) + (immutability ? 0.6 : 0) + (segmentation ? 0.5 : 0) - (vendorFailure ? 0.8 : 0);
  const simulated = Math.max(0.8, baseline - reduction);

  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">What-If Simulator</div>
          <h1>Test decisions before spending money</h1>
          <div className="period">Counterfactual security posture sandbox</div>
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
            className="btn primary" 
            style={{ marginTop: '18px' }}
            onClick={() => onNavigate('optimizer')}
          >
            Apply to Investment Plan →
          </button>
        </div>

        <div style={{ paddingTop: 0 }}>
          <div className="ledger-row" style={{ margin: '0 0 20px' }}>
            <div className="ledger-item">
              <div className="l">Current risk</div>
              <div className="v">₹{baseline.toFixed(1)} cr</div>
            </div>
            <div className="ledger-item">
              <div className="l">Simulated risk</div>
              <div className="v" style={{ color: 'var(--teal)' }}>₹{simulated.toFixed(1)} cr</div>
            </div>
            <div className="ledger-item">
              <div className="l">Reduction</div>
              <div className="v">₹{Math.max(0, baseline - simulated).toFixed(1)} cr</div>
            </div>
          </div>

          <div className={`callout ${simulated <= 2.5 ? 'teal' : 'crimson'}`}>
            Status: <b>{simulated <= 2.5 ? 'Within tolerance' : 'Above tolerance (₹2.5 Cr Limit)'}</b> at the simulated settings.
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
    </div>
  );
};
