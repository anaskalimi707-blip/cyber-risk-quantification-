import React, { useState, lazy, Suspense } from 'react';
import { NavigationPage } from '../../types';
import { mockRiskScenarios } from '../../data/mockData';
import { downloadRiskLedgerCsv } from '../../utils/riskLedgerExport';
import { Download, PlayCircle, Shield, AlertTriangle, TrendingUp } from 'lucide-react';
import { useRiskDecision } from '../../context/RiskDecisionContext';
import { formatCrore, formatLakh } from '../../utils/formatters';

const RiskCommandCenter3D = lazy(() => import('./RiskCommandCenter3D').then(m => ({ default: m.RiskCommandCenter3D })));

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
  const { totalEalInr, totalExposureInr, riskAppetiteInr, totalRiskReducedInr } = useRiskDecision();
  
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

  const isBreach = totalEalInr > riskAppetiteInr;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Premium Hero Section */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Left Column: Financial Statements */}
        <div className="xl:w-1/3 flex flex-col gap-4">
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900/10 rounded-full blur-3xl"></div>
            <h2 className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-1">Total Cyber Exposure (EAL)</h2>
            <div className={`text-5xl font-serif tracking-tight ${isBreach ? 'text-red-400' : 'text-gray-100'} font-medium`}>
              {formatCrore(totalEalInr)}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1"><TrendingUp size={14} className="text-red-500"/> +4.2% MoM</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 shadow-lg">
              <h3 className="text-gray-500 text-[10px] tracking-widest uppercase mb-1">95% Value-at-Risk</h3>
              <div className="text-xl font-serif text-gray-300">{formatCrore(totalExposureInr)}</div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 shadow-lg">
              <h3 className="text-gray-500 text-[10px] tracking-widest uppercase mb-1">Risk Appetite</h3>
              <div className="text-xl font-serif text-gray-300">{formatCrore(riskAppetiteInr)}</div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 shadow-lg">
             <h3 className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-3">Top Causal Drivers</h3>
             <ul className="space-y-3">
               <li className="flex items-start gap-3 text-sm">
                 <span className="text-red-500 mt-1"><AlertTriangle size={14} /></span>
                 <div>
                   <span className="text-gray-200 block">Internet-facing payment infrastructure</span>
                   <span className="text-gray-500 text-xs">Primary exposure point for FIN7</span>
                 </div>
               </li>
               <li className="flex items-start gap-3 text-sm">
                 <span className="text-orange-500 mt-1"><AlertTriangle size={14} /></span>
                 <div>
                   <span className="text-gray-200 block">Exploitable vulnerability exposure</span>
                   <span className="text-gray-500 text-xs">CVE-2024-21413 present on API Gateway</span>
                 </div>
               </li>
             </ul>
          </div>
          
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2"
            onClick={() => onNavigate('optimizer')}
          >
            <Shield size={16} /> Open Investment Optimizer
          </button>
        </div>

        {/* Right Column: 3D Visualization */}
        <div className="xl:w-2/3 h-[500px]">
          <Suspense fallback={
            <div className="w-full h-full bg-gray-950 rounded-xl border border-gray-800 flex items-center justify-center">
              <div className="text-gray-500 text-sm animate-pulse">Loading 3D Constellation...</div>
            </div>
          }>
            <RiskCommandCenter3D />
          </Suspense>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-900/40 p-4 rounded-lg border border-gray-800">
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text"
            className="bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-full md:w-64"
            placeholder="Filter scenarios by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 focus:outline-none"
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Above Tolerance">Above Tolerance</option>
            <option value="Within Tolerance">Within Tolerance</option>
          </select>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors" onClick={handleExportCSV}>
            <Download size={14} /> Export CSV
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm flex items-center gap-2 transition-colors" onClick={handleRunBatchSimulation}>
            <PlayCircle size={14} className={isRunningBatch ? 'animate-spin text-blue-400' : ''} /> {isRunningBatch ? 'Simulating...' : 'Run Monte Carlo'}
          </button>
        </div>
      </div>

      {/* Scenarios Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-950">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="text-xs uppercase bg-gray-900/80 text-gray-400 border-b border-gray-800 font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4">Risk Scenario</th>
              <th className="px-6 py-4">Business Service</th>
              <th className="px-6 py-4">Expected Yearly Loss</th>
              <th className="px-6 py-4">Annual Probability</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {filteredScenarios.map((scen) => {
              const isAbove = scen.status === 'Above Tolerance';
              return (
                <tr key={scen.id} className="hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-200">{scen.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {scen.threatActor} • {scen.attackPathNodes?.length || 0} Attack Path Steps
                    </div>
                  </td>
                  <td className="px-6 py-4">{scen.businessService}</td>
                  <td className={`px-6 py-4 font-serif font-medium ${isAbove ? 'text-red-400' : 'text-gray-300'}`}>
                    {scen.expectedAnnualLossFormatted}
                  </td>
                  <td className="px-6 py-4">{Math.round(scen.probability * 100)}% / yr</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${isAbove ? 'bg-red-900/20 text-red-400 border-red-900/50' : 'bg-green-900/20 text-green-400 border-green-900/50'}`}>
                      {scen.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
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
      </div>
    </div>
  );
};
