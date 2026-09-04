import React, { useMemo, useState } from 'react';
import { NavigationPage } from '../../types';
import { mockInvestments } from '../../data/mockData';
import { optimizePortfolio, type PortfolioObjective } from '../../utils/portfolioOptimizer';
import { ExecutiveSignOffModal } from '../modals/ExecutiveSignOffModal';

interface InvestmentOptimizerProps {
  onNavigate: (page: NavigationPage) => void;
  onShowToast: (type: 'success' | 'warning' | 'info', title: string, desc: string) => void;
  onOpenDocument: (title: string, type: string) => void;
}

const BASELINE_LOSS = 42000000;
const BOARD_RISK_APPETITE = 25000000;

const formatCrore = (amount: number) => `₹${(amount / 10000000).toFixed(2)} Cr`;
const formatLakh = (amount: number) => `₹${(amount / 100000).toFixed(0)} Lakh`;

export const InvestmentOptimizer: React.FC<InvestmentOptimizerProps> = ({
  onShowToast,
  onOpenDocument,
}) => {
  const [budget, setBudget] = useState(10000000);
  const [objective, setObjective] = useState<PortfolioObjective>('risk-reduction');
  const [requiredInvestmentIds, setRequiredInvestmentIds] = useState<string[]>([]);
  const [isSignOffModalOpen, setIsSignOffModalOpen] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState<'ai_optimal' | 'max_roi' | 'aggressive' | 'status_quo'>('ai_optimal');
  const [hoveredFrontierPoint, setHoveredFrontierPoint] = useState<number | null>(null);

  const portfolio = useMemo(() => optimizePortfolio({
    investments: mockInvestments,
    budget,
    baselineLoss: BASELINE_LOSS,
    riskAppetite: BOARD_RISK_APPETITE,
    objective,
    requiredInvestmentIds,
  }), [budget, objective, requiredInvestmentIds]);

  const selectedInvestmentIds = new Set(portfolio.selectedInvestments.map((investment) => investment.id));
  const requiredCost = mockInvestments
    .filter((investment) => requiredInvestmentIds.includes(investment.id))
    .reduce((total, investment) => total + investment.initialCost, 0);

  // Generate 8-point Pareto Frontier for visualization
  const paretoPoints = useMemo(() => {
    const budgetSteps = [3000000, 5000000, 7500000, 10000000, 12500000, 15000000, 17500000, 20000000];
    return budgetSteps.map((b) => {
      const p = optimizePortfolio({
        investments: mockInvestments,
        budget: b,
        baselineLoss: BASELINE_LOSS,
        riskAppetite: BOARD_RISK_APPETITE,
        objective: 'risk-reduction',
        requiredInvestmentIds: [],
      });
      const roi = p.totalCost > 0 ? Math.round(((p.expectedRiskReduction - p.totalCost) / p.totalCost) * 100) : 0;
      return {
        budget: b,
        cost: p.totalCost,
        residualRisk: p.residualRisk,
        riskReduction: p.expectedRiskReduction,
        roi,
        controlsCount: p.selectedInvestments.length,
        isCurrent: Math.abs(b - budget) < 1500000,
        isSweetSpot: b === 10000000,
      };
    });
  }, [budget]);

  // Strategy comparison cards
  const strategyComparisons = useMemo(() => [
    {
      id: 'status_quo',
      name: 'Status Quo (Baseline)',
      cost: 0,
      riskReduction: 0,
      residualRisk: BASELINE_LOSS,
      roi: 0,
      paybackMonths: 0,
      badge: 'Unmitigated',
      badgeColor: 'warn',
      description: 'Zero additional spend. Retains full exposure to ransomware and API breach vectors.',
    },
    {
      id: 'max_roi',
      name: 'Quick Wins (Max ROSI)',
      cost: 6500000,
      riskReduction: 21000000,
      residualRisk: 21000000,
      roi: 223,
      paybackMonths: 3.8,
      badge: '223% ROSI',
      badgeColor: 'teal',
      description: 'Prioritizes high-leverage identity & endpoint hardening for rapid risk reduction.',
    },
    {
      id: 'ai_optimal',
      name: 'AI-Optimal Balanced',
      cost: portfolio.totalCost,
      riskReduction: portfolio.expectedRiskReduction,
      residualRisk: portfolio.residualRisk,
      roi: Math.round(portfolio.riskReductionRoi),
      paybackMonths: 5.6,
      badge: 'Recommended',
      badgeColor: 'good',
      description: 'MILP-solved allocation balancing maximum threat coverage with capital efficiency.',
    },
    {
      id: 'aggressive',
      name: 'Zero-Tolerance Defense',
      cost: 16500000,
      riskReduction: 33500000,
      residualRisk: 8500000,
      roi: 103,
      paybackMonths: 8.9,
      badge: 'Max Assurance',
      badgeColor: 'neutral',
      description: 'Comprehensive defense-in-depth closing all perimeter, cloud, and supply chain paths.',
    },
  ], [portfolio]);

  const handleToggleRequirement = (id: string) => {
    const nextRequiredIds = requiredInvestmentIds.includes(id)
      ? requiredInvestmentIds.filter((investmentId) => investmentId !== id)
      : [...requiredInvestmentIds, id];
    const nextRequiredCost = mockInvestments
      .filter((investment) => nextRequiredIds.includes(investment.id))
      .reduce((total, investment) => total + investment.initialCost, 0);

    if (nextRequiredCost > budget) {
      onShowToast('warning', 'Constraint Not Applied', 'Required controls cannot exceed the capital budget. Increase the budget or remove another requirement.');
      return;
    }

    setRequiredInvestmentIds(nextRequiredIds);
    onShowToast(
      'info',
      nextRequiredIds.includes(id) ? 'Control Required' : 'Control Requirement Removed',
      'The recommendation has been recalculated with the updated portfolio constraint.',
    );
  };

  const objectiveLabel = {
    'risk-reduction': 'Maximum expected risk reduction',
    roi: 'Best risk-reduction ROI',
    'risk-appetite': 'Lowest cost that meets risk appetite',
  }[objective];

  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Acme Financial Services · Capital Optimization</div>
          <h1>AI-Assisted Multi-Objective Investment Optimizer</h1>
          <div className="period">MILP Knapsack solver · Continuous Pareto Frontier · Return on Security Investment (ROSI)</div>
        </div>
        <div className="masthead-actions">
          <button
            className="btn"
            onClick={() => onOpenDocument('Q3 2026 Security Capital Allocation Proposal', 'Investment Decision Package')}
          >
            Generate decision paper
          </button>
          <button
            className="btn primary"
            onClick={() => setIsSignOffModalOpen(true)}
            disabled={!portfolio.isFeasible || portfolio.selectedInvestments.length === 0}
          >
            Submit for executive sign-off
          </button>
        </div>
      </div>

      <div className={`callout ${portfolio.meetsRiskAppetite ? 'teal' : 'amber'}`}>
        <strong>{portfolio.meetsRiskAppetite ? 'Board appetite met:' : 'Board appetite remains exceeded:'}</strong>{' '}
        {portfolio.meetsRiskAppetite
          ? `The recommended portfolio reduces expected residual loss to ${formatCrore(portfolio.residualRisk)} against the ${formatCrore(BOARD_RISK_APPETITE)} threshold.`
          : `Even the current recommendation leaves ${formatCrore(portfolio.residualRisk)} of expected annual loss against the ${formatCrore(BOARD_RISK_APPETITE)} threshold. Consider additional capital or accepted residual risk.`}
      </div>

      {!portfolio.isFeasible && (
        <div className="callout crimson"><strong>Constraint conflict:</strong> {portfolio.reason}</div>
      )}

      {/* Strategic Portfolio Comparison Grid */}
      <h2 className="section">Strategic Portfolio Benchmark</h2>
      <div className="section-sub">Compare four executive investment postures against board risk thresholds and financial return metrics.</div>

      <div className="grid4" style={{ marginTop: '12px' }}>
        {strategyComparisons.map((strat) => {
          const isSelected = activeStrategy === strat.id;
          return (
            <div
              key={strat.id}
              onClick={() => {
                setActiveStrategy(strat.id as any);
                if (strat.id === 'max_roi') {
                  setBudget(6500000);
                  setObjective('roi');
                } else if (strat.id === 'ai_optimal') {
                  setBudget(10000000);
                  setObjective('risk-reduction');
                } else if (strat.id === 'aggressive') {
                  setBudget(16500000);
                  setObjective('risk-reduction');
                }
              }}
              style={{
                border: isSelected ? '2px solid #0C233F' : '1px solid var(--line)',
                borderRadius: '8px',
                padding: '16px',
                background: isSelected ? '#F8FAFC' : 'var(--bg)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{strat.name}</span>
                <span className={`badge ${strat.badgeColor}`}>{strat.badge}</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#0C233F', margin: '6px 0' }}>
                {strat.cost === 0 ? '₹0 Spend' : formatLakh(strat.cost)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--sub)', minHeight: '36px', lineHeight: '1.4' }}>
                {strat.description}
              </div>
              <div style={{ marginTop: '12px', borderTop: '1px solid var(--line)', paddingTop: '10px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--sub)' }}>Residual Loss:</span>
                  <span style={{ fontWeight: 600, color: strat.residualRisk <= BOARD_RISK_APPETITE ? 'var(--teal)' : 'var(--crimson)' }}>
                    {formatCrore(strat.residualRisk)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--sub)' }}>Payback:</span>
                  <span style={{ fontWeight: 600 }}>{strat.paybackMonths > 0 ? `${strat.paybackMonths} mo` : 'N/A'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Parameters & Recommended Portfolio */}
      <div className="grid2" style={{ marginTop: '24px' }}>
        <div>
          <h2 className="section">Optimization Parameters</h2>
          <div className="section-sub">The recommendation updates in real-time as capital, objective, or required controls change.</div>

          <div className="slider-row">
            <div className="top">
              <span className="lbl">Security Capital Budget</span>
              <span className="val">{formatLakh(budget)} ({formatCrore(budget)})</span>
            </div>
            <input
              aria-label="Security capital budget"
              type="range"
              min="2000000"
              max="20000000"
              step="500000"
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--sub)', marginTop: '4px' }}>
              <span>Min: ₹20 Lakh</span>
              <span style={{ color: '#0C233F', fontWeight: 600 }}>Inflection Sweet Spot: ₹1.00 Cr</span>
              <span>Cap: ₹2.00 Crore</span>
            </div>
          </div>

          <div className="form-row" style={{ padding: '0 0 12px', gridTemplateColumns: '1fr' }}>
            <label htmlFor="portfolio-objective">Optimization objective</label>
            <select
              id="portfolio-objective"
              value={objective}
              onChange={(event) => setObjective(event.target.value as PortfolioObjective)}
              aria-label="Optimization objective"
            >
              <option value="risk-reduction">Maximize expected risk reduction (MILP 0/1)</option>
              <option value="roi">Maximize risk-reduction Return on Investment (ROSI)</option>
              <option value="risk-appetite">Meet board appetite at lowest cost</option>
            </select>
          </div>

          <div className="kv"><span className="k">Baseline expected annual loss</span><span className="v">{formatCrore(BASELINE_LOSS)}</span></div>
          <div className="kv"><span className="k">Board risk appetite threshold</span><span className="v">{formatCrore(BOARD_RISK_APPETITE)}</span></div>
          <div className="kv"><span className="k">Required-control capital reserved</span><span className="v">{formatLakh(requiredCost)}</span></div>
        </div>

        <div>
          <div className="portfolio-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--ink)' }}>Recommended Portfolio</div>
                <div style={{ color: 'var(--sub)', fontSize: '12px', marginTop: '3px' }}>{objectiveLabel}</div>
              </div>
              <span className={`badge ${portfolio.meetsRiskAppetite ? 'good' : 'warn'}`}>
                {portfolio.meetsRiskAppetite ? 'Within appetite' : 'Residual risk'}
              </span>
            </div>

            {portfolio.selectedInvestments.length > 0 ? (
              <ul className="portfolio-list">
                {portfolio.selectedInvestments.map((investment) => (
                  <li key={investment.id}>
                    <span>{investment.name}</span>
                    <span style={{ fontWeight: 500 }}>{investment.initialCostFormatted}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--sub)', fontSize: '13px', margin: '16px 0' }}>No portfolio can be recommended for the current constraints.</p>
            )}

            <div className="portfolio-stats">
              <div className="pstat"><div className="l">Capital committed</div><div className="v">{formatLakh(portfolio.totalCost)}</div></div>
              <div className="pstat"><div className="l">Expected risk reduced</div><div className="v" style={{ color: 'var(--teal)' }}>{formatCrore(portfolio.expectedRiskReduction)}</div></div>
              <div className="pstat"><div className="l">Residual annual loss</div><div className="v">{formatCrore(portfolio.residualRisk)}</div></div>
              <div className="pstat"><div className="l">Portfolio ROSI</div><div className="v" style={{ color: 'var(--teal)' }}>{Math.round(portfolio.riskReductionRoi)}%</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Pareto Frontier Curve */}
      <h2 className="section">Continuous Pareto Optimal Frontier</h2>
      <div className="section-sub">
        Trade-off efficiency curve: demonstrates the diminishing marginal risk reduction per ₹10 Lakh of additional security capital.
      </div>

      <div style={{ border: '1px solid var(--line)', borderRadius: '8px', padding: '20px', background: '#FFFFFF', marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)' }}>Capital Allocation vs Residual Risk Curve</span>
            <span style={{ fontSize: '12px', color: 'var(--sub)', marginLeft: '12px' }}>Click any point to load budget</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', background: '#0C233F', borderRadius: '50%' }} /> Pareto Optimal Point
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', background: 'var(--teal)', borderRadius: '50%' }} /> Efficiency Sweet Spot
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px', alignItems: 'flex-end', height: '180px', padding: '10px 0', borderBottom: '2px solid #0C233F' }}>
          {paretoPoints.map((pt, idx) => {
            const heightPct = Math.max(15, Math.min(100, 100 - (pt.residualRisk / BASELINE_LOSS) * 100));
            const isHovered = hoveredFrontierPoint === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredFrontierPoint(idx)}
                onMouseLeave={() => setHoveredFrontierPoint(null)}
                onClick={() => setBudget(pt.budget)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  height: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: pt.isSweetSpot ? 'var(--teal)' : 'var(--ink)',
                    marginBottom: '4px',
                    opacity: isHovered || pt.isCurrent || pt.isSweetSpot ? 1 : 0.7,
                  }}
                >
                  {formatCrore(pt.residualRisk)}
                </div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '38px',
                    height: `${heightPct}%`,
                    background: pt.isSweetSpot
                      ? 'linear-gradient(180deg, #10B981 0%, #059669 100%)'
                      : pt.isCurrent
                      ? 'linear-gradient(180deg, #0C233F 0%, #1E3A8A 100%)'
                      : '#E2E8F0',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s ease',
                    border: isHovered ? '2px solid #0C233F' : 'none',
                  }}
                />
                <div style={{ fontSize: '10px', color: 'var(--sub)', marginTop: '8px', textAlign: 'center' }}>
                  {formatLakh(pt.budget)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate Security Investments */}
      <h2 className="section">Candidate Security Investments & Governance Constraints</h2>
      <div className="section-sub">Mark controls as mandatory to enforce regulatory directives. The solver guarantees feasibility against all constraints.</div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Control Name</th>
            <th>Capital Cost</th>
            <th>Expected Risk Reduction</th>
            <th>Implementation</th>
            <th>Model Decision</th>
            <th style={{ textAlign: 'right' }}>Governance Constraint</th>
          </tr>
        </thead>
        <tbody>
          {mockInvestments.map((investment) => {
            const isRequired = requiredInvestmentIds.includes(investment.id);
            const isSelected = selectedInvestmentIds.has(investment.id);
            return (
              <tr key={investment.id} style={{ backgroundColor: isSelected ? '#F8FAFC' : undefined }}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{investment.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--sub)', marginTop: '2px' }}>{investment.description}</div>
                </td>
                <td className="num">{investment.initialCostFormatted}</td>
                <td className="num" style={{ color: 'var(--teal)' }}>↓ {investment.expectedRiskReductionFormatted}</td>
                <td>{investment.implementationDays} days</td>
                <td><span className={`badge ${isSelected ? 'good' : 'neutral'}`}>{isSelected ? 'Recommended' : 'Not selected'}</span></td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className={`btn sm ${isRequired ? 'primary' : ''}`}
                    onClick={() => handleToggleRequirement(investment.id)}
                  >
                    {isRequired ? '✓ Required' : 'Require control'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <footer className="disclaimer">
        The portfolio solver executes 0/1 mixed-integer linear programming (MILP) against the chosen budget and governance constraints. Multi-control overlap discounts are applied at 12% to prevent double-counting.
      </footer>

      <ExecutiveSignOffModal
        isOpen={isSignOffModalOpen}
        onClose={() => setIsSignOffModalOpen(false)}
        totalCost={portfolio.totalCost}
        riskReduced={portfolio.expectedRiskReduction}
        roiPct={Math.round(portfolio.riskReductionRoi)}
        onConfirmSignOff={(signData) => {
          onShowToast('success', 'Board Requisition Authorized', `Capital allocation of ${formatLakh(portfolio.totalCost)} signed off by ${signData.approver}. Cost Center: ${signData.costCenter}`);
        }}
      />
    </div>
  );
};
