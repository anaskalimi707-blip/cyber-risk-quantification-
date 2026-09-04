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
        // Handled by parent
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
    { label: 'Generate Q3 2026 Board Executive Briefing', icon: FileText, page: 'reports' as NavigationPage, category: 'Reporting' },
  ];

  const filtered = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg-overlay)',
        backdropFilter: 'blur(3px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
          <Search size={18} style={{ color: 'var(--text-muted)', marginRight: '0.75rem' }} />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, risk scenario, or asset name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.95rem'
            }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '0.5rem' }}>
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  onNavigate(item.page);
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.88rem'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(20, 102, 170, 0.1)', color: 'var(--color-blue)' }}>
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
