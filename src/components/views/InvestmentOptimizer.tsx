import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { mockInvestments } from '../../data/mockData';

interface InvestmentOptimizerProps {
  onNavigate: (page: NavigationPage) => void;
  onShowToast: (type: 'success' | 'warning' | 'info', title: string, desc: string) => void;
  onOpenDocument: (title: string, type: string) => void;
}

export const InvestmentOptimizer: React.FC<InvestmentOptimizerProps> = ({
  onNavigate,
  onShowToast,
  onOpenDocument
}) => {
  const [budget, setBudget] = useState<number>(10000000); // ₹1.00 Crore
  const [selectedInvestments, setSelectedInvestments] = useState<string[]>([
    'inv-fido2-mfa',
    'inv-immutable-backups',
    'inv-recovery-exercises'
  ]);

  const handleToggleInvestment = (id: string) => {
    if (selectedInvestments.includes(id)) {
      setSelectedInvestments(prev => prev.filter(i => i !== id));
      onShowToast('info', 'Investment Removed', 'Recalculating residual financial exposure...');
    } else {
      setSelectedInvestments(prev => [...prev, id]);
      onShowToast('success', 'Investment Added', 'Risk reduction and portfolio ROI updated.');
    }
  };

  const chosenOptions = mockInvestments.filter(inv => selectedInvestments.includes(inv.id));
  const totalCost = chosenOptions.reduce((acc, curr) => acc + curr.initialCost, 0);
  const totalReduction = chosenOptions.reduce((acc, curr) => acc + curr.expectedRiskReduction, 0);
  const baselineLoss = 42000000;
  const residualRisk = Math.max(0, baselineLoss - totalReduction);
  const roiPct = totalCost > 0 ? Math.round(((totalReduction - totalCost) / totalCost) * 100) : 0;

  const isBackupRemoved = !selectedInvestments.includes('inv-immutable-backups');
  const isMfaRemoved = !selectedInvestments.includes('inv-fido2-mfa');

  return (
    <div className="animate-fade-in">
      {/* Masthead */}
      <div className="masthead">
        <div>
          <div className="org">Acme Financial Services · Capital Optimization</div>
          <h1>Investment Optimizer</h1>
          <div className="period">Mixed-Integer Linear Programming (MIP) Security Knapsack Solver</div>
        </div>
        <div className="masthead-actions">
          <button 
            className="btn"
            onClick={() => onOpenDocument("Q3 2026 Security Capital Allocation Proposal", "Investment Decision Package")}
          >
            Generate decision paper
          </button>
          <button 
            className="btn primary"
            onClick={() => {
              onShowToast('success', 'Portfolio Submitted for Sign-off', `Locked ₹${(totalCost / 100000).toFixed(0)} Lakh budget with SHA-256 audit entry.`);
            }}
          >
            Submit for executive sign-off
          </button>
        </div>
      </div>

      {/* Dynamic Alerts */}
      {isBackupRemoved && (
        <div className="callout crimson">
          <strong>Risk Warning:</strong> Removing <em>Air-Gapped Immutable Backups</em> increases expected yearly loss by <strong>₹1.10 Crore</strong>. Recovery risk will exceed board tolerance.
        </div>
      )}

      {isMfaRemoved && (
        <div className="callout amber">
          <strong>Notice:</strong> Removing <em>FIDO2 Hardware MFA</em> leaves administrative access exposed to SIM-swap and credential replay attacks.
        </div>
      )}

      {/* Grid: Interactive Budget Slider + Portfolio Summary Card */}
      <div className="grid2" style={{ marginTop: 0 }}>
        <div>
          <h2 className="section">Budget & Strategy Parameters</h2>
          <div className="section-sub">Adjust capital threshold to find optimal mathematical boundary.</div>

          <div className="slider-row">
            <div className="top">
              <span className="lbl">Security Capital Budget</span>
              <span className="val">₹{(budget / 100000).toFixed(0)} Lakh (₹{(budget / 10000000).toFixed(2)} Cr)</span>
            </div>
            <input 
              type="range"
              min="2000000"
              max="20000000"
              step="500000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--sub)', marginTop: '4px' }}>
              <span>Min: ₹20 Lakh</span>
              <span>Cap: ₹2.00 Crore</span>
            </div>
          </div>

          <div className="kv"><span className="k">Target Risk Appetite</span><span className="v">Moderate (₹2.5 Cr Limit)</span></div>
          <div className="kv"><span className="k">Regulatory Framework</span><span className="v">SEBI CSCRF + NIST 2.0</span></div>
          <div className="kv"><span className="k">Solver Formulation</span><span className="v">PuLP Mixed-Integer Linear Program</span></div>
        </div>

        <div>
          <div className="portfolio-card">
            <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--ink)' }}>
              Optimized Portfolio Summary
            </div>
            <ul className="portfolio-list">
              {chosenOptions.map(inv => (
                <li key={inv.id}>
                  <span>{inv.name}</span>
                  <span style={{ fontWeight: 500 }}>{inv.initialCostFormatted}</span>
                </li>
              ))}
            </ul>

            <div className="portfolio-stats">
              <div className="pstat">
                <div className="l">Total Committed</div>
                <div className="v">₹{(totalCost / 100000).toFixed(0)} Lakh</div>
              </div>
              <div className="pstat">
                <div className="l">Risk Reduced</div>
                <div className="v" style={{ color: 'var(--teal)' }}>₹{(totalReduction / 10000000).toFixed(2)} Cr</div>
              </div>
              <div className="pstat">
                <div className="l">Residual Risk</div>
                <div className="v">₹{(residualRisk / 10000000).toFixed(2)} Cr</div>
              </div>
              <div className="pstat">
                <div className="l">Portfolio ROI</div>
                <div className="v" style={{ color: 'var(--teal)' }}>{roiPct}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Controls Selection Table */}
      <h2 className="section">Candidate Security Investments ({chosenOptions.length} of {mockInvestments.length} Selected)</h2>
      <div className="section-sub">Toggle controls to observe real-time recalculation of residual exposure and ROI.</div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Control Name</th>
            <th>Category</th>
            <th>Implementation Time</th>
            <th>Capital Cost</th>
            <th>Expected Risk Reduction</th>
            <th>ROI</th>
            <th style={{ textAlign: 'right' }}>Selection</th>
          </tr>
        </thead>
        <tbody>
          {mockInvestments.map(inv => {
            const isSelected = selectedInvestments.includes(inv.id);
            return (
              <tr key={inv.id} style={{ backgroundColor: isSelected ? '#F6F8FA' : undefined }}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{inv.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--sub)', marginTop: '2px' }}>{inv.description}</div>
                </td>
                <td><span className="badge neutral">{inv.category}</span></td>
                <td>{inv.implementationDays} Days</td>
                <td className="num" style={{ fontWeight: 600 }}>{inv.initialCostFormatted}</td>
                <td className="num" style={{ color: 'var(--teal)', fontWeight: 600 }}>↓ {inv.expectedRiskReductionFormatted}</td>
                <td className="num">{inv.roiPct}%</td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className={`btn sm ${isSelected ? 'primary' : ''}`}
                    onClick={() => handleToggleInvestment(inv.id)}
                  >
                    {isSelected ? '✓ Included' : '+ Add Control'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <footer className="disclaimer">
        Optimization formulated as: Maximize Σ (ΔEAL_j × x_j) subject to Σ (Cost_j × x_j) ≤ Budget and dependency constraints. Illustrative estimate — not a guaranteed financial outcome.
      </footer>
    </div>
  );
};
