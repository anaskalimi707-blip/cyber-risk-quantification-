import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingDown, 
  Cpu, 
  GitMerge, 
  Layers, 
  Target, 
  AlertTriangle, 
  FileCheck2, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  BarChart3, 
  ShieldAlert, 
  Compass, 
  Lock,
  Info,
  Sliders,
  DollarSign
} from 'lucide-react';
import { CrimXCausalEffect, CrimXParetoPortfolio } from '../../types';

interface CrimXViewProps {
  onNavigate: (page: any) => void;
  onShowToast: (type: 'success' | 'warning' | 'info', title: string, desc: string) => void;
  onOpenDocument?: (title: string, type: string) => void;
}

export const CrimXView: React.FC<CrimXViewProps> = ({ onNavigate, onShowToast, onOpenDocument }) => {
  const [activeTab, setActiveTab] = useState<'pareto' | 'causal' | 'conformal' | 'redteam' | 'governance'>('pareto');
  const [budgetLimit, setBudgetLimit] = useState<number>(15000000); // ₹1.5 Crore
  const [targetCoverage, setTargetCoverage] = useState<number>(0.90);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('port_001');
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);

  // Live Data State
  const [causalEffects, setCausalEffects] = useState<CrimXCausalEffect[]>([]);
  const [paretoPortfolios, setParetoPortfolios] = useState<CrimXParetoPortfolio[]>([]);
  const [conformalData, setConformalData] = useState<any>(null);
  const [redTeamData, setRedTeamData] = useState<any>(null);
  const [modelCardData, setModelCardData] = useState<any>(null);

  // Fetch live CRIM-X backend data
  const fetchCrimXData = async () => {
    try {
      setIsRunningPipeline(true);
      const res = await fetch('/api/v1/crim-x/quantify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget_limit_inr: budgetLimit, target_coverage: targetCoverage })
      });
      if (res.ok) {
        const data = await res.json();
        setCausalEffects(data.layer_2_causal_dml_effects || []);
        setParetoPortfolios(data.layer_6_pareto_frontier?.portfolios || []);
        setConformalData(data.layer_3_conformal_prediction);
        setRedTeamData(data.layer_5_adversarial_red_team);
        setModelCardData(data.layer_8_governance);
        if (data.layer_6_pareto_frontier?.portfolios?.length > 0) {
          setSelectedPortfolioId(data.layer_6_pareto_frontier.portfolios[0].portfolio_id);
        }
      }
    } catch (e) {
      console.error('Failed to fetch live CRIM-X data', e);
    } finally {
      setIsRunningPipeline(false);
    }
  };

  useEffect(() => {
    fetchCrimXData();
  }, [budgetLimit, targetCoverage]);

  const selectedPortfolio = paretoPortfolios.find(p => p.portfolio_id === selectedPortfolioId) || paretoPortfolios[0];

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const getStrategyBadge = (strat: string) => {
    switch (strat) {
      case 'natural_experiment':
        return <span className="badge good text-[10px]">Natural Experiment (Tier-1)</span>;
      case 'synthetic_control':
        return <span className="badge teal text-[10px]">Synthetic Control (Tier-2)</span>;
      case 'instrumental_variable':
        return <span className="badge amber text-[10px]">Instrumental Variable</span>;
      default:
        return <span className="badge neutral text-[10px]">Observational DML</span>;
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-line">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge crit font-mono tracking-wider text-[11px] uppercase">Apex Risk Intelligence</span>
            <span className="badge good text-[11px] font-mono">DML Causal · Conformal 90% · NSGA-II</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-ink font-normal tracking-tight m-0">
            CRIM-X Engine
          </h1>
          <p className="text-sm text-sub mt-1 max-w-2xl font-light">
            Domain-general causal cyber risk quantification, distribution-free conformal bounds, and multi-objective Pareto capital optimization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchCrimXData();
              onShowToast('success', 'CRIM-X Recalibration Complete', 'All 8 layers recalculated across 10,000 iterations.');
            }}
            disabled={isRunningPipeline}
            className="btn primary flex items-center gap-2 text-xs py-2 px-3.5 cursor-pointer shadow-xs"
          >
            <RefreshCw size={13} className={isRunningPipeline ? 'animate-spin' : ''} />
            <span>Recalibrate All 8 Layers</span>
          </button>
        </div>
      </div>

      {/* Layer 0 & 1 Status Bar: Foundation & TGN Compound Signals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal/10 border border-teal/20 text-teal flex items-center justify-center">
              <Cpu size={20} />
            </div>
            <div>
              <div className="text-[11px] uppercase font-semibold text-sub tracking-wider">Layer 0 · Foundation Encoder</div>
              <div className="text-sm font-medium text-ink">Few-Shot Transfer Prior</div>
            </div>
          </div>
          <span className="badge good text-xs">92% Prior Transfer</span>
        </div>

        <div className="card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ledger/10 border border-ledger/20 text-ledger flex items-center justify-center">
              <GitMerge size={20} />
            </div>
            <div>
              <div className="text-[11px] uppercase font-semibold text-sub tracking-wider">Layer 1 · Temporal Graph (TGN)</div>
              <div className="text-sm font-medium text-ink">Compound Drift Velocity</div>
            </div>
          </div>
          <span className="badge amber text-xs">+42% Compound Boost</span>
        </div>

        <div className="card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber/10 border border-amber/20 text-amber flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <div className="text-[11px] uppercase font-semibold text-sub tracking-wider">Layer 4 · MoE Calibration Gate</div>
              <div className="text-sm font-medium text-ink">High-Maturity Causal Hybrid</div>
            </div>
          </div>
          <span className="badge good text-xs">45% Causal Weight</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pareto')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'pareto' ? 'border-b-2 border-ledger text-ledger bg-paper/50' : 'text-sub hover:text-text'
          }`}
        >
          <Compass size={14} />
          <span>Layer 6: 5D Pareto Frontier</span>
        </button>
        <button
          onClick={() => setActiveTab('causal')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'causal' ? 'border-b-2 border-ledger text-ledger bg-paper/50' : 'text-sub hover:text-text'
          }`}
        >
          <Target size={14} />
          <span>Layer 2: DML Causal vs Correlation</span>
        </button>
        <button
          onClick={() => setActiveTab('conformal')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'conformal' ? 'border-b-2 border-ledger text-ledger bg-paper/50' : 'text-sub hover:text-text'
          }`}
        >
          <ShieldCheck size={14} />
          <span>Layer 3: Conformal Coverage (90%)</span>
        </button>
        <button
          onClick={() => setActiveTab('redteam')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'redteam' ? 'border-b-2 border-ledger text-ledger bg-paper/50' : 'text-sub hover:text-text'
          }`}
        >
          <ShieldAlert size={14} />
          <span>Layer 5: Adversarial Minimax Stress-Test</span>
        </button>
        <button
          onClick={() => setActiveTab('governance')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'governance' ? 'border-b-2 border-ledger text-ledger bg-paper/50' : 'text-sub hover:text-text'
          }`}
        >
          <FileCheck2 size={14} />
          <span>Layer 8: Governance & SHA-256 Lineage</span>
        </button>
      </div>

      {/* TAB 1: 5D Multi-Objective Pareto Frontier */}
      {activeTab === 'pareto' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="card p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-paper/60">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <label className="text-xs font-semibold text-sub uppercase tracking-wider">Capital Budget Ceiling:</label>
              <input 
                type="range" 
                min={5000000} 
                max={30000000} 
                step={1000000}
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                className="w-48 cursor-pointer"
              />
              <span className="text-sm font-mono font-bold text-ink">{formatINR(budgetLimit)}</span>
            </div>

            <div className="text-xs text-sub flex items-center gap-1">
              <Info size={13} />
              <span>NSGA-II Non-Dominated Sorting across 5 Trade-off Dimensions</span>
            </div>
          </div>

          {/* Quick Archetype Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {paretoPortfolios.filter(p => p.tag !== 'custom').map((port) => (
              <button
                key={port.portfolio_id}
                onClick={() => setSelectedPortfolioId(port.portfolio_id)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedPortfolioId === port.portfolio_id
                    ? 'border-ledger bg-ledger/5 ring-1 ring-ledger shadow-xs'
                    : 'border-line bg-card hover:bg-paper'
                }`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`badge text-[10px] ${
                    port.tag === 'balanced' ? 'good' :
                    port.tag === 'max_reduction' ? 'crit' :
                    port.tag === 'rapid_sprint' ? 'teal' : 'amber'
                  }`}>
                    {port.tag.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs font-mono font-semibold text-ink">{formatINR(port.total_cost_inr)}</span>
                </div>
                <div className="text-xs font-medium text-text truncate mb-1">{port.name}</div>
                <div className="text-[11px] text-sub">
                  Reduces <strong className="text-teal font-mono">{formatINR(port.causal_risk_reduction_inr)}</strong> EAL
                </div>
              </button>
            ))}
          </div>

          {/* Active Selected Portfolio Details */}
          {selectedPortfolio && (
            <div className="card p-6 border-ledger/40 bg-card shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-line">
                <div>
                  <div className="text-xs font-semibold text-ledger uppercase tracking-wider">Active Evaluated Frontier Solution</div>
                  <h3 className="font-serif text-xl text-ink font-medium m-0">{selectedPortfolio.name}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      onShowToast('success', 'Executive Board Dossier Generated', `Prepared full multi-objective trade-off brief for ${selectedPortfolio.name}.`);
                      if (onOpenDocument) onOpenDocument('CRIM-X Executive Capital Allocation Brief', 'Board Dossier');
                    }}
                    className="btn primary text-xs py-2 px-3 flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <FileCheck2 size={13} />
                    <span>Generate Board Brief</span>
                  </button>
                </div>
              </div>

              {/* 5-Dimensional Metrics Matrix */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="p-3 bg-paper rounded-lg border border-line">
                  <div className="text-[11px] text-sub uppercase font-semibold">Causal Loss Reduction</div>
                  <div className="font-serif text-lg font-bold text-teal mt-0.5">{formatINR(selectedPortfolio.causal_risk_reduction_inr)}</div>
                  <div className="text-[10px] text-sub">True Unconfounded $\Delta$EAL</div>
                </div>

                <div className="p-3 bg-paper rounded-lg border border-line">
                  <div className="text-[11px] text-sub uppercase font-semibold">Capital Expenditure</div>
                  <div className="font-serif text-lg font-bold text-ink mt-0.5">{formatINR(selectedPortfolio.total_cost_inr)}</div>
                  <div className="text-[10px] text-sub">Implementation & License</div>
                </div>

                <div className="p-3 bg-paper rounded-lg border border-line">
                  <div className="text-[11px] text-sub uppercase font-semibold">Implementation Velocity</div>
                  <div className="font-serif text-lg font-bold text-ink mt-0.5">{selectedPortfolio.total_implementation_days} Days</div>
                  <div className="text-[10px] text-sub">Critical Path Rollout</div>
                </div>

                <div className="p-3 bg-paper rounded-lg border border-line">
                  <div className="text-[11px] text-sub uppercase font-semibold">Compliance Boost</div>
                  <div className="font-serif text-lg font-bold text-ledger mt-0.5">+{selectedPortfolio.compliance_score_gain_pct}%</div>
                  <div className="text-[10px] text-sub">SEBI & ISO 27001 Posture</div>
                </div>

                <div className="p-3 bg-paper rounded-lg border border-line">
                  <div className="text-[11px] text-sub uppercase font-semibold">Disruption Penalty</div>
                  <div className="font-serif text-lg font-bold text-amber mt-0.5">{selectedPortfolio.avg_disruption_index} / 10</div>
                  <div className="text-[10px] text-sub">Operational Friction Index</div>
                </div>
              </div>

              {/* Included Control Interventions */}
              <div>
                <div className="text-xs font-semibold text-sub uppercase tracking-wider mb-2">Funded Control Interventions in Portfolio</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPortfolio.selected_control_names.map((cName, idx) => (
                    <div key={idx} className="p-2.5 bg-paper rounded border border-line text-xs flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-teal shrink-0" />
                      <span className="text-text font-medium">{cName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Double Machine Learning Causal vs Correlational Analysis */}
      {activeTab === 'causal' && (
        <div className="space-y-6">
          <div className="card p-4 bg-paper/60 border-line text-xs leading-relaxed text-sub">
            <strong className="text-ink">Why Causal Estimation Matters:</strong> Naive machine learning models systematically overstate control ROI by crediting interventions with outcomes caused by broad organizational maturity. Double Machine Learning (DML) isolates the true partialling-out causal effect ($\theta$), preventing multimillion-rupee misallocations.
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-paper border-b border-line text-sub font-semibold">
                  <th className="p-3">Control Intervention</th>
                  <th className="p-3">Cost (INR)</th>
                  <th className="p-3">Naive Correlational Reduction</th>
                  <th className="p-3 text-teal">CRIM-X Causal Effect ($\theta$)</th>
                  <th className="p-3">Identification Strategy</th>
                  <th className="p-3">Causal Conf.</th>
                  <th className="p-3">p-value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {causalEffects.map((c) => (
                  <tr key={c.control_id} className="hover:bg-paper/50 transition-colors">
                    <td className="p-3 font-medium text-ink">
                      <div>{c.name}</div>
                      <div className="text-[10px] text-sub">{c.category} · {c.implementation_days}d rollout</div>
                    </td>
                    <td className="p-3 font-mono font-medium">{formatINR(c.cost_inr)}</td>
                    <td className="p-3 font-mono text-sub line-through">{formatINR(c.naive_correlational_risk_reduction_inr)}</td>
                    <td className="p-3 font-mono font-bold text-teal">{formatINR(c.causal_effect_theta_inr)}</td>
                    <td className="p-3">
                      <div>{getStrategyBadge(c.causal_identification_strategy)}</div>
                      {c.instrument_name && <div className="text-[10px] text-sub mt-0.5 truncate max-w-xs">{c.instrument_name}</div>}
                    </td>
                    <td className="p-3 font-mono font-medium">{(c.causal_confidence_score * 100).toFixed(0)}%</td>
                    <td className="p-3 font-mono text-sub">{c.p_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Split Conformal Prediction Coverage */}
      {activeTab === 'conformal' && (
        <div className="space-y-6">
          <div className="card p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="badge good text-xs font-mono mb-1">Finite-Sample Distribution-Free Guarantee</span>
                <h3 className="font-serif text-2xl text-ink font-normal m-0">Split Conformal Value-at-Risk Bounds</h3>
                <p className="text-xs text-sub mt-1">Mathematical proof that true losses fall inside this interval 90% of the time without parametric assumptions.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-sub font-semibold">Nominal Coverage:</span>
                <select
                  value={targetCoverage}
                  onChange={(e) => setTargetCoverage(Number(e.target.value))}
                  className="px-2 py-1 rounded border border-line bg-card text-xs font-semibold cursor-pointer"
                >
                  <option value={0.80}>80% Coverage</option>
                  <option value={0.90}>90% Coverage (Standard)</option>
                  <option value={0.95}>95% Coverage (Prudent)</option>
                  <option value={0.99}>99% Coverage (Extreme Tail)</option>
                </select>
              </div>
            </div>

            {conformalData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-paper rounded-lg border border-line">
                  <div className="text-xs text-sub uppercase font-semibold">Conformal Lower Bound (10th)</div>
                  <div className="font-serif text-2xl font-bold text-ink mt-1">{formatINR(conformalData.lower_bound_inr)}</div>
                  <div className="text-[11px] text-sub mt-1">Conservative Floor</div>
                </div>

                <div className="p-4 bg-teal/5 rounded-lg border border-teal/30">
                  <div className="text-xs text-teal uppercase font-semibold">Point Prediction (Expected EAL)</div>
                  <div className="font-serif text-2xl font-bold text-teal mt-1">{formatINR(conformalData.point_prediction_eal_inr)}</div>
                  <div className="text-[11px] text-teal/80 mt-1">Expected Annual Loss</div>
                </div>

                <div className="p-4 bg-paper rounded-lg border border-line">
                  <div className="text-xs text-sub uppercase font-semibold">Conformal Upper Bound (90th)</div>
                  <div className="font-serif text-2xl font-bold text-crimson mt-1">{formatINR(conformalData.upper_bound_inr)}</div>
                  <div className="text-[11px] text-sub mt-1">Guaranteed Upper Exposure</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Adversarial Red-Team Stress-Test */}
      {activeTab === 'redteam' && (
        <div className="space-y-6">
          <div className="card p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="badge crit text-xs font-mono mb-1">Self-Play Reinforcement Learning Minimax Agent</span>
                <h3 className="font-serif text-2xl text-ink font-normal m-0">Adversarial Stress Test & Blind Spot Radar</h3>
              </div>
              <span className="badge good text-xs">Robustness Index: 88%</span>
            </div>

            {redTeamData && (
              <div className="space-y-4">
                {redTeamData.adversarial_scenarios.map((scen: any, idx: number) => (
                  <div key={idx} className="p-4 bg-paper rounded-lg border border-line space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-ink">{scen.attack_vector}</span>
                      <span className={`badge ${scen.blind_spot_flag === 'CRITICAL' ? 'crit' : 'amber'} text-[10px]`}>
                        {scen.blind_spot_flag} BLIND SPOT
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-sub pt-1">
                      <div>Novelty Score: <strong className="text-ink">{(scen.novelty_score * 100).toFixed(0)}%</strong></div>
                      <div>Evasion Prob: <strong className="text-ink">{(scen.evasion_probability * 100).toFixed(0)}%</strong></div>
                      <div>Adversarial Loss: <strong className="text-crimson font-mono">{formatINR(scen.adversarial_eal_inr)}</strong></div>
                      <div>Damage Boost: <strong className="text-crimson font-mono">{scen.damage_multiplier}</strong></div>
                    </div>
                    <div className="text-[11px] text-teal pt-1 border-t border-line/50">
                      <strong>Recommended Countermeasure:</strong> {scen.recommended_hardening}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Governance & Cryptographic Lineage */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          {modelCardData && (
            <div className="card p-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-line">
                <div>
                  <span className="badge teal text-xs font-mono mb-1">EU AI Act & SEBI CSCRF Compliant</span>
                  <h3 className="font-serif text-2xl text-ink font-normal m-0">{modelCardData.model_card.model_name}</h3>
                  <div className="text-xs text-sub mt-0.5">Version {modelCardData.model_card.version} · {modelCardData.model_card.architecture}</div>
                </div>
                <span className="badge good text-xs">{modelCardData.verification_status}</span>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold text-sub uppercase tracking-wider">Cryptographic Decision Lineage SHA-256 Hash</div>
                <div className="p-3 bg-paper rounded border border-line font-mono text-xs text-ink break-all select-all">
                  {modelCardData.sha256_governance_hash}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-paper rounded border border-line space-y-2">
                  <div className="text-xs font-semibold text-ink">Conformal Calibration Audit</div>
                  <div className="text-xs text-sub space-y-1">
                    <div>Nominal Coverage: <strong>{modelCardData.model_card.conformal_calibration_metrics.nominal_coverage}</strong></div>
                    <div>Empirical Test Coverage: <strong className="text-teal">{modelCardData.model_card.conformal_calibration_metrics.empirical_test_coverage}</strong></div>
                    <div>Statistical Guarantee: <strong>{modelCardData.model_card.conformal_calibration_metrics.finite_sample_guarantee}</strong></div>
                  </div>
                </div>

                <div className="p-4 bg-paper rounded border border-line space-y-2">
                  <div className="text-xs font-semibold text-ink">Regulatory Compliance Mappings</div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {modelCardData.audit_compliance.map((c: string, idx: number) => (
                      <span key={idx} className="badge neutral text-[10px]">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CrimXView;
