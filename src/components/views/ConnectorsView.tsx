import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { Database, RefreshCw, AlertTriangle, CheckCircle2, XCircle, Plus, Search, ShieldCheck } from 'lucide-react';
import { AddConnectorModal } from '../modals/AddConnectorModal';

interface ConnectorsViewProps {
  onNavigate: (page: NavigationPage) => void;
  onShowToast: (type: 'success' | 'warning' | 'info', title: string, desc: string) => void;
}

interface ConnectorItem {
  id: string;
  name: string;
  type: string;
  status: 'Healthy' | 'Degraded' | 'Failed';
  lastSync: string;
  recordsPerRun: string;
  scope: string;
  description: string;
}

export const ConnectorsView: React.FC<ConnectorsViewProps> = ({ onNavigate, onShowToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const [connectors, setConnectors] = useState<ConnectorItem[]>([
    {
      id: 'conn_1',
      name: 'ServiceNow CMDB',
      type: 'CMDB',
      status: 'Healthy',
      lastSync: '6 minutes ago',
      recordsPerRun: '4,812',
      scope: 'Read-only, assets & topologies',
      description: 'Synchronizes server, database, and cloud account inventories with business service dependencies.'
    },
    {
      id: 'conn_2',
      name: 'Tenable Vulnerability Scanner',
      type: 'Vulnerability scanner',
      status: 'Healthy',
      lastSync: '11 minutes ago',
      recordsPerRun: '1,204',
      scope: 'Read-only, CVEs & EPSS scores',
      description: 'Ingests host and container vulnerability findings mapped to asset inventory.'
    },
    {
      id: 'conn_3',
      name: 'Okta IAM Policy Engine',
      type: 'IAM',
      status: 'Healthy',
      lastSync: '2 minutes ago',
      recordsPerRun: '318',
      scope: 'Read-only, identities & MFA postures',
      description: 'Pulls privileged user accounts, MFA enrollment state, and session timeout policies.'
    },
    {
      id: 'conn_4',
      name: 'CrowdStrike Falcon EDR',
      type: 'EDR/XDR',
      status: 'Degraded',
      lastSync: '4 hours ago',
      recordsPerRun: '0',
      scope: 'Read-only, host sensor telemetry',
      description: 'Monitors behavioral anomalies and endpoint protection coverage across fleet.'
    },
    {
      id: 'conn_5',
      name: 'Recorded Future Threat Intel',
      type: 'Threat intelligence',
      status: 'Healthy',
      lastSync: '38 minutes ago',
      recordsPerRun: '92',
      scope: 'Read-only, threat actor indicators',
      description: 'Tracks ransomware threat group activities and zero-day exploitation velocity.'
    },
    {
      id: 'conn_6',
      name: 'Vendor Risk Portal (SIG / SOC 2)',
      type: 'Vendor-risk platform',
      status: 'Failed',
      lastSync: '3 days ago',
      recordsPerRun: '0',
      scope: 'Read-only, questionnaires & certifications',
      description: 'Collects third-party assessment questionnaires and compliance certifications.'
    }
  ]);

  const handleManualSync = (conn: ConnectorItem) => {
    setSyncingId(conn.id);
    onShowToast('info', 'Sync Dispatched', `Contacting ${conn.name} endpoint for fresh telemetry.`);
    setTimeout(() => {
      setSyncingId(null);
      setConnectors(prev => prev.map(c => c.id === conn.id ? { ...c, status: 'Healthy', lastSync: 'Just now' } : c));
      onShowToast('success', 'Sync Complete', `Synchronized 1,420 new records from ${conn.name}.`);
    }, 1200);
  };

  const filteredConnectors = connectors.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Integration & Connector Service</div>
          <h1>Telemetry & Evidence Connectors</h1>
          <div className="period">Automated, read-only ingestion feeds powering real-time risk quantification</div>
        </div>
        <div className="masthead-actions">
          <button className="btn primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Add connector
          </button>
        </div>
      </div>

      <div className="callout crimson">
        <strong>CrowdStrike EDR is degraded.</strong> Last successful sync was 4 hours ago — EDR-derived threat detection scores may be stale until API credentials are refreshed.
      </div>

      <div className="filter-bar">
        <input 
          className="search-input" 
          placeholder="Search connectors by name, system, or scope…" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Connector</th>
            <th>Type</th>
            <th>Status</th>
            <th>Last Sync</th>
            <th>Records / Run</th>
            <th>Scope & Permissions</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredConnectors.map((c) => {
            const isSyncing = syncingId === c.id;
            return (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{c.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--sub)', marginTop: '2px' }}>{c.description}</div>
                </td>
                <td><span className="badge neutral">{c.type}</span></td>
                <td>
                  <span className={`badge ${c.status === 'Healthy' ? 'good' : c.status === 'Degraded' ? 'warn' : 'crit'}`}>
                    {c.status}
                  </span>
                </td>
                <td style={{ color: 'var(--sub)' }}>{c.lastSync}</td>
                <td className="num">{c.recordsPerRun}</td>
                <td style={{ fontSize: '12px', color: 'var(--sub)' }}>{c.scope}</td>
                <td style={{ textAlign: 'right' }}>
                  {c.status === 'Healthy' ? (
                    <button 
                      className="btn sm"
                      disabled={isSyncing}
                      onClick={() => handleManualSync(c)}
                    >
                      {isSyncing ? 'Syncing…' : 'Sync now'}
                    </button>
                  ) : c.status === 'Degraded' ? (
                    <button 
                      className="btn sm crimson"
                      disabled={isSyncing}
                      onClick={() => handleManualSync(c)}
                    >
                      {isSyncing ? 'Retrying…' : 'Retry'}
                    </button>
                  ) : (
                    <button 
                      className="btn sm crimson"
                      onClick={() => onShowToast('warning', 'OAuth Re-Authentication', `OAuth token expired for ${c.name}. Redirecting to credential vault.`)}
                    >
                      Reconnect
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <footer className="disclaimer">
        Connectors operate in strict read-only mode using least-privilege API tokens. All evidence pulled is timestamped and cryptographically hashed for audit trail immutability.
      </footer>

      <AddConnectorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConnectorAdded={(newConn) => {
          setConnectors(prev => [...prev, {
            id: `conn_${Date.now()}`,
            name: newConn.name,
            type: newConn.type,
            status: 'Healthy',
            lastSync: 'Just now',
            recordsPerRun: '0',
            scope: 'Read-only',
            description: newConn.description || 'Custom connector integration.'
          }]);
          onShowToast('success', 'Connector Configured', `Added ${newConn.name} to telemetry ingestion pipeline.`);
        }}
      />
    </div>
  );
};
