import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { AlertCircle, Plus, CheckCircle2, Sliders, FileText } from 'lucide-react';

interface IncidentsResilienceProps {
  onNavigate: (page: NavigationPage) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, description: string) => void;
}

export const IncidentsResilience: React.FC<IncidentsResilienceProps> = ({ onNavigate, onShowToast }) => {
  const [activeChip, setActiveChip] = useState('Risk scenario');
  const [showLogModal, setShowLogModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLoss, setNewLoss] = useState('15');

  const handleLogIncident = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLogModal(false);
    onShowToast?.('success', 'Incident Recorded', `Logged incident "${newTitle || 'Payment Gateway Latency Spike'}" with empirical loss ₹${newLoss}L. Loss distribution weights updated.`);
    setNewTitle('');
  };

  const handleCalibrateModel = () => {
    onShowToast?.('success', 'Model Calibrated', 'Supervised regression & Bayesian loss distributions updated with empirical incident post-mortem data.');
    setTimeout(() => onNavigate('scenarios'), 600);
  };

  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Incidents &amp; Resilience</div>
          <h1>Incidents &amp; Empirical Loss Calibration</h1>
          <div className="period">Empirical feedback loop refining quantitative loss models with real breach telemetry</div>
        </div>
        <div className="masthead-actions flex items-center gap-2">
          <button className="btn primary" onClick={() => setShowLogModal(true)}>
            <Plus size={13} />
            <span>Log Incident</span>
          </button>
        </div>
      </div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Incident</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Affected service</th>
            <th>Estimated loss</th>
            <th>Actual loss</th>
            <th>Discovered</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>INC-2026-014</strong> · Phishing led to account lockouts</td>
            <td><span className="badge warn">High</span></td>
            <td><span className="badge neutral">Contained</span></td>
            <td>Corporate IT</td>
            <td className="num">₹18 lakh</td>
            <td className="num font-bold text-teal">₹6 lakh</td>
            <td style={{ color: 'var(--sub)' }}>2 days ago</td>
          </tr>
          <tr>
            <td><strong>INC-2026-011</strong> · Vendor API outage</td>
            <td><span className="badge warn">Medium</span></td>
            <td><span className="badge good">Recovered</span></td>
            <td>Trading Platform</td>
            <td className="num">₹9 lakh</td>
            <td className="num font-bold text-teal">₹4 lakh</td>
            <td style={{ color: 'var(--sub)' }}>9 days ago</td>
          </tr>
          <tr>
            <td><strong>INC-2026-006</strong> · Attempted credential-stuffing</td>
            <td><span className="badge crit">Critical</span></td>
            <td><span className="badge good">Closed</span></td>
            <td>Customer Data</td>
            <td className="num">₹40 lakh</td>
            <td className="num font-bold text-teal">₹0</td>
            <td style={{ color: 'var(--sub)' }}>31 days ago</td>
          </tr>
        </tbody>
      </table>

      <div className="callout" style={{ marginTop: '22px' }}>
        <b>INC-2026-006 closed.</b> Root cause: missing rate limiting on the login endpoint. Update risk model with this finding?
        <div style={{ marginTop: '10px' }}>
          <button className="btn sm primary" onClick={handleCalibrateModel}>
            Review changes &amp; calibrate model →
          </button>
        </div>
      </div>

      <h2 className="section">Connect this incident to</h2>
      <div className="chip-row">
        {['Risk scenario', 'Control failure', 'Asset', 'Business service', 'New investment recommendation'].map((chip) => (
          <div 
            key={chip} 
            className={`chip ${activeChip === chip ? 'active' : ''}`}
            onClick={() => {
              setActiveChip(chip);
              onShowToast?.('info', 'Relationship Filtered', `Filtered root cause telemetry by ${chip}.`);
            }}
          >
            {chip}
          </div>
        ))}
      </div>

      {/* Log Incident Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card p-6 rounded-lg border border-line shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-ink mb-2">Log New Security Incident</h3>
            <p className="text-xs text-sub mb-4">Record real breach or outage losses to calibrate probabilistic risk curves.</p>
            <form onSubmit={handleLogIncident} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-sub mb-1">Incident Title</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 text-xs border border-line rounded bg-paper text-ink"
                  placeholder="e.g. Distributed Denial of Service on Payment Switch"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-sub mb-1">Empirical Loss (₹ Lakhs)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 text-xs border border-line rounded bg-paper text-ink"
                  value={newLoss}
                  onChange={(e) => setNewLoss(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-line">
                <button type="button" className="btn" onClick={() => setShowLogModal(false)}>Cancel</button>
                <button type="submit" className="btn primary">Record Incident</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

