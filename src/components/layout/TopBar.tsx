import React from 'react';
import { Search, Sparkles, Sun, Moon, Bell } from 'lucide-react';
import { UserRole } from '../../types';

interface TopBarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenAI: () => void;
  activePageTitle: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRole,
  onChangeRole,
  darkMode,
  onToggleTheme,
  onOpenSearch,
  onOpenAI,
  activePageTitle
}) => {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 48px',
        borderBottom: '1px solid var(--line)',
        backgroundColor: 'var(--card)',
        zIndex: 50,
        gap: '1rem'
      }}
    >
      {/* Search Input trigger */}
      <div 
        onClick={onOpenSearch}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '4px',
          border: '1px solid var(--line)',
          backgroundColor: 'var(--paper)',
          color: 'var(--sub)',
          fontSize: '13px',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '380px'
        }}
      >
        <Search size={14} />
        <span style={{ flex: 1 }}>Search risks, assets, evidence...</span>
        <kbd style={{ fontSize: '11px', padding: '1px 5px', borderRadius: '3px', backgroundColor: 'var(--card)', border: '1px solid var(--line)' }}>Ctrl K</kbd>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--sub)' }}>
          <span>Role:</span>
          <select
            value={currentRole}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid var(--line)',
              backgroundColor: 'var(--card)',
              color: 'var(--text)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <option value="CISO">CISO (Strategic / Board)</option>
            <option value="CFO">CFO / CRO (Financial Risk)</option>
            <option value="SecurityArchitect">Security Architect (Technical)</option>
            <option value="Auditor">Compliance Auditor (Evidence)</option>
          </select>
        </div>

        {/* Ask AI Copilot */}
        <button
          onClick={onOpenAI}
          className="btn-primary"
          style={{ padding: '6px 12px', fontSize: '12.5px' }}
        >
          <Sparkles size={14} />
          <span>Ask AI</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          style={{
            background: 'none',
            border: '1px solid var(--line)',
            borderRadius: '4px',
            padding: '6px 8px',
            cursor: 'pointer',
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
};
