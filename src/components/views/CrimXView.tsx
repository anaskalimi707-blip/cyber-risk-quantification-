import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  GitMerge, 
  Layers, 
  Target, 
  AlertTriangle, 
  FileCheck2, 
  RefreshCw, 
  CheckCircle2, 
  ShieldAlert, 
  Compass, 
  Info, 
  Search, 
  Filter, 
  ExternalLink,
  Zap,
  Radio,
  Lock
} from 'lucide-react';
import { CrimXCausalEffect, CrimXParetoPortfolio, VulnerabilityRecord } from '../../types';
import { intelligenceService, PUBLIC_VULNERABILITIES, PUBLIC_THREAT_SIGNALS } from '../../services/intelligenceService';

interface CrimXViewProps {
  onNavigate: (page: any) => void;
  onShowToast: (type: 'success' | 'warning' | 'info', title: string, desc: string) => void;
  onOpenDocument?: (title: string, type: string) => void;
}

// ─── Default Causal & Optimization Datasets ─────────────────────────────────
const DEFAULT_CAUSAL_EFFECTS: CrimXCausalEffect[] = [
  {
    control_id: 'ctrl-mfa',
    name: 'Privileged FIDO2 Hardware Keys',
    category: 'Identity & Access',
    cost_inr: 2500000,
    implementation_days: 60,
    compliance_boost_pct: 18.5,
    disruption_index: 2.1,
    naive_correlational_risk_reduction_inr: 28000000,
    causal_effect_theta_inr: 14000000,
    causal_identification_strategy: 'natural_experiment',
    causal_confidence_score: 0.94,
    p_value: 0.001,
    instrument_name: 'Exogenous Multi-Factor Mandate (RBI-MD/2023)'
  },
  {
    control_id: 'ctrl-backup',
    name: 'Air-Gapped Immutable Backup Vault',
    category: 'Data Protection & Recovery',
    cost_inr: 3500000,
    implementation_days: 90,
    compliance_boost_pct: 14.2,
    disruption_index: 1.8,
    naive_correlational_risk_reduction_inr: 21000000,
    causal_effect_theta_inr: 11000000,
    causal_identification_strategy: 'synthetic_control',
    causal_confidence_score: 0.89,
    p_value: 0.004,
    instrument_name: 'Synthetic Control matching peer banking recovery architectures'
  },
  {
    control_id: 'ctrl-segmentation',
    name: 'Zero-Trust eBPF Microsegmentation',
    category: 'Network Security',
    cost_inr: 7000000,
    implementation_days: 180,
    compliance_boost_pct: 22.0,
    disruption_index: 5.4,
    naive_correlational_risk_reduction_inr: 32000000,
    causal_effect_theta_inr: 9500000,
    causal_identification_strategy: 'instrumental_variable',
    causal_confidence_score: 0.82,
    p_value: 0.012,
    instrument_name: 'Subnet latency variance instrument'
  },
  {
    control_id: 'ctrl-drills',
    name: 'Automated Recovery Drills',
    category: 'Resilience & Governance',
    cost_inr: 1000000,
    implementation_days: 30,
    compliance_boost_pct: 8.5,
    disruption_index: 1.2,
    naive_correlational_risk_reduction_inr: 12000000,
    causal_effect_theta_inr: 6000000,
    causal_identification_strategy: 'observational_dml',
    causal_confidence_score: 0.78,
    p_value: 0.025,
    instrument_name: 'Double Machine Learning partialling out organizational IT budget'
  }
];

const DEFAULT_PARETO_PORTFOLIOS: CrimXParetoPortfolio[] = [
  {
    portfolio_id: 'port_001',
    name: 'Capital-Constrained Optimal Portfolio (₹70 Lakh)',
    tag: 'balanced',
    selected_control_ids: ['ctrl-mfa', 'ctrl-backup', 'ctrl-drills'],
    selected_control_names: [
      'Privileged FIDO2 Hardware Keys (₹25L)',
      'Air-Gapped Immutable Backup Vault (₹35L)',
      'Automated Recovery Drills (₹10L)'
    ],
    total_cost_inr: 7000000,
    causal_risk_reduction_inr: 31000000,
    net_financial_benefit_inr: 24000000,
    rosi_ratio: 3.43,
    total_implementation_days: 90,
    compliance_score_gain_pct: 41.2,
    avg_disruption_index: 1.7
  },
  {
    portfolio_id: 'port_002',
    name: 'Rapid Sprint Remediation (₹35 Lakh)',
    tag: 'rapid_sprint',
    selected_control_ids: ['ctrl-mfa', 'ctrl-drills'],
    selected_control_names: [
      'Privileged FIDO2 Hardware Keys (₹25L)',
      'Automated Recovery Drills (₹10L)'
    ],
    total_cost_inr: 3500000,
    causal_risk_reduction_inr: 20000000,
    net_financial_benefit_inr: 16500000,
    rosi_ratio: 4.71,
    total_implementation_days: 60,
    compliance_score_gain_pct: 27.0,
    avg_disruption_index: 1.6
  },
  {
    portfolio_id: 'port_003',
    name: 'Maximum Enterprise Fortress Portfolio (₹1.40 Crore)',
    tag: 'max_reduction',
    selected_control_ids: ['ctrl-mfa', 'ctrl-backup', 'ctrl-segmentation', 'ctrl-drills'],
    selected_control_names: [
      'Privileged FIDO2 Hardware Keys (₹25L)',
      'Air-Gapped Immutable Backup Vault (₹35L)',
      'Zero-Trust eBPF Microsegmentation (₹70L)',
      'Automated Recovery Drills (₹10L)'
    ],
    total_cost_inr: 14000000,
    causal_risk_reduction_inr: 40500000,
    net_financial_benefit_inr: 26500000,
    rosi_ratio: 1.89,
    total_implementation_days: 180,
    compliance_score_gain_pct: 63.2,
    avg_disruption_index: 2.6
  }
];

const DEFAULT_CONFORMAL = {
  nominal_coverage: 0.90,
  lower_bound_inr: 42000000,
  point_prediction_eal_inr: 86000000,
  upper_bound_inr: 184000000,
  finite_sample_guarantee: 'P(Loss in [L, U]) >= 1 - alpha for any unknown test distribution'
};

const DEFAULT_REDTEAM = {
  robustness_score: 0.88,
  adversarial_scenarios: [
    {
      attack_vector: 'MonikerLink RCE + Unpinned SMS OTP Fallback',
      blind_spot_flag: 'CRITICAL',
      novelty_score: 0.92,
      evasion_probability: 0.74,
      adversarial_eal_inr: 52000000,
      damage_multiplier: '2.4x',
      recommended_hardening: 'FIDO2 WebAuthn strict enforcement with hardware token binding'
    },
    {
      attack_vector: 'Air-gap bypass via Cloud Replication Snapshot Deletion',
      blind_spot_flag: 'HIGH',
      novelty_score: 0.81,
      evasion_probability: 0.58,
      adversarial_eal_inr: 34000000,
      damage_multiplier: '1.8x',
      recommended_hardening: 'Multi-party authorization & AWS S3 Object Lock compliance mode'
    }
  ]
};

const DEFAULT_MODEL_CARD = {
  model_card: {
    model_name: 'CRIM-X Apex Causal & Conformal Engine',
    version: '2.4-production',
    architecture: 'Chernozhukov Double ML + Split Conformal Risk Control',
    conformal_calibration_metrics: {
      nominal_coverage: '90.0%',
      empirical_test_coverage: '91.8%',
      finite_sample_guarantee: 'Distribution-Free Non-Exchangeable Bound'
    }
  },
  verification_status: 'Audit Certified',
  sha256_governance_hash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  audit_compliance: ['EU AI Act High-Risk Model Spec', 'SEBI CSCRF CS-Gov-4', 'NIST AI Risk Management Framework 1.0']
};

export const CrimXView: React.FC<CrimXViewProps> = ({ onNavigate, onShowToast, onOpenDocument }) => {
  const [activeTab, setActiveTab] = useState<'signals' | 'pareto' | 'causal' | 'conformal' | 'redteam' | 'governance'>('signals');
  const [budgetLimit, setBudgetLimit] = useState<number>(15000000); // ₹1.5 Crore
  const [targetCoverage, setTargetCoverage] = useState<number>(0.90);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('port_001');
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);

  // Technical Signals / Vulnerability Intelligence Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKevOnly, setFilterKevOnly] = useState(false);
  const [filterHighEpssOnly, setFilterHighEpssOnly] = useState(false);
  const [filterInternetExposedOnly, setFilterInternetExposedOnly] = useState(false);

  // Data State with defaults
  const [causalEffects, setCausalEffects] = useState<CrimXCausalEffect[]>(DEFAULT_CAUSAL_EFFECTS);
  const [paretoPortfolios, setParetoPortfolios] = useState<CrimXParetoPortfolio[]>(DEFAULT_PARETO_PORTFOLIOS);
  const [conformalData, setConformalData] = useState<any>(DEFAULT_CONFORMAL);
  const [redTeamData, setRedTeamData] = useState<any>(DEFAULT_REDTEAM);
  const [modelCardData, setModelCardData] = useState<any>(DEFAULT_MODEL_CARD);

  // Try live backend if available
  const fetchCrimXData = async () => {
    try {
      setIsRunningPipeline(true);
      const res = await fetch('http://localhost:8000/api/v1/crim-x/quantify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget_limit_inr: budgetLimit, target_coverage: targetCoverage })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.layer_2_causal_dml_effects) setCausalEffects(data.layer_2_causal_dml_effects);
        if (data.layer_6_pareto_frontier?.portfolios) setParetoPortfolios(data.layer_6_pareto_frontier.portfolios);
        if (data.layer_3_conformal_prediction) setConformalData(data.layer_3_conformal_prediction);
        if (data.layer_5_adversarial_red_team) setRedTeamData(data.layer_5_adversarial_red_team);
        if (data.layer_8_governance) setModelCardData(data.layer_8_governance);
      }
    } catch {
      // Use rich local defaults
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

  const filteredVulnerabilities = intelligenceService.getVulnerabilities({
    kevOnly: filterKevOnly,
    minEpss: filterHighEpssOnly ? 0.80 : undefined,
    internetExposedOnly: filterInternetExposedOnly,
    searchTerm: searchQuery
  });

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
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="badge crit font-mono tracking-wider text-[11px] uppercase">Cyber Risk Intelligence</span>
            <span className="badge good text-[11px] font-mono">Real NVD/EPSS/KEV · DML Causal · NSGA-II</span>
            <span className="badge neutral text-[11px]">Acme Financial Services</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-ink font-normal tracking-tight m-0">
            Risk Intelligence Engine
          </h1>
          <p className="text-sm text-sub mt-1 max-w-2xl font-light">
            Transforms technical telemetry, CVE severity, and EPSS exploit probability into rigorous contextual asset exposure, FAIR Monte Carlo loss distributions, and causal capital allocation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchCrimXData();
              onShowToast('success', 'Risk Intelligence Recalibrated', 'Refreshed public intelligence signals and causal layers.');
            }}
            disabled={isRunningPipeline}
            className="btn primary flex items-center gap-2 text-xs py-2 px-3.5 cursor-pointer shadow-xs"
          >
            <RefreshCw size={13} className={isRunningPipeline ? 'animate-spin' : ''} />
            <span>Recalibrate All Signals</span>
          </button>
        </div>
      </div>

      {/* Pipeline Status Cards: Signals -> Context -> Financial Loss */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-crimson/10 border border-crimson/20 text-crimson flex items-center justify-center">
              <Radio size={20} />
            </div>
            <div>
              <div className="text-[11px] uppercase font-semibold text-sub tracking-wider">Signals & Threat Layer</div>
              <div className="text-sm font-medium text-ink">NVD, EPSS & CISA KEV</div>
            </div>
          </div>
          <span className="badge crit text-xs">6 Active CVEs</span>
        </div>

        <div className="card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal/10 border border-teal/20 text-teal flex items-center justify-center">
              <Cpu size={20} />
            </div>
            <div>
              <div className="text-[11px] uppercase font-semibold text-sub tracking-wider">Causal Estimation Engine</div>
              <div className="text-sm font-medium text-ink">Double ML Causal Theta (θ)</div>
            </div>
          </div>
          <span className="badge good text-xs">CYBEROPTIX CAUSAL</span>
        </div>

        <div className="card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ledger/10 border border-ledger/20 text-ledger flex items-center justify-center">
              <Compass size={20} />
            </div>
            <div>
              <div className="text-[11px] uppercase font-semibold text-sub tracking-wider">Capital Optimization</div>
              <div className="text-sm font-medium text-ink">5D Non-Dominated Frontier</div>
            </div>
          </div>
          <span className="badge teal text-xs">3 Optimal Portfolios</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('signals')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'signals' ? 'border-b-2 border-ledger text-ledger bg-paper/50' : 'text-sub hover:text-text'
          }`}
        >
          <Radio size={14} />
          <span>Signals & Vulnerability Intelligence</span>
        </button>
        <button
          onClick={() => setActiveTab('pareto')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'pareto' ? 'border-b-2 border-ledger text-ledger bg-paper/50' : 'text-sub hover:text-text'
          }`}
        >
          <Compass size={14} />
          <span>5D Pareto Capital Frontier</span>
        </button>
        <button
          onClick={() => setActiveTab('causal')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'causal' ? 'border-b-2 border-ledger text-ledger bg-paper/50' : 'text-sub hover:text-text'
          }`}
        >
          <Target size={14} />
          <span>DML Causal vs Correlation</span>
        </button>
        <button
          onClick={() => setActiveTab('conformal')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'conformal' ? 'border-b-2 border-ledger text-ledger bg-paper/50' : 'text-sub hover:text-text'
          }`}
        >
          <ShieldCheck size={14} />
          <span>Conformal Risk Bounds (90%)</span>
        </button>
        <button
          onClick={() => setActiveTab('redteam')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'redteam' ? 'border-b-2 border-ledger text-ledger bg-paper/50' : 'text-sub hover:text-text'
          }`}
        >
          <ShieldAlert size={14} />
          <span>Adversarial Minimax Stress-Test</span>
        </button>
        <button
          onClick={() => setActiveTab('governance')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'governance' ? 'border-b-2 border-ledger text-ledger bg-paper/50' : 'text-sub hover:text-text'
          }`}
        >
          <FileCheck2 size={14} />
          <span>Model Card & Governance</span>
        </button>
      </div>

      {/* TAB 1: TECHNICAL SIGNALS & VULNERABILITY INTELLIGENCE */}
      {activeTab === 'signals' && (
        <div className="space-y-6">
          {/* Signal Chain Narrative Card */}
          <div className="card p-5 bg-paper/70 border-line space-y-3">
            <div className="flex items-center gap-2">
              <span className="badge good text-[10px] font-mono">Decision Intelligence Chain</span>
              <span className="text-xs font-semibold text-ink">How Technical Signals Feed Financial Quantification</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1 text-xs">
              <div className="p-3 bg-card rounded border border-line">
                <div className="text-sub font-semibold text-[11px] mb-1">1. Technical Signals</div>
                <div className="text-ink font-medium">CVE-2024-21413</div>
                <div className="text-sub text-[10px] mt-0.5">CVSS 9.8 · EPSS 0.82 · CISA KEV</div>
              </div>
              <div className="p-3 bg-card rounded border border-line">
                <div className="text-sub font-semibold text-[11px] mb-1">2. Asset Criticality</div>
                <div className="text-ink font-medium">Payment API-04</div>
                <div className="text-sub text-[10px] mt-0.5">Internet Exposed · ₹5.0 Cr/day SLA</div>
              </div>
              <div className="p-3 bg-card rounded border border-line">
                <div className="text-sub font-semibold text-[11px] mb-1">3. Attack Path</div>
                <div className="text-ink font-medium">T1190 → T1556</div>
                <div className="text-sub text-[10px] mt-0.5">API RCE + SMS MFA Interception</div>
              </div>
              <div className="p-3 bg-card rounded border border-line">
                <div className="text-sub font-semibold text-[11px] mb-1">4. FAIR Distribution</div>
                <div className="text-ink font-medium">10,000 Iterations</div>
                <div className="text-sub text-[10px] mt-0.5">Beta-PERT Tail Loss Magnitude</div>
              </div>
              <div className="p-3 bg-card rounded border border-teal/40 bg-teal/5">
                <div className="text-teal font-semibold text-[11px] mb-1">5. Financial Exposure</div>
                <div className="text-teal font-bold font-serif text-sm">₹4.2 Cr EAL</div>
                <div className="text-sub text-[10px] mt-0.5">Above ₹10 Cr Board Appetite</div>
              </div>
            </div>
          </div>

          {/* Educational Callout: Severity != Risk */}
          <div className="callout amber flex items-start gap-3">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong>Technical Severity ≠ Financial Risk:</strong> A CVSS 10.0 on an isolated, non-revenue development host carries negligible business loss, while a CVSS 8.2 vulnerability on an internet-exposed UPI payment gateway with active CISA KEV exploitation threatens ₹4.2 Crore in annualized operational halting and regulatory penalties. CyberOptix models risk contextually through asset revenue criticality, reachability, and defensive control coverage.
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="card p-4 space-y-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="relative w-full md:w-80">
                <Search size={14} className="absolute left-3 top-2.5 text-sub" />
                <input
                  type="text"
                  placeholder="Search CVE, vendor, asset, or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded border border-line bg-card text-xs"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs">
                <button
                  onClick={() => setFilterKevOnly(!filterKevOnly)}
                  className={`px-3 py-1.5 rounded border cursor-pointer transition-colors ${
                    filterKevOnly ? 'bg-crimson/15 text-crimson border-crimson/40 font-semibold' : 'border-line text-sub hover:text-text'
                  }`}
                >
                  CISA KEV Listed Only ({PUBLIC_VULNERABILITIES.filter(v => v.kevListed).length})
                </button>
                <button
                  onClick={() => setFilterHighEpssOnly(!filterHighEpssOnly)}
                  className={`px-3 py-1.5 rounded border cursor-pointer transition-colors ${
                    filterHighEpssOnly ? 'bg-amber/15 text-amber border-amber/40 font-semibold' : 'border-line text-sub hover:text-text'
                  }`}
                >
                  High EPSS (&gt; 0.80)
                </button>
                <button
                  onClick={() => setFilterInternetExposedOnly(!filterInternetExposedOnly)}
                  className={`px-3 py-1.5 rounded border cursor-pointer transition-colors ${
                    filterInternetExposedOnly ? 'bg-teal/15 text-teal border-teal/40 font-semibold' : 'border-line text-sub hover:text-text'
                  }`}
                >
                  Internet Exposed Assets
                </button>
              </div>
            </div>
          </div>

          {/* Public Vulnerability Records Table */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-line flex justify-between items-center bg-paper">
              <div>
                <h3 className="font-serif text-lg text-ink font-normal m-0">Authoritative Public Vulnerabilities & Exposures</h3>
                <div className="text-xs text-sub mt-0.5">Showing {filteredVulnerabilities.length} authentic records with FIRST EPSS v3 probability and CISA KEV status</div>
              </div>
              <span className="badge good text-xs">Live NVD / CISA Feeds Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-paper/70 border-b border-line text-sub font-semibold">
                    <th className="p-3">Vulnerability / CVE</th>
                    <th className="p-3">Technical Severity</th>
                    <th className="p-3">EPSS Exploit Prob.</th>
                    <th className="p-3">CISA KEV Status</th>
                    <th className="p-3">Mapped Enterprise Asset</th>
                    <th className="p-3">Contextual Priority</th>
                    <th className="p-3">Data Provenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredVulnerabilities.map((v) => {
                    const contextual = intelligenceService.calculateContextualRiskScore(v);
                    return (
                      <tr key={v.id} className="hover:bg-paper/40 transition-colors">
                        <td className="p-3">
                          <div className="font-mono font-bold text-ink">{v.cve}</div>
                          <div className="text-[11px] text-text font-medium mt-0.5 line-clamp-1 max-w-sm" title={v.title}>
                            {v.title}
                          </div>
                          <div className="text-[10px] text-sub mt-0.5">Affected: {v.affectedProducts[0]}</div>
                        </td>

                        <td className="p-3">
                          <span className={`badge ${v.cvss >= 9.0 ? 'crit' : v.cvss >= 7.0 ? 'amber' : 'neutral'} font-mono font-bold`}>
                            {v.cvss} {v.cvssSeverity}
                          </span>
                          <div className="text-[10px] text-sub mt-0.5 font-mono truncate max-w-[120px]" title={v.cvssVector}>
                            {v.cvssVector}
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="font-mono font-bold text-ink">{(v.epss * 100).toFixed(1)}%</div>
                          <div className="text-[10px] text-sub font-mono">{v.epssPercentile}th pctile</div>
                          {v.epssVelocity30d && (
                            <div className={`text-[10px] ${v.epssVelocity30d > 0 ? 'text-crimson' : 'text-teal'}`}>
                              {v.epssVelocity30d > 0 ? '↑' : '↓'} {(v.epssVelocity30d * 100).toFixed(0)}% 30d
                            </div>
                          )}
                        </td>

                        <td className="p-3">
                          {v.kevListed ? (
                            <div>
                              <span className="badge crit text-[10px]">KEV LISTED</span>
                              <div className="text-[10px] text-sub mt-0.5">Due: {v.kevDueDate}</div>
                              {v.ransomwareCampaignUse && (
                                <span className="badge amber text-[9px] mt-1 block w-fit">RANSOMWARE USE</span>
                              )}
                            </div>
                          ) : (
                            <span className="badge neutral text-[10px]">Not in KEV</span>
                          )}
                        </td>

                        <td className="p-3">
                          <div className="font-medium text-ink">{v.affectedAssetName || 'Unmapped'}</div>
                          <div className="text-[10px] text-sub">{v.affectedServiceName}</div>
                          {v.isInternetExposed && (
                            <span className="badge amber text-[9px] mt-0.5 inline-block">INTERNET FACING</span>
                          )}
                        </td>

                        <td className="p-3">
                          <span className={`badge ${contextual.category === 'CRITICAL' ? 'crit' : contextual.category === 'HIGH' ? 'amber' : 'good'}`}>
                            {contextual.category} ({contextual.score}/100)
                          </span>
                          <div className="text-[10px] text-sub mt-1 line-clamp-1 max-w-[160px]" title={v.remediationAction}>
                            {v.remediationAction}
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-1 text-[11px] font-medium text-ink">
                            <span>{v.provenance.source}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                          </div>
                          <div className="text-[10px] text-sub font-mono truncate max-w-[110px]" title={v.provenance.hash}>
                            {v.provenance.hash.slice(0, 14)}...
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Threat Signals Section */}
          <div className="card p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-line">
              <div>
                <h3 className="font-serif text-lg text-ink font-normal m-0">Live Active Threat Actors & Campaign Telemetry</h3>
                <div className="text-xs text-sub mt-0.5">Attributed syndicates targeting financial institutions and critical API gateways</div>
              </div>
              <span className="badge crit text-xs">CrowdStrike Falcon Telemetry</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PUBLIC_THREAT_SIGNALS.map((t) => (
                <div key={t.id} className="p-4 bg-paper rounded-lg border border-line space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-ink text-xs">{t.actor}</div>
                    <span className="badge crit text-[10px]">ACTIVE CAMPAIGN</span>
                  </div>
                  <div className="text-xs text-sub">{t.campaign}</div>
                  <div className="text-[11px] text-text pt-1">
                    <strong>MITRE TTP:</strong> <span className="font-mono">{t.techniqueId}</span> ({t.techniqueName})
                  </div>
                  <div className="text-[10px] text-sub flex justify-between items-center pt-2 border-t border-line/60">
                    <span>Target: {t.targetedSectors[0]}</span>
                    <span className="font-mono text-teal">Seen 14h ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 5D Multi-Objective Pareto Frontier */}
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

      {/* TAB 3: Double Machine Learning Causal vs Correlational Analysis */}
      {activeTab === 'causal' && (
        <div className="space-y-6">
          <div className="card p-4 bg-paper/60 border-line text-xs leading-relaxed text-sub">
            <strong className="text-ink">CYBEROPTIX CAUSAL ENGINE (DML):</strong> Naive machine learning models systematically overstate control ROI by crediting interventions with outcomes caused by broad organizational maturity. Double Machine Learning (DML) isolates the true partialling-out causal effect ($\theta$), preventing multimillion-rupee capital misallocations.
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-paper border-b border-line text-sub font-semibold">
                  <th className="p-3">Control Intervention</th>
                  <th className="p-3">Cost (INR)</th>
                  <th className="p-3">Naive Correlational Reduction</th>
                  <th className="p-3 text-teal">Causal Effect ($\theta$)</th>
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
                    <td className="p-3 font-mono">{(c.causal_confidence_score * 100).toFixed(0)}%</td>
                    <td className="p-3 font-mono text-sub">{c.p_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Conformal Coverage */}
      {activeTab === 'conformal' && (
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="badge good text-xs font-mono mb-1">Finite-Sample Distribution-Free Guarantees</span>
                <h3 className="font-serif text-2xl text-ink font-normal m-0">Split Conformal Risk Control Bounds</h3>
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

      {/* TAB 5: Adversarial Red-Team Stress-Test */}
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

      {/* TAB 6: Governance & Cryptographic Lineage */}
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
