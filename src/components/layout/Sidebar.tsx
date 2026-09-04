import React from 'react';
import { NavigationPage } from '../../types';

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
    <nav className="rail">
      <div className="brand">
        Cyber<span>Optix</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="dot"></span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span 
                  style={{
                    fontSize: '10px',
                    padding: '2px 5px',
                    borderRadius: '3px',
                    backgroundColor: item.badge === 'AI' ? 'rgba(0, 150, 135, 0.25)' : 'rgba(20, 102, 170, 0.25)',
                    color: item.badge === 'AI' ? 'var(--teal)' : '#7FB3DF',
                    fontWeight: 700
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: '14px', marginBottom: '14px' }}>
        <button
          onClick={onOpenAI}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '4px',
            backgroundColor: 'rgba(0, 150, 135, 0.15)',
            border: '1px solid rgba(0, 150, 135, 0.35)',
            color: '#2DD4BF',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <span>✦ Ask CyberOptix Copilot</span>
        </button>
      </div>

      <div className="foot">
        <strong>Acme Financial Services</strong><br/>
        CISO workspace · Enterprise Tier
      </div>
    </nav>
  );
};
