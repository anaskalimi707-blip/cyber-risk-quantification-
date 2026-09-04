import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { Upload, Download, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { PatchRemediationModal } from '../modals/PatchRemediationModal';
import { CredentialRotationModal } from '../modals/CredentialRotationModal';
import { ConfigDriftModal } from '../modals/ConfigDriftModal';
import { TelemetryScannerModal } from '../modals/TelemetryScannerModal';

interface AssetsExposureProps {
  onNavigate: (page: NavigationPage) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, description: string) => void;
}

export const AssetsExposure: React.FC<AssetsExposureProps> = ({ onNavigate, onShowToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [exposureFilter, setExposureFilter] = useState('ALL');

  // Modal states
  const [patchModalAsset, setPatchModalAsset] = useState<any | null>(null);
  const [rotateModalAsset, setRotateModalAsset] = useState<any | null>(null);
  const [driftModalAsset, setDriftModalAsset] = useState<any | null>(null);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState<boolean>(false);

  const initialAssets = [
    { id: 'ast-1', name: 'Payment API-04', service: 'Payment Processing', riskContrib: '₹82 lakh', exposure: 'Internet-facing', vulns: 4, coverage: 62, owner: 'Platform Team', action: 'Patch & restrict exposure', actionType: 'patch' },
    { id: 'ast-2', name: 'CardAuth-DB-02', service: 'Payment Processing', riskContrib: '₹61 lakh', exposure: 'Internal', vulns: 2, coverage: 74, owner: 'Data Team', action: 'Rotate credentials', actionType: 'rotate' },
    { id: 'ast-3', name: 'Customer-CRM-01', service: 'Customer Data', riskContrib: '₹48 lakh', exposure: 'Internet-facing', vulns: 3, coverage: 58, owner: 'App Team', action: 'Enable FIDO2 MFA', actionPage: 'controls' as NavigationPage },
    { id: 'ast-4', name: 'Trading-GW-11', service: 'Trading Platform', riskContrib: '₹22 lakh', exposure: 'Internal', vulns: 1, coverage: 81, owner: 'Platform Team', action: 'Review config & ports', actionType: 'review' },
    { id: 'ast-5', name: 'Corp-VPN-EU', service: 'Corporate IT', riskContrib: '₹19 lakh', exposure: 'Internet-facing', vulns: 0, coverage: 90, owner: 'IT Team', action: null },
  ];

  const [assets, setAssets] = useState(initialAssets);

  const filteredAssets = assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchService = serviceFilter === 'ALL' || a.service === serviceFilter;
    const matchExposure = exposureFilter === 'ALL' || a.exposure === exposureFilter;
    return matchSearch && matchService && matchExposure;
  });

  const handleImport = () => {
    setIsScannerModalOpen(true);
  };

  const handleExport = () => {
    // Generate CSV export
    const headers = "Asset,Business Service,Risk Contribution,Exposure,Critical Vulns,Control Coverage,Owner\n";
    const rows = assets.map(a => `"${a.name}","${a.service}","${a.riskContrib}","${a.exposure}",${a.vulns},${a.coverage}%,"${a.owner}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cyberoptix_asset_exposure_matrix.csv';
    link.click();
    onShowToast?.('success', 'Asset Ledger Exported', 'Downloaded cyberoptix_asset_exposure_matrix.csv with EPSS & revenue impact scores.');
  };

  const handleScan = () => {
    setIsScannerModalOpen(true);
  };

  const handleRowAction = (asset: any) => {
    if (asset.actionType === 'patch') {
      setPatchModalAsset(asset);
    } else if (asset.actionType === 'rotate') {
      setRotateModalAsset(asset);
    } else if (asset.actionType === 'review') {
      setDriftModalAsset(asset);
    } else if (asset.actionPage) {
      onNavigate(asset.actionPage);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Asset Inventory</div>
          <h1>Assets &amp; Exposure</h1>
          <div className="period">Find the systems creating the most business risk</div>
        </div>
        <div className="masthead-actions flex items-center gap-2">
          <button className="btn" onClick={handleScan}>
            <RefreshCw size={13} />
            <span>Scan Telemetry</span>
          </button>
          <button className="btn" onClick={handleImport}>
            <Upload size={13} />
            <span>Import CMDB</span>
          </button>
          <button className="btn primary" onClick={handleExport}>
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <input 
          className="search-input" 
          type="text" 
          placeholder="Search by name, IP, owner…" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
          <option value="ALL">All business services</option>
          <option value="Payment Processing">Payment Processing</option>
          <option value="Customer Data">Customer Data</option>
          <option value="Trading Platform">Trading Platform</option>
          <option value="Corporate IT">Corporate IT</option>
        </select>
        <select value={exposureFilter} onChange={(e) => setExposureFilter(e.target.value)}>
          <option value="ALL">All exposure types</option>
          <option value="Internet-facing">Internet-facing</option>
          <option value="Internal">Internal only</option>
        </select>
      </div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Business service</th>
            <th>Risk contribution</th>
            <th>Exposure</th>
            <th>Critical vulns</th>
            <th>Control coverage</th>
            <th>Owner</th>
            <th>Recommended action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map((asset) => (
            <tr key={asset.id}>
              <td><strong>{asset.name}</strong></td>
              <td>{asset.service}</td>
              <td className="num font-bold text-crimson">{asset.riskContrib}</td>
              <td>
                <span className={`badge ${asset.exposure === 'Internet-facing' ? 'crit' : 'neutral'}`}>
                  {asset.exposure}
                </span>
              </td>
              <td>{asset.vulns}</td>
              <td>{asset.coverage}%</td>
              <td>{asset.owner}</td>
              <td>
                {asset.action ? (
                  <button 
                    className="link-btn font-medium"
                    onClick={() => handleRowAction(asset)}
                  >
                    {asset.action} →
                  </button>
                ) : (
                  <span style={{ color: 'var(--sub)' }}>No action needed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="callout" style={{ marginTop: '24px' }}>
        <b>Payment API-04</b> — risk contribution explanation: internet-facing, 4 unpatched critical vulnerabilities, and control coverage of only 62% on the host. Last seen 6 minutes ago via CMDB and vulnerability-scanner connectors.
      </div>

      {/* Patch Remediation Work Order Modal */}
      <PatchRemediationModal
        isOpen={!!patchModalAsset}
        onClose={() => setPatchModalAsset(null)}
        assetName={patchModalAsset?.name || ''}
        recommendedAction={patchModalAsset?.action || ''}
        onConfirmPatch={(ticketId, window) => {
          onShowToast?.('success', 'Work Order Dispatched', `Created Jira change request ${ticketId} scheduled for ${window}.`);
        }}
      />

      {/* Credential Rotation Modal */}
      <CredentialRotationModal
        isOpen={!!rotateModalAsset}
        onClose={() => setRotateModalAsset(null)}
        assetName={rotateModalAsset?.name || ''}
        onConfirmRotation={(vault) => {
          onShowToast?.('success', 'Credentials Rotated', `Generated new TLS/API keys in ${vault} and revoked prior active sessions.`);
        }}
      />

      {/* Config Drift Modal */}
      <ConfigDriftModal
        isOpen={!!driftModalAsset}
        onClose={() => setDriftModalAsset(null)}
        assetName={driftModalAsset?.name || ''}
        onRemediateDrift={() => {
          onShowToast?.('success', 'Terraform Drift Remediated', `Applied golden IaC baseline for ${driftModalAsset?.name}. Port 5432 ingress restricted.`);
        }}
      />

      {/* Telemetry Discovery Scanner Modal */}
      <TelemetryScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onScanComplete={() => {
          onShowToast?.('success', 'Continuous Discovery Complete', 'All 1,420 assets synchronized with active telemetry and CMDB mappings.');
        }}
      />
    </div>
  );
};

