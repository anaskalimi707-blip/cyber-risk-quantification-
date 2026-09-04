import React, { useState } from 'react';

export const SettingsView: React.FC = () => {
  const [cmdbSync, setCmdbSync] = useState(true);
  const [vulnScanner, setVulnScanner] = useState(true);
  const [iamSync, setIamSync] = useState(true);
  const [threatFeed, setThreatFeed] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Settings</div>
          <h1>Organization settings</h1>
          <div className="period">Configure risk appetites, quantification schedules, and enterprise connectors</div>
        </div>
      </div>

      <h2 className="section" style={{ marginTop: 0 }}>General</h2>
      <div className="form-row">
        <label>
          Currency
          <div className="desc">Used across all risk and investment figures</div>
        </label>
        <select defaultValue="INR (₹)">
          <option>INR (₹)</option>
          <option>USD ($)</option>
          <option>EUR (€)</option>
        </select>
      </div>

      <div className="form-row">
        <label>Timezone</label>
        <select defaultValue="Asia/Kolkata">
          <option>Asia/Kolkata (IST +5:30)</option>
          <option>UTC</option>
          <option>America/New_York (EST)</option>
        </select>
      </div>

      <div className="form-row">
        <label>
          Risk appetite
          <div className="desc">Money-at-risk threshold above which scenarios are flagged</div>
        </label>
        <input type="text" defaultValue="₹10,00,00,000" />
      </div>

      <h2 className="section">Risk engine</h2>
      <div className="form-row">
        <label>Frameworks in use</label>
        <select defaultValue="NIST CSF 2.0, SEBI CSCRF, ISO 27001">
          <option>NIST CSF 2.0, SEBI CSCRF, ISO 27001</option>
          <option>RBI Cybersecurity Standard</option>
          <option>SOC 2 Type II + GDPR</option>
        </select>
      </div>

      <div className="form-row">
        <label>
          Evidence-freshness policy
          <div className="desc">Days before evidence is marked stale</div>
        </label>
        <input type="text" defaultValue="90 days" />
      </div>

      <div className="form-row">
        <label>Risk-calculation schedule</label>
        <select defaultValue="Every 6 hours">
          <option>Every 6 hours</option>
          <option>Continuous (event-driven)</option>
          <option>Daily at 00:00 UTC</option>
        </select>
      </div>

      <div className="form-row">
        <label>Simulation iteration count</label>
        <select defaultValue="10,000 (standard)">
          <option>10,000 (standard)</option>
          <option>50,000 (high-value scenarios)</option>
          <option>100,000 (board audit mode)</option>
        </select>
      </div>

      <div className="form-row">
        <label>Required approval level for investments</label>
        <select defaultValue="CFO + CISO">
          <option>CFO + CISO</option>
          <option>CISO Only</option>
          <option>Board Risk Committee</option>
        </select>
      </div>

      <h2 className="section">Connectors</h2>
      <div className="toggle-row">
        <span>CMDB — asset inventory sync</span>
        <div 
          className={`switch ${cmdbSync ? 'on' : ''}`}
          onClick={() => setCmdbSync(!cmdbSync)}
        ></div>
      </div>

      <div className="toggle-row">
        <span>Vulnerability scanner</span>
        <div 
          className={`switch ${vulnScanner ? 'on' : ''}`}
          onClick={() => setVulnScanner(!vulnScanner)}
        ></div>
      </div>

      <div className="toggle-row">
        <span>IAM — identity provider</span>
        <div 
          className={`switch ${iamSync ? 'on' : ''}`}
          onClick={() => setIamSync(!iamSync)}
        ></div>
      </div>

      <div className="toggle-row">
        <span>Threat intelligence feed</span>
        <div 
          className={`switch ${threatFeed ? 'on' : ''}`}
          onClick={() => setThreatFeed(!threatFeed)}
        ></div>
      </div>

      <div className="callout" style={{ marginTop: '24px' }}>
        Settings changes require administrator permissions and generate an entry in the SHA-256 tamper-evident audit ledger.
      </div>
    </div>
  );
};
