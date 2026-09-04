import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  AlertTriangle, 
  TrendingUp, 
  Menu,
  Sparkles
} from 'lucide-react';
import { NavigationPage } from '../../types';

interface MobileBottomNavProps {
  activePage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onOpenMenu: () => void;
  onOpenAI: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activePage,
  onNavigate,
  onOpenMenu,
  onOpenAI
}) => {
  const tabs = [
    { id: 'overview' as NavigationPage, label: 'Overview', icon: ShieldCheck },
    { id: 'crim-x' as NavigationPage, label: 'CRIM-X', icon: Cpu, isApex: true },
    { id: 'scenarios' as NavigationPage, label: 'Scenarios', icon: AlertTriangle },
    { id: 'optimizer' as NavigationPage, label: 'Optimizer', icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur-lg border-t border-line px-2 py-1.5 shadow-lg flex items-center justify-around pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {tabs.map((tab) => {
        const isActive = activePage === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all relative ${
              isActive 
                ? 'text-ledger font-semibold' 
                : 'text-sub hover:text-text'
            }`}
          >
            <div className="relative">
              <Icon size={18} className={isActive ? 'text-ledger' : 'text-sub'} />
              {tab.isApex && (
                <span className="absolute -top-1 -right-2.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-ledger mt-0.5" />
            )}
          </button>
        );
      })}

      {/* Floating Ask AI Button in Mobile Bar */}
      <button
        onClick={onOpenAI}
        className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-amber hover:text-amber/80 transition-all"
        title="Ask CyberOptix AI"
      >
        <Sparkles size={18} />
        <span className="text-[10px] mt-0.5 tracking-tight font-medium">Ask AI</span>
      </button>

      {/* Menu Hamburger */}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-sub hover:text-text transition-all"
        title="More Views"
      >
        <Menu size={18} />
        <span className="text-[10px] mt-0.5 tracking-tight">More</span>
      </button>
    </nav>
  );
};
