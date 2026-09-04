import React from 'react';
import { 
  X, 
  Shield, 
  Sparkles, 
  Sun, 
  Moon, 
  Lock, 
  LogOut, 
  Check, 
  ChevronRight,
  ShieldAlert,
  SlidersHorizontal,
  Workflow,
  FileCheck2,
  Layers,
  Activity,
  Building2,
  TrendingUp,
  Cpu,
  Zap
} from 'lucide-react';
import { NavigationPage, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenAI: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  activePage,
  onNavigate,
  currentRole,
  onChangeRole,
  darkMode,
  onToggleTheme,
  onOpenAI
}) => {
  const { user, logout, lockSession } = useAuth();

  if (!isOpen) return null;

  const navItems: { id: NavigationPage; label: string; badge?: string; icon?: any }[] = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'crim-x', label: 'CRIM-X Apex Engine', badge: 'Apex AI', icon: Cpu },
    { id: 'command-center', label: 'Risk Command Center', badge: 'Live', icon: Activity },
    { id: 'scenarios', label: 'Risk Scenarios', icon: ShieldAlert },
    { id: 'assets', label: 'Assets & Exposure', icon: Building2 },
    { id: 'controls', label: 'Controls Matrix', icon: Workflow },
    { id: 'optimizer', label: 'Investment Optimizer', badge: 'AI', icon: TrendingUp },
    { id: 'what-if', label: 'What-If Simulator', icon: SlidersHorizontal },
    { id: 'incidents', label: 'Incidents & Resilience', icon: Zap },
    { id: 'vendors', label: 'Third-Party Risk', icon: Building2 },
    { id: 'compliance', label: 'Compliance & Evidence', icon: FileCheck2 },
    { id: 'connectors', label: 'Connectors', icon: Layers },
    { id: 'audit-log', label: 'Audit Log', icon: FileCheck2 },
    { id: 'reports', label: 'Reports & Briefings', icon: FileCheck2 },
    { id: 'settings', label: 'Settings & Risk Appetite', icon: SlidersHorizontal },
  ];

  const roles: { role: UserRole; label: string }[] = [
    { role: 'CISO', label: 'CISO / Board' },
    { role: 'CFO', label: 'CFO / CRO' },
    { role: 'SecurityArchitect', label: 'SecOps Architect' },
    { role: 'Auditor', label: 'Compliance Auditor' },
    { role: 'Executive', label: 'Executive Leadership' },
    { role: 'SOC Analyst', label: 'SOC Analyst' },
    { role: 'GRC Analyst', label: 'GRC Analyst' },
    { role: 'Org Admin', label: 'Org Admin' },
  ];

  const handleItemClick = (page: NavigationPage) => {
    onNavigate(page);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative flex flex-col w-full max-w-xs bg-card border-r border-line shadow-2xl h-full overflow-hidden z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-line bg-paper/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-tr from-sky-600 to-teal flex items-center justify-center text-white font-serif font-bold text-sm shadow-xs">
              CO
            </div>
            <div>
              <div className="font-serif font-medium text-base text-text leading-tight">
                Cyber<span className="text-ledger">Optix</span>
              </div>
              <div className="text-[10px] text-teal font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                Live Telemetry
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-sub hover:text-text hover:bg-line/40 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Persona & Role Selector */}
        <div className="p-4 border-b border-line bg-paper/30 space-y-2">
          <div className="text-xs font-semibold text-sub uppercase tracking-wider">Active Role Persona</div>
          <div className="grid grid-cols-2 gap-1.5 max-h-28 overflow-y-auto pr-1">
            {roles.map(({ role, label }) => {
              const isSelected = currentRole === role;
              return (
                <button
                  key={role}
                  onClick={() => onChangeRole(role)}
                  className={`px-2 py-1.5 text-left rounded text-xs font-medium truncate flex items-center justify-between border transition-all ${
                    isSelected 
                      ? 'bg-ledger/15 text-ledger border-ledger/40 shadow-xs' 
                      : 'bg-card text-sub border-line hover:text-text hover:border-slate-400'
                  }`}
                >
                  <span className="truncate">{label}</span>
                  {isSelected && <Check size={12} className="text-ledger shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Quick Trigger */}
        <div className="p-3 border-b border-line">
          <button
            onClick={() => {
              onClose();
              onOpenAI();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-medium shadow-sm transition-all"
          >
            <Sparkles size={14} className="text-amber" />
            <span>Ask CyberOptix AI Copilot</span>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[11px] font-semibold text-sub uppercase tracking-wider px-2 py-1">Views & Analytics</div>
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon || Shield;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-ledger/15 text-ledger border border-ledger/30 font-semibold'
                    : 'text-text hover:bg-line/40'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon size={16} className={isActive ? 'text-ledger' : 'text-sub'} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    item.badge.includes('Apex') 
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                      : 'bg-teal/15 text-teal border border-teal/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-line bg-paper/60 space-y-2">
          {/* Theme Switcher & Lock Session */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onToggleTheme}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded border border-line bg-card text-text text-xs font-medium hover:border-slate-400 transition-colors"
            >
              {darkMode ? <Sun size={14} className="text-amber" /> : <Moon size={14} className="text-ink" />}
              <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
            </button>
            <button
              onClick={() => {
                onClose();
                lockSession();
              }}
              className="flex items-center justify-center p-2 rounded border border-line bg-card text-sub hover:text-text hover:border-slate-400 transition-colors"
              title="Lock Session"
            >
              <Lock size={15} />
            </button>
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="flex items-center justify-center p-2 rounded border border-crimson/30 bg-crimson/10 text-crimson hover:bg-crimson/20 transition-colors"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
          <div className="text-[10px] text-center text-sub">
            CyberOptix Enterprise v1.0 • FAIR & CSCRF Grounded
          </div>
        </div>
      </div>
    </div>
  );
};
