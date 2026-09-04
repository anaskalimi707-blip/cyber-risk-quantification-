import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { Plus, RefreshCw, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

interface ControlsMatrixProps {
  onNavigate: (page: NavigationPage) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, description: string) => void;
}

export const ControlsMatrix: React.FC<ControlsMatrixProps> = ({ onNavigate, onShowToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isTesting, setIsTesting] = useState<string | null>(null);

  const initialControls = [
    { id: 'ctrl-1', name: 'Privileged-user MFA', framework: 'NIST CSF 2.0', status: 'Partly effective', coverage: 78, effectiveness: 64, risks: 'Ransomware, account takeover', potentialReduction: '₹1.4 crore', sub: 'Evidence updated 3 hours ago · owner: Identity Team', badgeClass: 'warn' },
    { id: 'ctrl-2', name: 'Immutable backups', framework: 'SEBI CSCRF', status: 'Effective', coverage: 95, effectiveness: 91, risks: 'Ransomware, destructive attack', potentialReduction: '₹1.1 crore', sub: 'Evidence updated 1 day ago · owner: Infrastructure Team', badgeClass: 'good' },
    { id: 'ctrl-3', name: 'Network segmentation', framework: 'NIST CSF 2.0', status: 'Implemented', coverage: 66, effectiveness: 53, risks: 'Ransomware, lateral movement', potentialReduction: '₹90 lakh', sub: 'Evidence updated 12 days ago · owner: Network Team', badgeClass: 'neutral' },
    { id: 'ctrl-4', name: 'Full recovery testing', framework: 'SEBI CSCRF', status: 'Evidence stale', coverage: 0, effectiveness: 0, risks: 'Ransomware, outage', potentialReduction: '₹60 lakh', sub: 'No test recorded in 9 months', badgeClass: 'crit' },
  ];

  const filteredControls = initialControls.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.risks.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFw = frameworkFilter === 'ALL' || c.framework === frameworkFilter;
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchSearch && matchFw && matchStatus;
  });

  const handleAddControl = () => {
    onShowToast?.('info', 'New Control Onboarding', 'Control policy authoring wizard launched. Select framework taxonomy to proceed.');
  };

  const handleTestControl = (ctrlName: string, id: string) => {
    setIsTesting(id);
    onShowToast?.('info', 'Automated Control Verification', `Running live policy audit & health check for "${ctrlName}"...`);
    setTimeout(() => {
      setIsTesting(null);
      onShowToast?.('success', 'Control Verification Passed', `Telemetry telemetry synchronized for "${ctrlName}". Evidence hash stamped.`);
    }, 1200);
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
                onClick={() => handleTestControl(ctrl.name, ctrl.id)}
                disabled={isTesting === ctrl.id}
              >
                {isTesting === ctrl.id ? 'Testing...' : 'Test control →'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

