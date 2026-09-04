import React from 'react';
import { NavigationPage } from '../../types';

interface ExecutiveOverviewProps {
  onNavigate: (page: NavigationPage) => void;
  onSelectScenario: (scenarioId: string) => void;
  onOpenDocument: (title: string, type: string) => void;
  onInspectEvidence: (evidence: any) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  onNavigate,
  onSelectScenario,
  onOpenDocument,
  onInspectEvidence
}) => {
  return (
    <div className="animate-fade-in">
      {/* Masthead */}
      <div className="masthead">
        <div>
          <div className="org">Acme Financial Services · Cyber Risk Statement</div>
          <h1>Cyber Risk Overview</h1>
          <div className="period">For the period ending 3 September 2026</div>
        </div>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="freshness">
            Data updated <b>8 minutes ago</b><br />
            Risk model updated <b>11 minutes ago</b>
          </div>
          <button 
            className="btn"
            onClick={() => onOpenDocument("Q3 2026 Executive Cyber Risk & Board Briefing", "Executive Board Briefing")}
          >
            Export board report
          </button>
        </div>
      </div>

      {/* HERO STATEMENT LINE */}
      <div className="hero">
        <div>
          <div className="label">Money at risk today</div>
          <div className="figure">₹18.4 crore</div>
          <div className="tag">
            <span className="arrow">↑</span> 8% above risk appetite of ₹10 crore
          </div>
          <div className="note">
            Driven mainly by ransomware exposure on the payment platform and a coverage gap in privileged-account MFA.
          </div>
        </div>
        <div>
          <div className="label">90-day exposure trend</div>
          <svg className="spark" width="100%" height="80" viewBox="0 0 320 80" preserveAspectRatio="none">
            <polyline fill="none" stroke="var(--line)" strokeWidth="1" points="0,72 320,72" />
            <polyline
              fill="none"
              stroke="var(--crimson)"
              strokeWidth="2"
              points="0,55 40,58 80,50 120,44 150,46 170,30 210,34 240,20 270,24 320,14"
            />
            <circle cx="170" cy="30" r="3.5" fill="var(--amber)" />
            <circle cx="270" cy="24" r="3.5" fill="var(--teal)" />
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--sub)', marginTop: '4px' }}>
            <span>Jun</span>
            <span>MFA gap widened</span>
            <span>Backups hardened</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* LEDGER ROW OF SECONDARY METRICS */}
      <div className="ledger-row">
        <div className="ledger-item">
          <div className="l">Expected yearly loss</div>
          <div className="v">₹8.6 cr</div>
          <div className="t flat">Confidence: medium</div>
        </div>
        <div className="ledger-item">
          <div className="l">High-risk services</div>
          <div className="v">3</div>
          <div className="t up-bad">Need attention</div>
        </div>
        <div className="ledger-item">
          <div className="l">Risk reduced this quarter</div>
          <div className="v">₹2.1 cr</div>
          <div className="t up-good">↑ 18% vs plan</div>
        </div>
        <div className="ledger-item">
          <div className="l">Data quality</div>
          <div className="v">86%</div>
          <div className="t up-good">Good</div>
        </div>
      </div>

      {/* PRIORITIES */}
      <h2 className="section">What needs attention</h2>
      <div className="section-sub">Ranked by financial impact, not alert volume.</div>
      <div className="priority">
        <div className="priority-item">
          <div className="num">1</div>
          <div className="body">
            <div className="title">Ransomware affecting payment processing</div>
            <div className="meta">
              <b>₹4.2 crore</b> expected yearly loss · risk increased 12% this month
            </div>
            <div className="actions">
              <button 
                className="link-btn"
                onClick={() => {
                  onSelectScenario('scen-ransomware-payment');
                  onNavigate('scenarios');
                }}
              >
                View risk scenario →
              </button>
              <button 
                className="link-btn"
                onClick={() => onNavigate('optimizer')}
              >
                Open ₹70 lakh protection plan →
              </button>
            </div>
          </div>
        </div>

        <div className="priority-item">
          <div className="num">2</div>
          <div className="body">
            <div className="title">No recent full recovery test for payment services</div>
            <div className="meta">Recovery time objective is unverified for the last 9 months</div>
            <div className="actions">
              <button 
                className="link-btn"
                onClick={() => {
                  onInspectEvidence({
                    id: 'ev_dr_test_01',
                    source: 'Disaster Recovery Scheduler',
                    timestamp: '2026-09-02 14:00 UTC',
                    hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                    description: 'Core Ledger PostgreSQL failover recovery drill overdue by 32 days.',
                    rawPayload: {
                      service: 'Payment Processing (UPI)',
                      rto_target_hours: 2,
                      last_live_test: '2025-12-04T08:00:00Z',
                      compliance_status: 'OVERDUE'
                    }
                  });
                }}
              >
                Schedule recovery test & inspect gap →
              </button>
            </div>
          </div>
        </div>

        <div className="priority-item">
          <div className="num">3</div>
          <div className="body">
            <div className="title">Critical supplier security evidence is outdated</div>
            <div className="meta">Evidence last collected 214 days ago, past freshness policy</div>
            <div className="actions">
              <button 
                className="link-btn"
                onClick={() => onNavigate('vendors')}
              >
                Request assessment →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EXPOSURE BY SERVICE */}
      <h2 className="section">Money at risk by business service</h2>
      <div className="section-sub">Quantified financial exposure mapped to operational revenue pipelines.</div>
      <div className="bar-list">
        <div className="bar-row">
          <div className="name">Payment Processing</div>
          <div className="bar-track">
            <div className="bar-fill crit" style={{ width: '88%' }}></div>
          </div>
          <div className="amt">₹9.1 cr</div>
          <div className="status above">Above tolerance</div>
        </div>

        <div className="bar-row">
          <div className="name">Customer Data</div>
          <div className="bar-track">
            <div className="bar-fill warn" style={{ width: '58%' }}></div>
          </div>
          <div className="amt">₹5.4 cr</div>
          <div className="status above">Above tolerance</div>
        </div>

        <div className="bar-row">
          <div className="name">Trading Platform</div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: '30%' }}></div>
          </div>
          <div className="amt">₹2.6 cr</div>
          <div className="status within">Within tolerance</div>
        </div>

        <div className="bar-row">
          <div className="name">Corporate IT</div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: '14%' }}></div>
          </div>
          <div className="amt">₹1.3 cr</div>
          <div className="status within">Within tolerance</div>
        </div>
      </div>

      {/* TWO COLUMN: INVESTMENT PERFORMANCE + REGULATORY READINESS */}
      <div className="grid2">
        <div>
          <h2 className="section" style={{ marginTop: 0 }}>Investment performance</h2>
          <div className="kv">
            <span className="k">Total invested this year</span>
            <span className="v">₹1.4 crore</span>
          </div>
          <div className="kv">
            <span className="k">Estimated risk reduced</span>
            <span className="v" style={{ color: 'var(--teal)' }}>₹2.1 crore</span>
          </div>
          <div className="kv">
            <span className="k">Risk-reduction ROI</span>
            <span className="v" style={{ color: 'var(--teal)' }}>150%</span>
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
          <h2 className="section" style={{ marginTop: 0 }}>Regulatory readiness</h2>
          <div style={{ fontSize: '13px', color: 'var(--sub)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>SEBI CSCRF</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>76%</span>
          </div>
          <div className="readiness-bar">
            <div className="readiness-fill" style={{ width: '76%', background: 'var(--teal)' }}></div>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--sub)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>NIST CSF 2.0</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>82%</span>
          </div>
          <div className="readiness-bar">
            <div className="readiness-fill" style={{ width: '82%', background: 'var(--teal)' }}></div>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--sub)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Evidence freshness</span>
            <span style={{ fontWeight: 600, color: 'var(--amber)' }}>64%</span>
          </div>
          <div className="readiness-bar">
            <div className="readiness-fill" style={{ width: '64%', background: 'var(--amber)' }}></div>
          </div>

          <div className="kv" style={{ marginTop: '6px' }}>
            <span className="k">High-risk gaps</span>
            <span className="v" style={{ color: 'var(--crimson)' }}>4 open</span>
          </div>
        </div>
      </div>

      <footer className="disclaimer">
        Figures are estimates produced by the CyberOptix risk engine from connected evidence sources and reflect ranges, not guarantees. Confidence and data-quality scores accompany every figure above — see individual risk scenarios for assumptions and evidence. Illustrative example data shown for Acme Financial Services.
      </footer>
    </div>
  );
};
