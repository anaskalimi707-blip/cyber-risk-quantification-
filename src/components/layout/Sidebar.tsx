import React, { useState, useEffect, useRef } from 'react';
import { NavigationPage, UserRole } from '../../types';
import { 
  Sparkles, 
  Building2, 
  Filter, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert,
  SlidersHorizontal,
  FileCheck2,
  Workflow,
  ShieldCheck,
  Cpu,
  Activity,
  Server,
  TrendingUp,
  Zap,
  FileText,
  FileSpreadsheet,
  Settings,
  Users
} from 'lucide-react';

interface SidebarProps {
  activePage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  width: number;
  onResize: (newWidth: number) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenAI: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  currentRole,
  onChangeRole,
  width,
  onResize,
  collapsed,
  onToggleCollapse,
  onOpenAI
}) => {
  const [filterByRole, setFilterByRole] = useState<boolean>(true);
  const isDraggingRef = useRef<boolean>(false);

  // Role page definitions
  const roleFocusMap: Partial<Record<UserRole, { pages: NavigationPage[]; label: string; icon: any; desc: string }>> = {
    CISO: {
      pages: ['overview', 'crim-x', 'command-center', 'scenarios', 'optimizer', 'what-if', 'reports', 'settings'],
      label: 'CISO / Board Focus',
      icon: ShieldAlert,
      desc: 'Strategic exposure & capital allocation'
    },
    CFO: {
      pages: ['overview', 'crim-x', 'scenarios', 'optimizer', 'vendors', 'reports', 'settings'],
      label: 'CFO / CRO Focus',
      icon: SlidersHorizontal,
      desc: 'Loss Value-at-Risk & Investment ROI'
    },
    SecurityArchitect: {
      pages: ['crim-x', 'command-center', 'scenarios', 'assets', 'controls', 'what-if', 'incidents'],
      label: 'SecOps & Architecture',
      icon: Workflow,
      desc: 'Blast radius, attack paths & telemetry'
    },
    Auditor: {
      pages: ['crim-x', 'compliance', 'controls', 'vendors', 'incidents', 'reports', 'settings'],
      label: 'Audit & Compliance',
      icon: FileCheck2,
      desc: 'Regulatory traceability & evidence digests'
    },
    Executive: {
      pages: ['overview', 'crim-x', 'command-center', 'optimizer', 'reports'],
      label: 'Executive Leadership',
      icon: ShieldAlert,
      desc: 'High-level financial summaries & capital plans'
    },
    'SOC Analyst': {
      pages: ['command-center', 'scenarios', 'assets', 'incidents'],
      label: 'SecOps Operations',
      icon: Activity,
      desc: 'Incident response & asset vulnerability telemetry'
    },
    'GRC Analyst': {
      pages: ['crim-x', 'compliance', 'controls', 'vendors', 'reports'],
      label: 'GRC Program',
      icon: FileCheck2,
      desc: 'Framework scoring, controls audit & vendor assessments'
    },
    'IT Owner': {
      pages: ['assets', 'controls', 'incidents'],
      label: 'IT Asset Operations',
      icon: Building2,
      desc: 'Asset ownership, patch SLAs & control health'
    },
    'Org Admin': {
      pages: ['overview', 'crim-x', 'command-center', 'scenarios', 'assets', 'controls', 'optimizer', 'what-if', 'compliance', 'connectors', 'audit-log', 'incidents', 'vendors', 'reports', 'settings'],
      label: 'Enterprise Administrator',
      icon: Layers,
      desc: 'Full platform administration & configuration'
    }
  };

  const allNavItems: { id: NavigationPage; label: string; badge?: string; icon: any; roles: UserRole[] }[] = [
    { id: 'overview', label: 'Overview', icon: ShieldCheck, roles: ['CISO', 'CFO'] },
    { id: 'crim-x', label: 'CRIM-X Apex Engine', badge: 'Apex AI', icon: Cpu, roles: ['CISO', 'CFO', 'SecurityArchitect', 'Auditor'] },
    { id: 'command-center', label: 'Risk Command Center', badge: 'Live', icon: Activity, roles: ['CISO', 'SecurityArchitect'] },
    { id: 'scenarios', label: 'Risk Scenarios', icon: ShieldAlert, roles: ['CISO', 'CFO', 'SecurityArchitect'] },
    { id: 'assets', label: 'Assets & Exposure', icon: Server, roles: ['SecurityArchitect'] },
    { id: 'controls', label: 'Controls Matrix', icon: Workflow, roles: ['SecurityArchitect', 'Auditor'] },
    { id: 'optimizer', label: 'Investment Optimizer', badge: 'AI', icon: TrendingUp, roles: ['CISO', 'CFO'] },
    { id: 'what-if', label: 'What-If Simulator', icon: SlidersHorizontal, roles: ['CISO', 'SecurityArchitect'] },
    { id: 'incidents', label: 'Incidents & Resilience', icon: Zap, roles: ['SecurityArchitect', 'Auditor'] },
    { id: 'vendors', label: 'Third-Party Risk', icon: Users, roles: ['CFO', 'Auditor'] },
    { id: 'compliance', label: 'Compliance & Evidence', icon: FileCheck2, roles: ['Auditor'] },
    { id: 'connectors', label: 'Connectors', icon: Layers, roles: ['SecurityArchitect', 'Auditor'] },
    { id: 'audit-log', label: 'Audit Log', icon: FileText, roles: ['Auditor', 'CISO'] },
    { id: 'reports', label: 'Reports & Briefings', icon: FileSpreadsheet, roles: ['CISO', 'CFO', 'Auditor'] },
    { id: 'settings', label: 'Settings & Risk Appetite', icon: Settings, roles: ['CISO', 'CFO', 'Auditor'] },
  ];

  const displayedItems = filterByRole
    ? allNavItems.filter(item => roleFocusMap[currentRole]?.pages.includes(item.id))
    : allNavItems;

  // Handle Resizing via Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const newWidth = Math.min(Math.max(moveEvent.clientX, 190), 380);
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const RoleIcon = roleFocusMap[currentRole]?.icon || ShieldAlert;

  if (collapsed) {
    return (
      <nav 
        className="bg-ink text-slate-200 py-6 px-2 flex flex-col items-center h-screen sticky top-0 select-none shadow-xl border-r border-white/10 z-30 transition-all"
        style={{ width: '64px' }}
      >
        <div 
          onClick={() => onNavigate('overview')} 
          className="w-8 h-8 mb-4 rounded-lg overflow-hidden cursor-pointer ring-1 ring-white/20 hover:scale-105 transition-transform flex-shrink-0"
          title="CyberOptix Enterprise"
        >
          <img src="/cyberoptix-logo.png" alt="CyberOptix" className="w-full h-full object-cover" />
        </div>

        <button 
          onClick={onToggleCollapse} 
          className="p-1.5 mb-4 text-slate-400 hover:text-white rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
          title="Expand Sidebar"
        >
          <ChevronRight size={18} />
        </button>

        <div className="flex flex-col gap-1.5 flex-1 items-center overflow-y-auto w-full px-1">
          {displayedItems.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`p-2 rounded-lg cursor-pointer transition-all flex items-center justify-center relative w-full ${
                  isActive 
                    ? 'bg-ledger/20 text-[#38BDF8] border border-ledger/30 shadow-xs' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title={item.label}
              >
                <Icon size={17} />
                {item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal ring-2 ring-ink" />
                )}
              </button>
            );
          })}
        </div>

        <button 
          onClick={onOpenAI}
          className="p-2.5 mt-2 rounded-xl bg-teal/20 text-[#2DD4BF] hover:bg-teal/30 cursor-pointer transition-all"
          title="Ask AI Copilot"
        >
          <Sparkles size={16} className="text-amber animate-pulse" />
        </button>
      </nav>
    );
  }

  return (
    <nav 
      className="rail bg-ink text-slate-200 p-6 flex flex-col gap-1 h-screen sticky top-0 select-none shadow-xl relative z-30 transition-all"
      style={{ width: `${width}px`, minWidth: '190px', maxWidth: '380px' }}
    >
      {/* Brand & Collapse Header */}
      <div className="brand font-serif text-[19px] text-white mb-4 tracking-wide flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer truncate" onClick={() => onNavigate('overview')}>
          <img src="/cyberoptix-logo.png" alt="CyberOptix" className="w-6 h-6 rounded object-cover shadow-sm ring-1 ring-white/20" />
          <span className="truncate">
            Cyber<span className="text-[#7FB3DF]">Optix</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-sans font-semibold tracking-wider text-slate-400 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/10">v2.4</span>
          <button 
            onClick={onToggleCollapse} 
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 cursor-pointer transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      {/* Role Indicator Banner & Filter Toggle */}
      <div className="mb-3.5 p-2.5 rounded bg-white/5 border border-white/10">
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <RoleIcon size={14} className="text-teal shrink-0" />
            <span className="text-xs font-semibold text-white truncate">
              {roleFocusMap[currentRole]?.label}
            </span>
          </div>
          <button 
            onClick={() => setFilterByRole(!filterByRole)}
            className={`p-1 rounded text-[10px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              filterByRole ? 'bg-teal/20 text-teal border border-teal/30' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
            title={filterByRole ? "Showing role-specific menus. Click to show all." : "Showing all menus. Click for role focus."}
          >
            {filterByRole ? <Filter size={11} /> : <Layers size={11} />}
            <span>{filterByRole ? 'Role' : 'All'}</span>
          </button>
        </div>
        <p className="text-[10.5px] text-slate-400 leading-tight m-0 truncate">
          {roleFocusMap[currentRole]?.desc}
        </p>
      </div>

      {/* Navigation Items with Icons */}
      <div className="flex flex-col gap-0.5 flex-1 overflow-y-auto pr-1">
        {displayedItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;
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
              <Icon 
                size={15} 
                className={`shrink-0 transition-colors ${
                  isActive ? 'text-teal' : 'text-slate-400 group-hover:text-slate-200'
                }`} 
              />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span 
                  className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    item.badge === 'AI' || item.badge === 'Apex AI'
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

      {/* AI Copilot Launch Button */}
      <div className="my-2.5">
        <button
          onClick={onOpenAI}
          className="w-full py-2 px-3 rounded bg-teal/15 hover:bg-teal/25 border border-teal/35 hover:border-teal/50 text-[#2DD4BF] text-[12.5px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
        >
          <Sparkles size={13} className="text-amber animate-pulse" />
          <span className="truncate">Ask CyberOptix Copilot</span>
        </button>
      </div>

      {/* Workspace Footer */}
      <div className="pt-3 border-t border-white/10 text-[11.5px] text-slate-400 flex items-center gap-2">
        <Building2 size={14} className="text-slate-500 shrink-0" />
        <div className="truncate min-w-0">
          <strong className="text-slate-200 font-medium block truncate">Acme Financial Services</strong>
          <span className="text-[10.5px] text-slate-400 truncate block">{currentRole} Workspace</span>
        </div>
      </div>

      {/* Resizable Drag Handle on Right Border */}
      <div 
        onMouseDown={handleMouseDown}
        className="absolute top-0 right-0 w-1.5 h-full hover:w-2 bg-transparent hover:bg-teal/60 cursor-col-resize transition-all flex items-center justify-center group"
        title="Drag to resize sidebar width"
      >
        <div className="w-0.5 h-6 bg-slate-600 rounded-full group-hover:bg-teal transition-colors" />
      </div>
    </nav>
  );
};


