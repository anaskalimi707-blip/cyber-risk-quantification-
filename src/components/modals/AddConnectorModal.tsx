import React, { useState } from 'react';
import { X, Plug, ShieldCheck, Database, Key } from 'lucide-react';

interface AddConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectorAdded: (conn: { name: string; type: string; description?: string }) => void;
}

export const AddConnectorModal: React.FC<AddConnectorModalProps> = ({ isOpen, onClose, onConnectorAdded }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('CMDB');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [scope, setScope] = useState('Read-Only Telemetry');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onConnectorAdded({
      name,
      type,
      description: `${scope} integration with ${endpointUrl || 'configured API endpoint'}.`
    });
    setName('');
    setEndpointUrl('');
    setApiKey('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-card w-full max-w-lg rounded-lg border border-line shadow-2xl overflow-hidden animate-scaleUp">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-paper/50">
          <div className="flex items-center gap-2">
            <Plug size={18} className="text-teal" />
            <h3 className="font-serif text-lg text-ink font-medium m-0">Add Telemetry Connector</h3>
          </div>
          <button onClick={onClose} className="text-sub hover:text-ink cursor-pointer p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1">
              Connector Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Splunk Enterprise SIEM, Wiz Cloud Security"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm p-2.5 rounded border border-line bg-paper text-text focus:outline-none focus:border-ledger"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1">
                Integration Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-sm p-2.5 rounded border border-line bg-paper text-text focus:outline-none focus:border-ledger"
              >
                <option value="CMDB">CMDB / Asset Inventory</option>
                <option value="Vulnerability Scanner">Vulnerability Scanner</option>
                <option value="IAM / IdP">IAM / Identity Provider</option>
                <option value="EDR / XDR">EDR / XDR Telemetry</option>
                <option value="Threat Intelligence">Threat Intelligence</option>
                <option value="Cloud Security Posture">CSPM / CNAPP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1">
                Access Scope
              </label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full text-sm p-2.5 rounded border border-line bg-paper text-text focus:outline-none focus:border-ledger"
              >
                <option value="Read-Only Telemetry">Read-Only Telemetry</option>
                <option value="Findings & Posture">Findings & Posture</option>
                <option value="Continuous Pull">Continuous Pull (Real-time)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1">
              API Endpoint URL
            </label>
            <input
              type="url"
              placeholder="https://api.your-instance.cloud/v1/telemetry"
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              className="w-full text-sm p-2.5 rounded border border-line bg-paper text-text focus:outline-none focus:border-ledger font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1">
              API Token / Key (Read-Only)
            </label>
            <input
              type="password"
              placeholder="••••••••••••••••••••••••••••••••"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full text-sm p-2.5 rounded border border-line bg-paper text-text focus:outline-none focus:border-ledger font-mono text-xs"
            />
          </div>

          <div className="p-3 bg-paper rounded border border-line text-xs text-sub flex items-center gap-2">
            <ShieldCheck size={16} className="text-teal shrink-0" />
            <span>Encrypted at rest using AES-256 GCM. CyberOptix will never request write or execute permissions.</span>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-line">
            <button type="button" onClick={onClose} className="btn">
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Verify & Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
