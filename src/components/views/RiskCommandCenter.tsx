import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { mockRiskScenarios } from '../../data/mockData';
import { downloadRiskLedgerCsv } from '../../utils/riskLedgerExport';
import { Download, PlayCircle } from 'lucide-react';

interface RiskCommandCenterProps {
  onNavigate: (page: NavigationPage) => void;
  onSelectScenario: (scenarioId: string) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, description: string) => void;
}

export const RiskCommandCenter: React.FC<RiskCommandCenterProps> = ({
  onNavigate,
  onSelectScenario,
  onShowToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'loss' | 'prob' | 'name'>('loss');
  const [isRunningBatch, setIsRunningBatch] = useState(false);

  const filteredScenarios = mockRiskScenarios.filter(scen => {
    const matchSearch = scen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        scen.businessService.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || scen.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    if (sortField === 'loss') return b.expectedAnnualLoss - a.expectedAnnualLoss;
    if (sortField === 'prob') return b.probability - a.probability;
    return a.name.localeCompare(b.name);
  });

  const handleExportCSV = () => {
    if (filteredScenarios.length === 0) {
      onShowToast?.('warning', 'No Scenarios to Export', 'Adjust the filters to include at least one risk scenario.');
      return;
    }

    downloadRiskLedgerCsv(filteredScenarios, 'cyber_risk_inventory_2026.csv');
    onShowToast?.(
      'success',
      'Risk Ledger Exported',
      `Downloaded ${filteredScenarios.length} filtered scenario${filteredScenarios.length === 1 ? '' : 's'} as cyber_risk_inventory_2026.csv.`
    );
  };

  const handleRunBatchSimulation = () => {
    setIsRunningBatch(true);
    onShowToast?.('info', 'Batch Monte Carlo Triggered', 'Running 10,000 iterations per scenario across active threat models...');
    setTimeout(() => {
      setIsRunningBatch(false);
      onShowToast?.('success', 'Simulations Completed', 'FAIR loss distributions updated with latest telemetry weights.');
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      {/* Masthead */}
      <div className="masthead">
        <div>
          <div className="org">Acme Financial Services · Risk Inventory</div>
          <h1>Risk Command Center</h1>
          <div className="period">Continuous probabilistic cyber-risk quantification ledger</div>
        </div>
        <div className="masthead-actions flex items-center gap-2">
          <button 
            className="btn"
            onClick={handleExportCSV}
            title="Export CSV"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
          <button 
            className="btn"
            onClick={handleRunBatchSimulation}
            disabled={isRunningBatch}
          >
            <PlayCircle size={13} className={isRunningBatch ? 'animate-spin text-teal' : ''} />
            <span>{isRunningBatch ? 'Simulating...' : 'Run Monte Carlo'}</span>
          </button>
          <button 
            className="btn primary"
            onClick={() => onNavigate('optimizer')}
          >
            <span>Open Optimizer</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input 
          type="text"
          className="search-input"
          placeholder="Filter scenarios by name, vector, or business asset..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All Statuses ({mockRiskScenarios.length})</option>
          <option value="Above Tolerance">Above Tolerance</option>
          <option value="Within Tolerance">Within Tolerance</option>
          <option value="Under Review">Under Review</option>
        </select>
        <select value={sortField} onChange={(e) => setSortField(e.target.value as any)}>
          <option value="loss">Sort by Expected Loss (High → Low)</option>
          <option value="prob">Sort by Annual Probability</option>
          <option value="name">Sort Alphabetically</option>
        </select>
      </div>

      {/* Callout Info */}
      <div className="callout amber flex items-center justify-between">
        <div>
          <strong>Executive Risk Assessment:</strong> Total aggregate Value-at-Risk across all active scenarios is estimated at <strong>₹18.4 Crore</strong>. 2 of 3 scenarios currently exceed board risk appetite.
        </div>
        <button 
          className="link-btn shrink-0 ml-4 font-semibold"
          onClick={() => onNavigate('settings')}
        >
          Adjust Board Appetite Limits →
        </button>
      </div>

      {/* Scenarios Table */}
      <table className="ledger-table">
        <thead>
          <tr>
            <th>Risk Scenario</th>
            <th>Business Service</th>
            <th>Expected Yearly Loss</th>
            <th>95th-Percentile Loss</th>
            <th>Annual Probability</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredScenarios.map((scen) => {
            const isAbove = scen.status === 'Above Tolerance';
            return (
              <tr key={scen.id}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{scen.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--sub)', marginTop: '2px' }}>
                    {scen.threatActor} • {scen.attackPathNodes?.length || 0} Attack Path Steps
                  </div>
                </td>
                <td>{scen.businessService}</td>
                <td className="num" style={{ fontWeight: 600, color: isAbove ? 'var(--crimson)' : 'var(--ink)' }}>
                  {scen.expectedAnnualLossFormatted}
                </td>
                <td className="num">{scen.p95LossFormatted}</td>
                <td className="num">{Math.round(scen.probability * 100)}% / yr</td>
                <td>
                  <span className={`badge ${isAbove ? 'crit' : 'good'}`}>
                    {scen.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="link-btn"
                    onClick={() => {
                      onSelectScenario(scen.id);
                      onNavigate('scenarios');
                    }}
                  >
                    View details →
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <footer className="disclaimer">
        Loss calculations produced via 10,000 Monte Carlo iterations (FAIR analytical model). Click any scenario for full kill-chain attack graphs and cryptographic evidence digests.
      </footer>
    </div>
  );
};
