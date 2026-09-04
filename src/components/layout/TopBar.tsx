import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Sun, Moon, Bell, ShieldCheck, Lock, LogOut, ChevronDown, UserCheck, Shield, Menu, ShieldAlert, SlidersHorizontal, Workflow, FileCheck2 } from 'lucide-react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenAI: () => void;
  activePageTitle: string;
  onOpenMobileMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRole,
  onChangeRole,
  darkMode,
  onToggleTheme,
  onOpenSearch,
  onOpenAI,
  activePageTitle,
  onOpenMobileMenu
}) => {
  const { user, logout, lockSession, switchRole } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    onChangeRole(role);
    setIsProfileOpen(false);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'CO';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-3 md:px-10 py-2.5 md:py-3 bg-card/95 backdrop-blur-md border-b border-line gap-2 md:gap-4 transition-all">
      {/* Mobile Hamburger & Brand Icon */}
      <div className="flex items-center gap-2 md:hidden">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="p-1.5 rounded-md border border-line bg-card hover:bg-paper text-text transition-colors"
            aria-label="Open mobile navigation"
          >
            <Menu size={18} />
          </button>
        )}
        <div className="font-serif font-semibold text-sm text-text truncate max-w-[140px]">
          {activePageTitle}
        </div>
      </div>

      {/* Search Input trigger */}
      <div 
        onClick={onOpenSearch}
        className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-md border border-line bg-paper/90 hover:bg-paper hover:border-slate-400 text-sub hover:text-text text-[13px] cursor-pointer w-full max-w-sm transition-all shadow-xs group"
      >
        <Search size={14} className="group-hover:text-ledger transition-colors" />
        <span className="flex-1 select-none font-normal truncate">Search risks, assets, controls, evidence...</span>
        <kbd className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-card border border-line text-sub shadow-xs">Ctrl K</kbd>
      </div>

      {/* Mobile Search Icon Button */}
      <button
        onClick={onOpenSearch}
        className="sm:hidden p-1.5 rounded-md border border-line bg-card text-sub hover:text-text"
        title="Search"
      >
        <Search size={16} />
      </button>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span>Continuous Telemetry Live</span>
        </div>

        {/* Quick Role Switcher Selector */}
        <div className="hidden sm:flex items-center gap-1.5 text-[13px] text-sub">
          <span className="font-medium text-xs uppercase tracking-wider text-sub">Role:</span>
          <select
            value={currentRole}
            onChange={(e) => handleRoleSelect(e.target.value as UserRole)}
            className="px-2.5 py-1 rounded border border-line bg-card text-text text-[13px] font-medium cursor-pointer hover:border-ledger focus:outline-none focus:ring-1 focus:ring-ledger transition-all shadow-xs"
          >
            <option value="CISO">CISO (Strategic / Board)</option>
            <option value="CFO">CFO / CRO (Financial VaR)</option>
            <option value="SecurityArchitect">Security Architect (Technical)</option>
            <option value="Auditor">Compliance Auditor (Evidence)</option>
            <option value="Executive">Board Executive (Audit Comm)</option>
            <option value="SOC Analyst">SOC Analyst (Incidents)</option>
            <option value="GRC Analyst">GRC Analyst (Controls)</option>
            <option value="IT Owner">IT Asset Owner</option>
            <option value="Org Admin">Enterprise Admin</option>
          </select>
        </div>

        {/* Ask AI Copilot */}
        <button
          onClick={onOpenAI}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-ink bg-ink hover:bg-slate-900 text-white text-[12.5px] font-medium cursor-pointer shadow-xs transition-all hover:shadow-sm active:scale-98"
        >
          <Sparkles size={13} className="text-amber" />
          <span className="hidden md:inline">Ask AI</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-line hover:border-slate-400 bg-card hover:bg-paper text-text text-xs font-medium cursor-pointer transition-colors shadow-xs"
          title={darkMode ? 'Switch to Light Ledger theme' : 'Switch to Dark theme'}
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <>
              <Sun size={14} className="text-amber" />
              <span className="hidden xl:inline text-amber">Light</span>
            </>
          ) : (
            <>
              <Moon size={14} className="text-ink" />
              <span className="hidden xl:inline text-ink">Dark</span>
            </>
          )}
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setHasNotifications(false)}
          className="relative p-1.5 rounded border border-line hover:border-slate-400 bg-card hover:bg-paper text-text cursor-pointer transition-colors shadow-xs"
          title="Notifications"
        >
          <Bell size={15} />
          {hasNotifications && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-crimson ring-2 ring-card" />
          )}
        </button>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-line bg-card hover:bg-paper cursor-pointer transition-all shadow-xs group"
          >
            <div className="w-6 h-6 rounded-full bg-ink text-white font-medium text-[11px] flex items-center justify-center shadow-xs">
              {getInitials(user?.name)}
            </div>
            <span className="text-xs font-medium text-text hidden md:inline max-w-[100px] truncate">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown size={12} className="text-sub group-hover:text-text transition-transform" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-card rounded-xl border border-line shadow-2xl p-2 z-50 animate-fadeIn">
              {/* User Details */}
              <div className="p-3 border-b border-line bg-paper/60 rounded-lg mb-2">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-full bg-ink text-white font-serif text-xs font-medium flex items-center justify-center">
                    {getInitials(user?.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-text truncate">{user?.name}</div>
                    <div className="text-[11px] text-sub truncate">{user?.email}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-line/60">
                  <span className="badge teal text-[10px]">{user?.role}</span>
                  <span className="text-sub truncate max-w-[140px]">{user?.organization}</span>
                </div>
              </div>

              {/* Fast Switch Role within Dropdown */}
              <div className="px-2 py-1 text-[11px] font-semibold text-sub uppercase tracking-wider">
                Switch Role Persona
              </div>
              <div className="grid grid-cols-2 gap-1 mb-2">
                {[
                  { role: 'CISO' as UserRole, icon: ShieldAlert },
                  { role: 'CFO' as UserRole, icon: SlidersHorizontal },
                  { role: 'SecurityArchitect' as UserRole, icon: Workflow },
                  { role: 'Auditor' as UserRole, icon: FileCheck2 },
                ].map(({ role: r, icon: Icon }) => (
                  <button
                    key={r}
                    onClick={() => handleRoleSelect(r)}
                    className={`px-2 py-1.5 text-xs text-left rounded cursor-pointer transition-colors flex items-center justify-between gap-1.5 ${
                      user?.role === r 
                        ? 'bg-ink text-white font-medium' 
                        : 'hover:bg-paper text-text'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Icon size={12} className={user?.role === r ? 'text-teal' : 'text-sub'} />
                      <span className="truncate">{r}</span>
                    </div>
                    {user?.role === r && <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />}
                  </button>
                ))}
              </div>

              <div className="border-t border-line my-1" />

              {/* Lock Session */}
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  lockSession();
                }}
                className="w-full px-3 py-2 text-xs text-text hover:bg-paper rounded flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Lock size={13} className="text-sub" />
                <span>Lock Session</span>
              </button>

              {/* Sign Out */}
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="w-full px-3 py-2 text-xs text-crimson hover:bg-crimson/10 rounded flex items-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


