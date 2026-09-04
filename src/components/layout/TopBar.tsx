import React from 'react';
import { Search, Sparkles, Sun, Moon, Bell, ShieldCheck } from 'lucide-react';
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
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-12 py-3 bg-card/90 backdrop-blur-md border-b border-line gap-4 transition-all">
      {/* Search Input trigger */}
      <div 
        onClick={onOpenSearch}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-md border border-line bg-paper/80 hover:bg-paper hover:border-slate-400 text-sub hover:text-text text-[13px] cursor-pointer w-full max-w-sm transition-all shadow-xs group"
      >
        <Search size={14} className="group-hover:text-ink transition-colors" />
        <span className="flex-1 select-none font-normal">Search risks, assets, evidence...</span>
        <kbd className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-card border border-line text-sub shadow-xs">Ctrl K</kbd>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span>Continuous Telemetry Live</span>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-1.5 text-[13px] text-sub">
          <span className="hidden sm:inline font-medium">Role:</span>
          <select
            value={currentRole}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className="px-2.5 py-1 rounded border border-line bg-card text-text text-[13px] font-medium cursor-pointer hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-ink transition-all"
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
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-ink bg-ink hover:bg-slate-900 text-white text-[12.5px] font-medium cursor-pointer shadow-xs transition-all hover:shadow-sm active:scale-98"
        >
          <Sparkles size={13} className="text-amber" />
          <span>Ask AI</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded border border-line hover:border-slate-400 bg-card hover:bg-paper text-text cursor-pointer transition-colors shadow-xs"
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun size={15} className="text-amber" /> : <Moon size={15} className="text-ink" />}
        </button>
      </div>
    </header>
  );
};

