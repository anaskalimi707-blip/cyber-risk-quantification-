import React from 'react';
import { NavigationPage } from '../../types';
import { Sparkles, Shield, Building2 } from 'lucide-react';

interface SidebarProps {
  activePage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenAI: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  onOpenAI
}) => {
  const navItems: { id: NavigationPage; label: string; badge?: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'command-center', label: 'Risk Command Center', badge: 'Live' },
    { id: 'scenarios', label: 'Risk Scenarios' },
    { id: 'assets', label: 'Assets & Exposure' },
    { id: 'controls', label: 'Controls' },
    { id: 'optimizer', label: 'Investment Optimizer', badge: 'AI' },
    { id: 'what-if', label: 'What-If Simulator' },
    { id: 'incidents', label: 'Incidents & Resilience' },
    { id: 'vendors', label: 'Third-Party Risk' },
    { id: 'compliance', label: 'Compliance & Evidence' },
    { id: 'reports', label: 'Reports & Briefings' },
    { id: 'settings', label: 'Settings & Risk Appetite' },
  ];

  return (
    <nav className="rail bg-ink text-slate-200 p-7 flex flex-col gap-1 h-screen sticky top-0 select-none shadow-xl">
      <div className="brand font-serif text-[19px] text-white mb-8 tracking-wide flex items-center justify-between">
        <span className="cursor-pointer" onClick={() => onNavigate('overview')}>
          Cyber<span className="text-[#7FB3DF]">Optix</span>
        </span>
        <span className="text-[10px] font-sans font-semibold tracking-wider text-slate-400 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/10">v2.4</span>
      </div>

      <div className="flex flex-col gap-0.5 flex-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              className={`group flex items-center gap-2.5 px-3 py-2 rounded text-[13px] text-left cursor-pointer transition-all ${
                isActive 
                  ? 'bg-white/10 text-white font-medium shadow-xs' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <span className={`w-1.5 h-1.5 rounded-full transition-all shrink-0 ${
                isActive ? 'bg-teal shadow-[0_0_8px_rgba(0,150,135,0.8)] scale-125' : 'bg-slate-500 group-hover:bg-slate-300'
              }`} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span 
                  className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    item.badge === 'AI' 
                      ? 'bg-teal/20 text-teal border border-teal/30' 
                      : 'bg-ledger/20 text-[#7FB3DF] border border-ledger/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="my-3">
        <button
          onClick={onOpenAI}
          className="w-full py-2 px-3 rounded bg-teal/15 hover:bg-teal/25 border border-teal/35 hover:border-teal/50 text-[#2DD4BF] text-[12.5px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
        >
          <Sparkles size={13} className="text-amber animate-pulse" />
          <span>Ask CyberOptix Copilot</span>
        </button>
      </div>

      <div className="pt-4 border-t border-white/10 text-[11.5px] text-slate-400 flex items-center gap-2">
        <Building2 size={14} className="text-slate-500 shrink-0" />
        <div className="truncate">
          <strong className="text-slate-200 font-medium block truncate">Acme Financial Services</strong>
          <span className="text-[10.5px] text-slate-400">CISO Workspace · Enterprise</span>
        </div>
      </div>
    </nav>
  );
};

