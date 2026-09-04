import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { AlertCircle, Plus, CheckCircle2, Sliders, FileText, Download } from 'lucide-react';
import { LogIncidentModal } from '../modals/LogIncidentModal';
import { ModelCalibrationModal } from '../modals/ModelCalibrationModal';

interface IncidentsResilienceProps {
  onNavigate: (page: NavigationPage) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, description: string) => void;
}

export const IncidentsResilience: React.FC<IncidentsResilienceProps> = ({ onNavigate, onShowToast }) => {
  const [activeChip, setActiveChip] = useState('Risk scenario');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isCalibrationModalOpen, setIsCalibrationModalOpen] = useState(false);

  const initialIncidents = [
    { id: 'INC-2026-014', title: 'Phishing led to account lockouts', sev: 'High', status: 'Contained', service: 'Corporate IT', estLoss: '₹18 lakh', actLoss: '₹6 lakh', time: '2 days ago', badgeClass: 'warn' },
    { id: 'INC-2026-011', title: 'Vendor API outage', sev: 'Medium', status: 'Recovered', service: 'Trading Platform', estLoss: '₹9 lakh', actLoss: '₹4 lakh', time: '9 days ago', badgeClass: 'warn' },
    { id: 'INC-2026-006', title: 'Attempted credential-stuffing', sev: 'Critical', status: 'Closed', service: 'Customer Data', estLoss: '₹40 lakh', actLoss: '₹0', time: '31 days ago', badgeClass: 'crit' },
  ];

  const [incidents, setIncidents] = useState(initialIncidents);

  const handleExport = () => {
    const headers = "Incident ID,Title,Severity,Status,Affected Service,Estimated Loss,Actual Loss,Date\n";
    const rows = incidents.map(i => `"${i.id}","${i.title}","${i.sev}","${i.status}","${i.service}","${i.estLoss}","${i.actLoss}","${i.time}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cyberoptix_incidents_audit_ledger.csv';
    link.click();
    onShowToast?.('success', 'Incident Ledger Exported', 'Downloaded cyberoptix_incidents_audit_ledger.csv');
  };

  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Incidents &amp; Resilience</div>
          <h1>Incidents &amp; Empirical Loss Calibration</h1>
          <div className="period">Empirical feedback loop refining quantitative loss models with real breach telemetry</div>
        </div>
        <div className="masthead-actions flex items-center gap-2">
        <button className="btn" onClick={handleExport}>
          <Download size={13} />
          <span>Export CSV</span>
        </button>
        <button className="btn primary" onClick={() => setIsLogModalOpen(true)}>
          <Plus size={13} />
          <span>Log Incident</span>
        </button>
      </div>
    </div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Incident</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Affected service</th>
            <th>Estimated loss</th>
            <th>Actual loss</th>
            <th>Discovered</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(inc => (
            <tr key={inc.id}>
              <td><strong>{inc.id}</strong> · {inc.title}</td>
              <td><span className={`badge ${inc.badgeClass}`}>{inc.sev}</span></td>
              <td><span className="badge neutral">{inc.status}</span></td>
              <td>{inc.service}</td>
              <td className="num">{inc.estLoss}</td>
              <td className="num font-bold text-teal">{inc.actLoss}</td>
              <td style={{ color: 'var(--sub)' }}>{inc.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="callout" style={{ marginTop: '22px' }}>
        <b>INC-2026-006 closed.</b> Root cause: missing rate limiting on the login endpoint. Update risk model with this finding?
        <div style={{ marginTop: '10px' }}>
          <button className="btn sm primary" onClick={() => setIsCalibrationModalOpen(true)}>
            Review changes &amp; calibrate model →
          </button>
        </div>
      </div>

      <h2 className="section">Connect this incident to</h2>
      <div className="chip-row">
        {['Risk scenario', 'Control failure', 'Asset', 'Business service', 'New investment recommendation'].map((chip) => (
          <div 
            key={chip} 
            className={`chip ${activeChip === chip ? 'active' : ''}`}
            onClick={() => {
              setActiveChip(chip);
              onShowToast?.('info', 'Relationship Filtered', `Filtered root cause telemetry by ${chip}.`);
            }}
          >
            {chip}
          </div>
        ))}
      </div>

      {/* Log Incident Modal */}
      <LogIncidentModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onLogIncident={(incData) => {
          const newEntry = {
            id: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
            title: incData.title,
            sev: incData.severity.split(' ')[0],
            status: 'Under Review',
            service: incData.service,
            estLoss: incData.loss,
            actLoss: incData.loss,
            time: 'Just now',
            badgeClass: 'crit'
          };
          setIncidents(prev => [newEntry, ...prev]);
          onShowToast?.('success', 'Incident Logged', `Registered "${incData.title}" in incident ledger. Model weights updated.`);
        }}
      />

      {/* Bayesian Calibration Modal */}
      <ModelCalibrationModal
        isOpen={isCalibrationModalOpen}
        onClose={() => setIsCalibrationModalOpen(false)}
        onApplyCalibration={() => {
          onShowToast?.('success', 'Bayesian Model Calibrated', 'Monte Carlo trials and Loss Event Frequency parameters updated.');
        }}
      />
    </div>
  );
};

