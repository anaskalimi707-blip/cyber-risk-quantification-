import React, { useState, useRef, useEffect } from 'react';
import { NavigationPage } from '../../types';
import { ServiceDrilldownModal } from '../modals/ServiceDrilldownModal';
import { useRiskDecision } from '../../context/RiskDecisionContext';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Info,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  DollarSign,
  ShieldAlert,
  BarChart2,
  Target,
  Zap,
  Clock,
  RotateCcw,
} from 'lucide-react';

interface ExecutiveOverviewProps {
  onNavigate: (page: NavigationPage) => void;
  onSelectScenario: (scenarioId: string) => void;
  onOpenDocument: (title: string, type: string) => void;
  onInspectEvidence: (evidence: any) => void;
}

// ─── Calculation Popover ─────────────────────────────────────────────────────
const CalcPopover: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  return (
    <div className="relative inline-block" ref={ref}>
      <button
        className="calc-popover-trigger"
        onClick={() => setOpen(v => !v)}
        title="How is this calculated?"
        aria-expanded={open}
      >
        <Info size={11} />
        How calculated?
      </button>
      {open && (
        <div className="calc-popover">
          <div className="calc-popover-title">{title}</div>
          <div className="calc-popover-body">{children}</div>
        </div>
      )}
    </div>
  );
};

// ─── Risk Driver Tag ─────────────────────────────────────────────────────────
const DriverTag: React.FC<{ label: string; severity: 'critical' | 'high' | 'medium' }> = ({ label, severity }) => (
  <span className={`driver-tag ${severity}`}>{label}</span>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  onNavigate,
  onSelectScenario,
  onOpenDocument,
  onInspectEvidence,
}) => {
  const [selectedService, setSelectedService] = useState<{
    isOpen: boolean;
    name: string;
    exposure: string;
    tolerance: string;
  }>({ isOpen: false, name: '', exposure: '', tolerance: '' });

  const [driversExpanded, setDriversExpanded] = useState(false);

  // ─── Reactive Risk Decision State ───
  const {
    totalExposureFormatted,
    totalExposureInr,
    totalEalFormatted,
    totalRiskReducedFormatted,
    riskAppetiteFormatted,
    isAboveAppetite,
    appetiteExceededByFormatted,
    scenarios,
    treatments,
    resetAllDecisions
  } = useRiskDecision();

  const totalVaR = totalExposureFormatted;
  const eal = totalEalFormatted;
  const riskAppetite = riskAppetiteFormatted;
  const appetiteExceeded = isAboveAppetite;
  const appetiteExceededBy = appetiteExceededByFormatted;
  const investedThisYear = '₹1.4 Cr';
  const riskReduced = totalRiskReducedFormatted;
  const riskReductionROI = '185%';
  const riskTrendPct = isAboveAppetite ? '+8%' : '-24%';

  const topDrivers = [
    {
      rank: 1,
      label: 'Privileged MFA gap (SMS fallback)',
      detail: 'FIDO2 hardware key not enforced on 43% of admin accounts. Enables credential interception.',
      severity: 'critical' as const,
      lossContrib: '₹2.9 Cr',
      scenarioId: 'scen-ransomware-payment',
    },
    {
      rank: 2,
      label: 'Mutable backup snapshots',
      detail: 'Core payment database backups lack write-lock immutability. Full ransomware recovery unverified.',
      severity: 'critical' as const,
      lossContrib: '₹1.8 Cr',
      scenarioId: 'scen-ransomware-payment',
    },
    {
      rank: 3,
      label: 'Unpatched API gateway (CVE-2024-21413)',
      detail: 'Internet-facing payment API contains an actively exploited vulnerability (KEV listed).',
      severity: 'critical' as const,
      lossContrib: '₹1.4 Cr',
      scenarioId: 'scen-ransomware-payment',
    },
    {
      rank: 4,
      label: 'Cloud S3 object lock disabled',
      detail: 'KYC document repository lacks object-lock. Enables bulk PII exfiltration without audit trail.',
      severity: 'high' as const,
      lossContrib: '₹1.1 Cr',
      scenarioId: 'scen-customer-data-breach',
    },
    {
      rank: 5,
      label: 'Over-privileged IAM roles',
      detail: 'Developer IAM roles carry cross-region administrator rights. No session token expiry enforced.',
      severity: 'high' as const,
      lossContrib: '₹0.9 Cr',
      scenarioId: 'scen-privileged-account-takeover',
    },
    {
      rank: 6,
      label: 'Recovery test gap (9 months overdue)',
      detail: 'No validated full DR test on payment services. Residual RTO unknown — heightens ransomware impact.',
      severity: 'medium' as const,
      lossContrib: '₹0.4 Cr',
      scenarioId: 'scen-ransomware-payment',
    },
  ];

  const criticalScenarios = scenarios.map(scen => {
    const treatment = treatments[scen.id];
    let statusText: string = scen.status;
    if (treatment) {
      if (treatment.action === 'TREAT') {
        statusText = 'Treated (Residual)';
      } else if (treatment.action === 'TRANSFER') {
        statusText = 'Transferred (Insured)';
      } else if (treatment.action === 'ACCEPT') {
        statusText = 'Accepted (Active)';
      }
    }
    return {
      id: scen.id,
      name: scen.name,
      service: scen.businessService,
      eal: scen.expectedAnnualLossFormatted,
      var95: scen.p95LossFormatted,
      prob: `${Math.round(scen.probability * 100)}%`,
      threatActor: scen.threatActor,
      lastCalc: scen.lastCalculated,
      status: statusText
    };
  });

  const serviceExposure = [
    { name: 'Payment Processing', label: 'Payment Processing (UPI & NetBanking)', amount: '₹9.1 Cr', pct: 88, status: 'above', exposure: '₹9.1 cr', tolerance: 'Above tolerance', fillClass: 'crit' },
    { name: 'Customer Data & KYC', label: 'Customer Data Platform', amount: '₹5.4 Cr', pct: 58, status: 'above', exposure: '₹5.4 cr', tolerance: 'Above tolerance', fillClass: 'warn' },
    { name: 'Algorithmic Trading', label: 'Institutional Trading Platform', amount: '₹2.6 Cr', pct: 30, status: 'within', exposure: '₹2.6 cr', tolerance: 'Within tolerance', fillClass: '' },
    { name: 'Corporate IT', label: 'Corporate IT & Employee Ops', amount: '₹1.3 Cr', pct: 14, status: 'within', exposure: '₹1.3 cr', tolerance: 'Within tolerance', fillClass: '' },
  ];

  const visibleDrivers = driversExpanded ? topDrivers : topDrivers.slice(0, 3);

  return (
    <div className="animate-fade-in">

      {/* ── Synthetic Data Disclaimer Banner ── */}
      <div className="synth-banner">
        <AlertTriangle size={13} className="shrink-0" />
        <span>
          <strong>Illustrative data only.</strong> All financial exposure, EAL, and VaR figures are generated by synthetic FAIR Monte Carlo simulations on fictional "Acme Financial Services" data.
          They are not live telemetry, real company data, or certified financial figures.
        </span>
      </div>

      {/* ── Masthead ── */}
      <div className="masthead">
        <div>
          <div className="org">Acme Financial Services · Cyber Risk Command Center</div>
          <h1>Cyber Risk Overview</h1>
          <div className="period">For the period ending 3 September 2026 — Demo / Illustrative</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="freshness">
            Data refreshed <b>8 min ago</b><br />
            Risk model updated <b>11 min ago</b>
          </div>
          {Object.keys(treatments).length > 0 && (
            <button
              className="btn"
              onClick={resetAllDecisions}
              title="Reset executed risk treatments back to baseline"
              style={{ color: 'var(--crimson)' }}
            >
              <RotateCcw size={13} />
              Reset Decisions ({Object.keys(treatments).length})
            </button>
          )}
          <button
            className="btn"
            onClick={() => onOpenDocument('Q3 2026 Executive Cyber Risk & Board Briefing', 'Executive Board Briefing')}
          >
            Board Dossier
          </button>
          <button
            className="btn primary"
            onClick={() => onNavigate('optimizer')}
          >
            <TrendingUp size={13} />
            Open Optimizer
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — CURRENT FINANCIAL RISK
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="cc-hero-grid">

        {/* Primary Exposure */}
        <div className="cc-hero-primary">
          <div className="cc-hero-label">
            Total Cyber Financial Exposure
            <span className="cc-hero-live-dot" title="Updated 8 minutes ago" />
          </div>
          <div className="cc-hero-figure">
            {totalVaR}
          </div>
          <div className="cc-hero-tag above">
            <AlertTriangle size={12} />
            {riskTrendPct} vs last month · {appetiteExceededBy} above risk appetite
          </div>
          <div className="cc-hero-note">
            Driven by ransomware exposure on the payment platform and a 43% privileged-account MFA coverage gap.
          </div>
          <CalcPopover title="Financial Exposure (95th Percentile VaR)">
            <p><strong>Model:</strong> FAIR (Factor Analysis of Information Risk)</p>
            <p><strong>Iterations:</strong> 10,000 Monte Carlo simulations per scenario</p>
            <p><strong>Distribution:</strong> Beta-PERT Loss Magnitude × Threat Probability</p>
            <p><strong>Inputs:</strong> Asset criticality, EPSS exploit probability, CVSS severity, KEV status, control coverage</p>
            <p><strong>Output:</strong> Aggregate 95th-percentile loss across all active scenarios</p>
            <p><strong>Data:</strong> Synthetic illustrative data. Not live telemetry or certified financial figures.</p>
            <p><strong>Confidence:</strong> Medium–High (data quality: 86%)</p>
          </CalcPopover>
        </div>

        {/* Secondary Metrics Ledger */}
        <div className="cc-hero-ledger">
          <div className="cc-metric-cell">
            <div className="cc-metric-label">
              <BarChart2 size={12} />
              Expected Annual Loss (EAL)
            </div>
            <div className="cc-metric-value">{eal}</div>
            <div className="cc-metric-sub">Probabilistic mean loss / year</div>
            <CalcPopover title="Expected Annual Loss (EAL)">
              <p><strong>Model:</strong> Mean of 10,000 FAIR Monte Carlo outputs</p>
              <p><strong>Formula:</strong> EAL = Σ(P(event) × Loss Magnitude) across all scenarios</p>
              <p><strong>Confidence:</strong> High (92%) based on telemetry coverage</p>
              <p><strong>Data:</strong> Synthetic illustrative. Updated 11 min ago.</p>
            </CalcPopover>
          </div>

          <div className="cc-metric-cell">
            <div className="cc-metric-label">
              <Target size={12} />
              Risk Appetite Limit
            </div>
            <div className="cc-metric-value" style={{ color: appetiteExceeded ? 'var(--crimson)' : 'var(--teal)' }}>
              {riskAppetite}
            </div>
            <div className="cc-metric-sub" style={{ color: 'var(--crimson)' }}>
              Exceeded by {appetiteExceededBy}
            </div>
          </div>

          <div className="cc-metric-cell">
            <div className="cc-metric-label">
              <DollarSign size={12} />
              Security Investment (YTD)
            </div>
            <div className="cc-metric-value" style={{ color: 'var(--text)' }}>{investedThisYear}</div>
            <div className="cc-metric-sub">4 of 7 controls deployed</div>
          </div>

          <div className="cc-metric-cell">
            <div className="cc-metric-label">
              <TrendingDown size={12} />
              Risk Reduction Achieved
            </div>
            <div className="cc-metric-value" style={{ color: 'var(--teal)' }}>{riskReduced}</div>
            <div className="cc-metric-sub up-good">{riskReductionROI} ROI on security spend</div>
          </div>
        </div>

        {/* 90-Day Sparkline */}
        <div className="cc-sparkline-card">
          <div className="cc-metric-label" style={{ marginBottom: '8px' }}>90-Day Exposure Trend</div>
          <svg width="100%" height="72" viewBox="0 0 300 72" preserveAspectRatio="none">
            <defs>
              <linearGradient id="spark-grad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--crimson)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--crimson)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Appetite threshold line */}
            <line x1="0" y1="38" x2="300" y2="38" stroke="var(--amber)" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
            <text x="4" y="34" fill="var(--amber)" fontSize="8" opacity="0.8">Appetite limit</text>
            {/* Exposure curve fill */}
            <path
              d="M0,52 L40,54 L80,47 L120,41 L150,43 L170,28 L210,32 L240,19 L270,22 L300,13 L300,72 L0,72 Z"
              fill="url(#spark-grad)"
            />
            {/* Exposure curve */}
            <polyline
              fill="none"
              stroke="var(--crimson)"
              strokeWidth="2"
              points="0,52 40,54 80,47 120,41 150,43 170,28 210,32 240,19 270,22 300,13"
            />
            {/* Event markers */}
            <circle cx="170" cy="28" r="3" fill="var(--amber)" />
            <circle cx="270" cy="22" r="3" fill="var(--teal)" />
          </svg>
          <div className="cc-spark-labels">
            <span>Jun</span>
            <span style={{ color: 'var(--amber)' }}>MFA gap widened</span>
            <span style={{ color: 'var(--teal)' }}>Backups hardened</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — RISK APPETITE STATUS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="cc-appetite-bar-wrapper">
        <div className="cc-section-header">
          <div>
            <h2 className="section" style={{ marginTop: 0 }}>Risk Appetite Status</h2>
            <div className="section-sub">Board-approved risk appetite vs current modelled financial exposure.</div>
          </div>
          <button className="link-btn" onClick={() => onNavigate('settings')}>
            Adjust appetite limits →
          </button>
        </div>
        <div className="cc-appetite-track-row">
          <div className="cc-appetite-track-outer">
            <div className="cc-appetite-fill" style={{ width: `${Math.min(100, Math.max(10, (totalExposureInr / 260000000) * 100))}%`, background: appetiteExceeded ? 'var(--crimson)' : 'var(--teal)' }} />
            <div className="cc-appetite-limit-marker" style={{ left: `${(100 / 260) * 100}%` }}>
              <div className="cc-appetite-limit-label">Appetite ₹10 Cr</div>
            </div>
          </div>
          <div className="cc-appetite-value">{totalVaR}</div>
          <span className={`badge ${appetiteExceeded ? 'crit' : 'teal'}`} style={{ color: appetiteExceeded ? undefined : 'var(--teal)' }}>
            {appetiteExceeded ? 'Above Tolerance' : 'Within Tolerance'}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — WHY THE RISK EXISTS (TOP RISK DRIVERS)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="cc-section-header" style={{ marginTop: '40px' }}>
        <div>
          <h2 className="section" style={{ marginTop: 0 }}>Why The Risk Exists</h2>
          <div className="section-sub">Root-cause control gaps and threat vectors ranked by financial loss contribution.</div>
        </div>
        <button
          className="link-btn"
          onClick={() => setDriversExpanded(v => !v)}
        >
          {driversExpanded ? (
            <><ChevronUp size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> Show fewer</>
          ) : (
            <><ChevronDown size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> Show all {topDrivers.length}</>
          )}
        </button>
      </div>

      <div className="cc-drivers-list">
        {visibleDrivers.map(d => (
          <div key={d.rank} className="cc-driver-row">
            <div className="cc-driver-rank">{d.rank}</div>
            <div className="cc-driver-body">
              <div className="cc-driver-title">
                <DriverTag label={d.severity === 'critical' ? 'Critical' : d.severity === 'high' ? 'High' : 'Medium'} severity={d.severity} />
                {d.label}
              </div>
              <div className="cc-driver-detail">{d.detail}</div>
            </div>
            <div className="cc-driver-contrib">
              <div className="cc-driver-contrib-label">Loss contribution</div>
              <div className="cc-driver-contrib-value">{d.lossContrib} / yr</div>
            </div>
            <button
              className="link-btn shrink-0"
              onClick={() => { onSelectScenario(d.scenarioId); onNavigate('scenarios'); }}
            >
              View scenario <ArrowRight size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </button>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4 — WHERE THE EXPOSURE IS (SERVICE MAP)
      ══════════════════════════════════════════════════════════════════════ */}
      <h2 className="section">Where The Exposure Is</h2>
      <div className="section-sub">Financial exposure mapped to operational business services. Click any row to drill down.</div>

      <div className="bar-list">
        {serviceExposure.map(svc => (
          <div
            key={svc.name}
            className="bar-row cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
            onClick={() => setSelectedService({ isOpen: true, name: svc.label, exposure: svc.exposure, tolerance: svc.tolerance })}
            style={{ padding: '13px 8px' }}
          >
            <div className="name">{svc.name}</div>
            <div className="bar-track">
              <div className={`bar-fill ${svc.fillClass}`} style={{ width: `${svc.pct}%` }} />
            </div>
            <div className="amt">{svc.amount}</div>
            <div className={`status ${svc.status}`}>
              {svc.status === 'above' ? 'Above tolerance →' : 'Within tolerance →'}
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5 — WHICH SCENARIOS MATTER
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="cc-section-header" style={{ marginTop: '40px' }}>
        <div>
          <h2 className="section" style={{ marginTop: 0 }}>Which Scenarios Matter</h2>
          <div className="section-sub">Active risk scenarios exceeding board risk appetite, ranked by expected annual loss.</div>
        </div>
        <button className="link-btn" onClick={() => onNavigate('command-center')}>
          Full scenario ledger →
        </button>
      </div>

      <div className="cc-scenarios-list">
        {criticalScenarios.map(scen => (
          <div key={scen.id} className="cc-scenario-row">
            <div className="cc-scenario-header-row">
              <div className="cc-scenario-name">{scen.name}</div>
              <span className="badge crit">{scen.status}</span>
            </div>
            <div className="cc-scenario-meta">
              <span><ShieldAlert size={11} className="inline-icon" />{scen.service}</span>
              <span><Zap size={11} className="inline-icon" />{scen.threatActor}</span>
              <span><Clock size={11} className="inline-icon" />Calc: {scen.lastCalc}</span>
            </div>
            <div className="cc-scenario-metrics">
              <div className="cc-scen-metric">
                <div className="cc-scen-metric-label">EAL</div>
                <div className="cc-scen-metric-value crimson">{scen.eal}</div>
              </div>
              <div className="cc-scen-metric">
                <div className="cc-scen-metric-label">95th-pct VaR</div>
                <div className="cc-scen-metric-value">{scen.var95}</div>
              </div>
              <div className="cc-scen-metric">
                <div className="cc-scen-metric-label">Annual Prob.</div>
                <div className="cc-scen-metric-value">{scen.prob}</div>
              </div>
              <button
                className="btn sm"
                onClick={() => { onSelectScenario(scen.id); onNavigate('scenarios'); }}
              >
                Details & Kill-Chain →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6 — INVESTMENT OPTIMIZER CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="cc-optimizer-cta">
        <div className="cc-optimizer-cta-left">
          <div className="cc-optimizer-cta-icon">
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="cc-optimizer-cta-title">Optimal Security Investment Portfolio Available</div>
            <div className="cc-optimizer-cta-desc">
              The Investment Optimizer has calculated a <strong>₹70 lakh control portfolio</strong> that reduces exposure by <strong>₹2.8 Cr/year</strong> — a projected 4× ROSI. Covers the top 3 risk drivers.
            </div>
            <div className="cc-optimizer-cta-sub">
              Controls: FIDO2 MFA enforcement · Immutable cloud backups · API gateway patching
            </div>
          </div>
        </div>
        <button
          className="btn primary"
          onClick={() => onNavigate('optimizer')}
          style={{ flexShrink: 0 }}
        >
          <TrendingUp size={14} />
          Open Optimizer →
        </button>
      </div>

      {/* ── Compliance & Investment summary row ── */}
      <div className="grid2" style={{ marginTop: '32px' }}>
        <div>
          <h2 className="section" style={{ marginTop: 0 }}>Investment Performance</h2>
          <div className="kv">
            <span className="k">Invested this year</span>
            <span className="v">{investedThisYear}</span>
          </div>
          <div className="kv">
            <span className="k">Estimated risk reduced</span>
            <span className="v" style={{ color: 'var(--teal)' }}>{riskReduced}</span>
          </div>
          <div className="kv">
            <span className="k">Risk-reduction ROI</span>
            <span className="v" style={{ color: 'var(--teal)' }}>{riskReductionROI}</span>
          </div>
          <div className="kv">
            <span className="k">Controls completed</span>
            <span className="v">4 of 7</span>
          </div>
          <div className="kv">
            <span className="k">Controls in progress</span>
            <span className="v">3</span>
          </div>
        </div>
        <div>
          <h2 className="section" style={{ marginTop: 0 }}>Regulatory Readiness</h2>
          {[
            { label: 'SEBI CSCRF', pct: 76, color: 'var(--teal)' },
            { label: 'NIST CSF 2.0', pct: 82, color: 'var(--teal)' },
            { label: 'Evidence freshness', pct: 64, color: 'var(--amber)' },
          ].map(r => (
            <div 
              key={r.label} 
              className="cursor-pointer hover:opacity-80 transition-opacity mt-3" 
              onClick={() => {
                if (r.label === 'Evidence freshness' && onInspectEvidence) {
                  onInspectEvidence({
                    id: 'ev-fresh-01',
                    source: 'CrowdStrike Falcon & AWS Security Hub',
                    timestamp: '14 minutes ago',
                    hash: 'sha256:7b91d2c0e81f4a9b2d8e4f1a6c3b8e0d5a2f7c9e1b4a6d8c0e2f5a7b9c1d3e5f',
                    description: 'Automated cryptographic posture digest for enterprise identity and cloud control evidence.',
                    rawPayload: {
                      collector: 'AWS Security Hub / Okta Event Hook',
                      entitiesEvaluated: 1420,
                      compliantCount: 1079,
                      nonCompliantCount: 341,
                      freshnessWindowHours: 24,
                      hashAlgorithm: 'SHA-256'
                    }
                  });
                } else {
                  onNavigate('compliance');
                }
              }}
            >
              <div style={{ fontSize: '13px', color: 'var(--sub)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{r.label}</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{r.pct}%</span>
              </div>
              <div className="readiness-bar">
                <div className="readiness-fill" style={{ width: `${r.pct}%`, background: r.color }} />
              </div>
            </div>
          ))}
          <div className="kv" style={{ marginTop: '6px' }}>
            <span className="k">High-risk compliance gaps</span>
            <span className="v" style={{ color: 'var(--crimson)' }}>4 open</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="disclaimer">
        <strong>Methodology:</strong> All figures produced by 10,000-iteration FAIR Beta-PERT Monte Carlo simulations on synthetic demo data.
        Financial exposure ≠ CVSS × EPSS. CVSS represents severity; EPSS represents exploit probability; financial loss is modelled separately via asset criticality, business impact, and threat frequency.
        Figures carry inherent uncertainty — see individual scenarios for confidence intervals and evidence digests.
      </footer>

      {/* Service Drilldown Modal */}
      <ServiceDrilldownModal
        isOpen={selectedService.isOpen}
        onClose={() => setSelectedService(prev => ({ ...prev, isOpen: false }))}
        serviceName={selectedService.name}
        exposureAmount={selectedService.exposure}
        toleranceStatus={selectedService.tolerance}
        onNavigate={onNavigate}
      />
    </div>
  );
};
