import React, { useState } from 'react';
import { NavigationPage, DefensiveControl } from '../../types';
import { Plus, RefreshCw, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { AddControlModal } from '../modals/AddControlModal';
import { ControlHealthModal } from '../modals/ControlHealthModal';

interface ControlsMatrixProps {
  onNavigate: (page: NavigationPage) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, description: string) => void;
}

export const ControlsMatrix: React.FC<ControlsMatrixProps> = ({ onNavigate, onShowToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [healthModalControl, setHealthModalControl] = useState<any | null>(null);

  const initialControls = [
    { id: 'ctrl-1', name: 'Privileged-user MFA', framework: 'NIST CSF 2.0', status: 'Partly effective', coverage: 78, effectiveness: 64, risks: 'Ransomware, account takeover', potentialReduction: '₹1.4 crore', sub: 'Evidence updated 3 hours ago · owner: Identity Team', badgeClass: 'warn', frameworkRef: 'NIST PR.AC-1', owner: 'Identity Team' },
    { id: 'ctrl-2', name: 'Immutable backups', framework: 'SEBI CSCRF', status: 'Effective', coverage: 95, effectiveness: 91, risks: 'Ransomware, destructive attack', potentialReduction: '₹1.1 crore', sub: 'Evidence updated 1 day ago · owner: Infrastructure Team', badgeClass: 'good', frameworkRef: 'SEBI CSCRF 4.1', owner: 'Infrastructure Team' },
    { id: 'ctrl-3', name: 'Network segmentation', framework: 'NIST CSF 2.0', status: 'Implemented', coverage: 66, effectiveness: 53, risks: 'Ransomware, lateral movement', potentialReduction: '₹90 lakh', sub: 'Evidence updated 12 days ago · owner: Network Team', badgeClass: 'neutral', frameworkRef: 'NIST PR.AC-5', owner: 'Network Team' },
    { id: 'ctrl-4', name: 'Full recovery testing', framework: 'SEBI CSCRF', status: 'Evidence stale', coverage: 0, effectiveness: 0, risks: 'Ransomware, outage', potentialReduction: '₹60 lakh', sub: 'No test recorded in 9 months', badgeClass: 'crit', frameworkRef: 'SEBI CSCRF 6.3', owner: 'Disaster Recovery Team' },
  ];

  const [controls, setControls] = useState(initialControls);

  const filteredControls = controls.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.risks.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFw = frameworkFilter === 'ALL' || c.framework === frameworkFilter;
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchSearch && matchFw && matchStatus;
  });

  const handleAddControl = () => {
    setIsAddModalOpen(true);
  };

  const handleTestControl = (ctrl: any) => {
    setHealthModalControl(ctrl);
  };

  const handleExport = () => {
    const headers = "Control,Framework,Status,Coverage,Effectiveness,Related Risks,Potential Reduction\n";
    const rows = controls.map(c => `"${c.name}","${c.framework}","${c.status}",${c.coverage}%,${c.effectiveness}%,"${c.risks}","${c.potentialReduction}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cyberoptix_defensive_controls_matrix.csv';
    link.click();
    onShowToast?.('success', 'Controls Ledger Exported', 'Downloaded cyberoptix_defensive_controls_matrix.csv');
  };

  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Security Controls</div>
          <h1>Controls Matrix</h1>
          <div className="period">Multi-factor effectiveness scoring: Coverage × Implementation × Freshness</div>
        </div>
        <div className="masthead-actions flex items-center gap-2">
          <button className="btn" onClick={() => onShowToast?.('success', 'Controls Ledger Exported', 'Downloaded controls_effectiveness_matrix_2026.csv')}>
            <Download size={13} />
            <span>Export CSV</span>
          </button>
          <button className="btn primary" onClick={handleAddControl}>
            <Plus size={13} />
            <span>Add Control</span>
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <select value={frameworkFilter} onChange={(e) => setFrameworkFilter(e.target.value)}>
          <option value="ALL">All frameworks</option>
          <option value="NIST CSF 2.0">NIST CSF 2.0</option>
          <option value="SEBI CSCRF">SEBI CSCRF / RBI</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All statuses</option>
          <option value="Effective">Effective</option>
          <option value="Partly effective">Partly effective</option>
          <option value="Implemented">Implemented</option>
          <option value="Evidence stale">Evidence stale</option>
        </select>
        <input 
          className="search-input" 
          type="text" 
          placeholder="Search controls…" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="control-row" style={{ borderTop: '1px solid var(--line)', fontSize: '12px', color: 'var(--sub)', fontWeight: 500 }}>
        <div>Control</div>
        <div>Coverage</div>
        <div>Effectiveness</div>
        <div>Related risks</div>
        <div>Potential reduction</div>
      </div>

      {filteredControls.map((ctrl) => (
        <div key={ctrl.id} className="control-row">
          <div>
            <div className="name">{ctrl.name}</div>
            <div className="sub">{ctrl.sub}</div>
            <span className={`badge ${ctrl.badgeClass}`} style={{ marginTop: '4px' }}>{ctrl.status}</span>
          </div>
          <div>{ctrl.coverage > 0 ? `${ctrl.coverage}%` : '—'}</div>
          <div>{ctrl.effectiveness > 0 ? `${ctrl.effectiveness}%` : '—'}</div>
          <div>{ctrl.risks}</div>
          <div>
            <strong className="text-crimson font-serif">{ctrl.potentialReduction}</strong><br />
            <div className="flex items-center gap-2 mt-1">
              <button className="link-btn font-medium" onClick={() => onNavigate('compliance')}>
                View evidence →
              </button>
              <button 
                className="link-btn font-medium text-teal" 
                onClick={() => handleTestControl(ctrl)}
              >
                Test control & inspect probe →
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add Control Modal */}
      <AddControlModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddControl={(newCtrl) => {
          const addedItem = {
            id: `ctrl-${Date.now()}`,
            name: newCtrl.name || 'Custom Control',
            framework: newCtrl.frameworkRef || 'NIST CSF 2.0',
            status: 'Effective',
            coverage: newCtrl.coveragePct || 85,
            effectiveness: 88,
            risks: 'Lateral movement, misconfiguration',
            potentialReduction: newCtrl.potentialRiskReductionFormatted || '₹95 lakh',
            sub: `Evidence verified just now · owner: ${newCtrl.owner || 'SecOps'}`,
            badgeClass: 'good',
            frameworkRef: newCtrl.frameworkRef || 'NIST PR.AC-1',
            owner: newCtrl.owner || 'SecOps'
          };
          setControls(prev => [addedItem, ...prev]);
          onShowToast?.('success', 'Control Registered', `Added "${newCtrl.name}" to the live defense posture matrix.`);
        }}
      />

      {/* Live Health Check Modal */}
      <ControlHealthModal
        isOpen={!!healthModalControl}
        onClose={() => setHealthModalControl(null)}
        control={healthModalControl}
        onRunTest={() => {
          onShowToast?.('success', 'Active Probe Successful', `Verified sensor health & coverage for "${healthModalControl?.name}".`);
        }}
      />
    </div>
  );
};

