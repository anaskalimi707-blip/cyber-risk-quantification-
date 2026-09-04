import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { CommandPalette } from './components/layout/CommandPalette';
import { AICopilotDrawer } from './components/ai/AICopilotDrawer';
import { DocumentViewerModal } from './components/common/DocumentViewerModal';
import { EvidenceInspectorDrawer } from './components/common/EvidenceInspectorDrawer';
import { ToastContainer, ToastMessage } from './components/common/ToastContainer';

import { ExecutiveOverview } from './components/views/ExecutiveOverview';
import { RiskCommandCenter } from './components/views/RiskCommandCenter';
import { RiskScenarioDetails } from './components/views/RiskScenarioDetails';
import { AssetsExposure } from './components/views/AssetsExposure';
import { ControlsMatrix } from './components/views/ControlsMatrix';
import { InvestmentOptimizer } from './components/views/InvestmentOptimizer';
import { WhatIfSimulator } from './components/views/WhatIfSimulator';
import { ComplianceEvidence } from './components/views/ComplianceEvidence';
import { IncidentsResilience } from './components/views/IncidentsResilience';
import { ThirdPartyRisk } from './components/views/ThirdPartyRisk';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

import { NavigationPage, UserRole } from './types';

export function App() {
  const [activePage, setActivePage] = useState<NavigationPage>('overview');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scen-ransomware-payment');
  const [currentRole, setCurrentRole] = useState<UserRole>('CISO');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarWidth, setSidebarWidth] = useState<number>(240);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);

  // Document Modal & Evidence Inspector State
  const [documentModalData, setDocumentModalData] = useState<{ isOpen: boolean; title: string; type: string }>({
    isOpen: false,
    title: '',
    type: ''
  });
  const [inspectedEvidence, setInspectedEvidence] = useState<any | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'warning' | 'info', title: string, description: string) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openDocument = (title: string, type: string) => {
    setDocumentModalData({ isOpen: true, title, type });
  };

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  // Global keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getPageTitle = () => {
    switch (activePage) {
      case 'overview': return 'Cyber Risk Overview';
      case 'command-center': return 'Risk Command Center';
      case 'scenarios': return 'Risk Scenario Details';
      case 'assets': return 'Assets & Exposure';
      case 'controls': return 'Controls';
      case 'optimizer': return 'Investment Optimizer';
      case 'what-if': return 'What-If Simulator';
      case 'compliance': return 'Compliance';
      case 'incidents': return 'Incidents';
      case 'vendors': return 'Third-Party Risk';
      case 'reports': return 'Reports';
      case 'settings': return 'Settings';
      default: return 'Overview';
    }
  };

  const renderActiveView = () => {
    switch (activePage) {
      case 'overview':
        return (
          <ExecutiveOverview 
            onNavigate={(page) => setActivePage(page)}
            onSelectScenario={(id) => {
              setSelectedScenarioId(id);
              setActivePage('scenarios');
            }}
            onOpenDocument={openDocument}
            onInspectEvidence={(ev) => setInspectedEvidence(ev)}
          />
        );
      case 'command-center':
        return (
          <RiskCommandCenter 
            onNavigate={(page) => setActivePage(page)}
            onSelectScenario={(id) => {
              setSelectedScenarioId(id);
              setActivePage('scenarios');
            }}
          />
        );
      case 'scenarios':
        return (
          <RiskScenarioDetails 
            scenarioId={selectedScenarioId}
            onNavigate={(page) => setActivePage(page)}
            onBack={() => setActivePage('command-center')}
            onInspectEvidence={(ev) => setInspectedEvidence(ev)}
          />
        );
      case 'assets':
        return <AssetsExposure onNavigate={(page) => setActivePage(page)} />;
      case 'controls':
        return <ControlsMatrix onNavigate={(page) => setActivePage(page)} />;
      case 'optimizer':
        return (
          <InvestmentOptimizer 
            onNavigate={(page) => setActivePage(page)} 
            onShowToast={showToast}
            onOpenDocument={openDocument}
          />
        );
      case 'what-if':
        return <WhatIfSimulator onNavigate={(page) => setActivePage(page)} />;
      case 'compliance':
        return <ComplianceEvidence onNavigate={(page) => setActivePage(page)} />;
      case 'incidents':
        return <IncidentsResilience onNavigate={(page) => setActivePage(page)} />;
      case 'vendors':
        return <ThirdPartyRisk onNavigate={(page) => setActivePage(page)} />;
      case 'reports':
        return (
          <ReportsView 
            onNavigate={(page) => setActivePage(page)} 
            onOpenDocument={openDocument}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <ExecutiveOverview 
            onNavigate={(page) => setActivePage(page)}
            onSelectScenario={(id) => {
              setSelectedScenarioId(id);
              setActivePage('scenarios');
            }}
            onOpenDocument={openDocument}
            onInspectEvidence={(ev) => setInspectedEvidence(ev)}
          />
        );
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: sidebarCollapsed ? '64px 1fr' : `${sidebarWidth}px 1fr`,
    minHeight: '100vh',
    transition: 'grid-template-columns 0.08s ease'
  };

  return (
    <div style={gridStyle} className="shell">
      {/* Dark Navy Rail Sidebar with Resize & Role-Based Menus */}
      <Sidebar 
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        currentRole={currentRole}
        onChangeRole={(role) => {
          setCurrentRole(role);
          showToast('info', 'Role Switched', `Active workspace persona updated to ${role}.`);
        }}
        width={sidebarWidth}
        onResize={(newWidth) => setSidebarWidth(newWidth)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* Main Content Body */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar 
          currentRole={currentRole}
          onChangeRole={(role) => {
            setCurrentRole(role);
            showToast('info', 'Role Switched', `Active workspace persona updated to ${role}.`);
          }}
          darkMode={darkMode}
          onToggleTheme={() => {
            setDarkMode(!darkMode);
            showToast('info', 'Theme Toggled', darkMode ? 'Switched to editorial light ledger theme.' : 'Switched to dark theme.');
          }}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAI={() => setIsAIOpen(true)}
          activePageTitle={getPageTitle()}
        />

        <main className="statement-main">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(page) => setActivePage(page)}
      />

      {/* Grounded AI Copilot Slide-over */}
      <AICopilotDrawer 
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onNavigate={(page) => setActivePage(page)}
      />

      {/* Interactive Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={documentModalData.isOpen}
        onClose={() => setDocumentModalData({ isOpen: false, title: '', type: '' })}
        documentTitle={documentModalData.title}
        documentType={documentModalData.type}
      />

      {/* Evidence Inspector Drawer */}
      <EvidenceInspectorDrawer
        evidence={inspectedEvidence}
        onClose={() => setInspectedEvidence(null)}
      />

      {/* Live Toast Alerts */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
}

export default App;

