import React, { useState } from 'react';
import { Save, BellRing, RefreshCw, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, description: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onShowToast }) => {
  const [currency, setCurrency] = useState('INR (₹)');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [riskAppetite, setRiskAppetite] = useState('₹10,00,00,000');
  const [frameworks, setFrameworks] = useState('NIST CSF 2.0, SEBI CSCRF, ISO 27001');
  const [freshnessDays, setFreshnessDays] = useState('90 days');
  const [simIterations, setSimIterations] = useState('10,000 (standard)');

  const [cmdbSync, setCmdbSync] = useState(true);
  const [vulnScanner, setVulnScanner] = useState(true);
  const [iamSync, setIamSync] = useState(true);
  const [threatFeed, setThreatFeed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onShowToast?.('success', 'Settings Saved', 'Enterprise risk parameters & connector configurations updated in audit log.');
    }, 600);
  };

  const handleTestAlerts = () => {
    onShowToast?.('info', 'Webhook Test Sent', 'Dispatched test payload to SecOps Slack channel (#cyber-risk-alerts) & PagerDuty.');
  };

  const handleResyncConnectors = () => {
    onShowToast?.('info', 'Connectors Ingesting', 'Triggered full background resync across AWS, Qualys, Okta, and Mandiant feeds.');
  };

  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Settings &amp; Risk Appetite</div>
          <h1>Enterprise Configuration &amp; Governance</h1>
          <div className="period">Configure risk appetites, quantification schedules, and enterprise connectors</div>
        </div>
        <div className="masthead-actions flex items-center gap-2">
          <button className="btn" onClick={handleTestAlerts}>
            <BellRing size={13} />
            <span>Test Webhooks</span>
          </button>
          <button className="btn" onClick={handleResyncConnectors}>
            <RefreshCw size={13} />
            <span>Resync Connectors</span>
          </button>
          <button className="btn primary" onClick={handleSave} disabled={isSaving}>
            <Save size={13} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <h2 className="section" style={{ marginTop: 0 }}>General Governance</h2>
      <div className="form-row">
        <label>
          Currency Denomination
          <div className="desc">Used across all risk and investment figures</div>
        </label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option>INR (₹)</option>
          <option>USD ($)</option>
          <option>EUR (€)</option>
        </select>
      </div>

      <div className="form-row">
        <label>Timezone</label>
        <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
          <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
          <option value="UTC">UTC (Universal Coordinated Time)</option>
          <option value="America/New_York">America/New_York (EST)</option>
        </select>
      </div>

      <div className="form-row">
        <label>
          Board Risk Appetite Limit
          <div className="desc">Money-at-risk threshold above which scenarios trigger executive escalation</div>
        </label>
        <input 
          type="text" 
          value={riskAppetite} 
          onChange={(e) => setRiskAppetite(e.target.value)} 
        />
      </div>

      <h2 className="section">Quantitative Risk Engine</h2>
      <div className="form-row">
        <label>Regulatory Frameworks in Use</label>
        <select value={frameworks} onChange={(e) => setFrameworks(e.target.value)}>
          <option>NIST CSF 2.0, SEBI CSCRF, ISO 27001</option>
          <option>RBI Cybersecurity Framework</option>
          <option>SOC 2 Type II + GDPR</option>
        </select>
      </div>

      <div className="form-row">
        <label>
          Evidence-Freshness Policy
          <div className="desc">Days before telemetry evidence is marked stale</div>
        </label>
        <input 
          type="text" 
          value={freshnessDays} 
          onChange={(e) => setFreshnessDays(e.target.value)} 
        />
      </div>

      <div className="form-row">
        <label>Simulation Iteration Count</label>
        <select value={simIterations} onChange={(e) => setSimIterations(e.target.value)}>
          <option>10,000 (standard)</option>
          <option>50,000 (high-value scenarios)</option>
          <option>100,000 (board audit mode)</option>
        </select>
      </div>

      <h2 className="section">Enterprise Telemetry Connectors</h2>
      <div className="toggle-row">
        <div>
          <span className="font-medium text-ink">CMDB — ServiceNow &amp; AWS Asset Inventory Sync</span>
          <div className="text-xs text-sub">Continuous discovery of cloud workloads and databases</div>
        </div>
        <div 
          className={`switch ${cmdbSync ? 'on' : ''}`}
          onClick={() => {
            setCmdbSync(!cmdbSync);
            onShowToast?.('info', 'Connector Toggled', `CMDB connector ${!cmdbSync ? 'enabled' : 'disabled'}.`);
          }}
        ></div>
      </div>

      <div className="toggle-row">
        <div>
          <span className="font-medium text-ink">Vulnerability Scanner — Qualys VMDR &amp; Tenable</span>
          <div className="text-xs text-sub">Real-time CVSS &amp; EPSS exploit probability ingestion</div>
        </div>
        <div 
          className={`switch ${vulnScanner ? 'on' : ''}`}
          onClick={() => {
            setVulnScanner(!vulnScanner);
            onShowToast?.('info', 'Connector Toggled', `Vulnerability scanner ${!vulnScanner ? 'enabled' : 'disabled'}.`);
          }}
        ></div>
      </div>

      <div className="toggle-row">
        <div>
          <span className="font-medium text-ink">IAM — Okta &amp; Microsoft Entra ID</span>
          <div className="text-xs text-sub">MFA enforcement and privileged access monitoring</div>
        </div>
        <div 
          className={`switch ${iamSync ? 'on' : ''}`}
          onClick={() => {
            setIamSync(!iamSync);
            onShowToast?.('info', 'Connector Toggled', `IAM connector ${!iamSync ? 'enabled' : 'disabled'}.`);
          }}
        ></div>
      </div>

      <div className="toggle-row">
        <div>
          <span className="font-medium text-ink">Threat Intelligence — Mandiant &amp; CISA KEV</span>
          <div className="text-xs text-sub">Exploit in-the-wild threat capability multipliers</div>
        </div>
        <div 
          className={`switch ${threatFeed ? 'on' : ''}`}
          onClick={() => {
            setThreatFeed(!threatFeed);
            onShowToast?.('info', 'Connector Toggled', `Threat intelligence feed ${!threatFeed ? 'enabled' : 'disabled'}.`);
          }}
        ></div>
      </div>

      <div className="callout" style={{ marginTop: '24px' }}>
        Settings changes require administrator permissions and generate an entry in the SHA-256 tamper-evident audit ledger.
      </div>
    </div>
  );
};

