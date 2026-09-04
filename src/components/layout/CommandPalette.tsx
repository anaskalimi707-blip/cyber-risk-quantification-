import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, TrendingUp, Shield, Server, FileText, X } from 'lucide-react';
import { NavigationPage } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: NavigationPage) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { label: 'View Ransomware Risk Scenario (₹4.2 Cr EAL)', icon: AlertTriangle, page: 'scenarios' as NavigationPage, category: 'Top Risk Scenarios' },
    { label: 'Run PuLP Investment Optimizer (₹1 Cr Budget)', icon: TrendingUp, page: 'optimizer' as NavigationPage, category: 'Optimization' },
    { label: 'Open What-If Sandbox Simulator', icon: TrendingUp, page: 'what-if' as NavigationPage, category: 'Simulation' },
    { label: 'Inspect Internet-Exposed Assets (Payment API-04)', icon: Server, page: 'assets' as NavigationPage, category: 'Asset Graph' },
    { label: 'Review SEBI CSCRF / NIST CSF 2.0 Compliance Gaps', icon: Shield, page: 'compliance' as NavigationPage, category: 'Compliance' },
    { label: 'Manage Telemetry & Ingestion Connectors', icon: Server, page: 'connectors' as NavigationPage, category: 'Integrations' },
    { label: 'Inspect Tamper-Evident SHA-256 Audit Log', icon: Shield, page: 'audit-log' as NavigationPage, category: 'Governance' },
    { label: 'Generate Q3 2026 Board Executive Briefing', icon: FileText, page: 'reports' as NavigationPage, category: 'Reporting' },
  ];

  const filtered = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <div 
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-start justify-center pt-24 md:pt-32 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-card rounded-lg border border-line shadow-2xl overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-line bg-paper/50">
          <Search size={16} className="text-sub mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, risk scenario, or asset name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-ink placeholder:text-sub text-sm font-normal"
          />
          <button 
            onClick={onClose} 
            className="p-1 text-sub hover:text-ink cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-line/30">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-sub">No matching actions or scenarios found.</div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(item.page);
                    onClose();
                  }}
                  className="w-full px-3 py-2.5 flex items-center gap-3 rounded text-left hover:bg-paper cursor-pointer transition-colors group"
                >
                  <div className="p-2 rounded bg-ledger/10 text-ledger group-hover:bg-ledger group-hover:text-white transition-colors shrink-0">
                    <Icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-text group-hover:text-ink truncate">{item.label}</div>
                    <div className="text-[11px] text-sub">{item.category}</div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

