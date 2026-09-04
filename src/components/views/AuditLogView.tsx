import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { ShieldCheck, Download, Search, CheckCircle2, Lock, FileText, ArrowRight } from 'lucide-react';

interface AuditLogViewProps {
  onNavigate: (page: NavigationPage) => void;
  onShowToast: (type: 'success' | 'warning' | 'info', title: string, desc: string) => void;
}

interface AuditEntry {
  id: string;
  time: string;
  actor: string;
  action: string;
  badgeType: 'neutral' | 'good' | 'warn' | 'crit';
  resource: string;
  reason: string;
  chainHash: string;
  prevHash: string;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ onNavigate, onShowToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  const auditRecords: AuditEntry[] = [
    {
      id: 'aud_1',
      time: '09:41 today',
      actor: 'P. Sharma (CISO)',
      action: 'Portfolio approved',
      badgeType: 'neutral',
      resource: 'Ransomware protection plan (₹1.00 Cr allocation)',
      reason: 'Q3 capital budget cycle sign-off',
      chainHash: 'a3f9e2b109cc21c8',
      prevHash: '7be2aa8100ef90fa'
    },
    {
      id: 'aud_2',
      time: '08:15 today',
      actor: 'System (Okta Connector)',
      action: 'Evidence collected',
      badgeType: 'good',
      resource: 'Okta MFA coverage report (82% -> 76%)',
      reason: 'Scheduled hourly telemetry ingest',
      chainHash: '7be2aa8100ef90fa',
      prevHash: 'c110998a44b14d7e'
    },
    {
      id: 'aud_3',
      time: 'Yesterday, 16:30',
      actor: 'R. Iyer (GRC Lead)',
      action: 'Exception accepted',
      badgeType: 'warn',
      resource: 'Privileged-access review — Requirement 4.1',
      reason: 'Compensating hardware key control verified',
      chainHash: 'c110998a44b14d7e',
      prevHash: '55ab3310aa0ef302'
    },
    {
      id: 'aud_4',
      time: '2 days ago',
      actor: 'A. Fernandes (CFO)',
      action: 'Risk accepted',
      badgeType: 'neutral',
      resource: 'Critical vendor outage scenario',
      reason: 'Expected annual loss below materiality threshold',
      chainHash: '55ab3310aa0ef302',
      prevHash: '98d4cc9188001179'
    },
    {
      id: 'aud_5',
      time: '3 days ago',
      actor: 'System (Risk Engine)',
      action: 'Model recalculated',
      badgeType: 'crit',
      resource: 'Ransomware — payment processing (v2.4.1)',
      reason: 'New critical vulnerability evidence (CVE-2024-21413)',
      chainHash: '98d4cc9188001179',
      prevHash: '10e9bb2049fa0012'
    }
  ];

  const filteredRecords = auditRecords.filter(rec => {
    const matchesSearch = rec.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.action.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === 'All' || rec.action.toLowerCase().includes(actionFilter.toLowerCase());
    return matchesSearch && matchesAction;
  });

  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Audit & Governance</div>
          <h1>Tamper-Evident Audit Log</h1>
          <div className="period">Cryptographically chained ledger of privileged actions, model updates, and executive sign-offs</div>
        </div>
        <div className="masthead-actions">
          <button 
            className="btn primary"
            onClick={() => onShowToast('success', 'Audit Export Queued', 'Exported 1,842 chained audit records as signed JSON-LD bundle.')}
          >
            <Download size={13} style={{ display: 'inline', marginRight: '6px' }} />
            Export signed audit trail
          </button>
        </div>
      </div>

      <div className="callout">
        <strong>Cryptographic Hash Chain Verified:</strong> Every row is chained to the previous entry's SHA-256 digest. Any retrospective tampering with historical calculations, evidence, or approval signatures immediately breaks the integrity chain.
      </div>

      <div className="filter-bar">
        <input 
          className="search-input" 
          placeholder="Search by actor, action, resource, reason, or hash…" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
          <option value="All">All action types</option>
          <option value="approved">Portfolio approval</option>
          <option value="exception">Exception accepted</option>
          <option value="evidence">Evidence collected</option>
          <option value="recalculated">Model recalculation</option>
        </select>
      </div>

      <table className="ledger-table" id="audit-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Authorized Actor</th>
            <th>Governance Action</th>
            <th>Target Resource</th>
            <th>Business Reason</th>
            <th style={{ textAlign: 'right' }}>Chain Hash (SHA-256)</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((r) => (
            <tr key={r.id}>
              <td style={{ whiteSpace: 'nowrap', color: 'var(--sub)' }}>{r.time}</td>
              <td><strong>{r.actor}</strong></td>
              <td>
                <span className={`badge ${r.badgeType}`}>{r.action}</span>
              </td>
              <td>{r.resource}</td>
              <td style={{ fontSize: '12.5px', color: 'var(--sub)' }}>{r.reason}</td>
              <td style={{ textAlign: 'right' }}>
                <span 
                  style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '11px', 
                    color: 'var(--teal)',
                    background: '#EAF7F5',
                    padding: '2px 6px',
                    borderRadius: '3px'
                  }}
                >
                  {r.chainHash}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer className="disclaimer">
        Audit trail entries are immutable and stored in append-only storage with periodic Merkle tree root anchoring to satisfy statutory regulatory compliance (SEBI CSCRF, RBI, SOX ITGC, ISO 27001).
      </footer>
    </div>
  );
};
