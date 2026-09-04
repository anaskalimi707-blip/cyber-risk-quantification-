import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginView } from './components/auth/LoginView';
import { LockScreenModal } from './components/auth/LockScreenModal';

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
import { ConnectorsView } from './components/views/ConnectorsView';
import { AuditLogView } from './components/views/AuditLogView';
import { IncidentsResilience } from './components/views/IncidentsResilience';
import { ThirdPartyRisk } from './components/views/ThirdPartyRisk';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

import { NavigationPage, UserRole } from './types';

function EnterpriseWorkspace() {
  const { user, role, isAuthenticated, switchRole } = useAuth();
  const [activePage, setActivePage] = useState<NavigationPage>('overview');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scen-ransomware-payment');
  
  // Persistent Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('cyberoptix_dark_mode');
    return saved ? saved === 'true' : false;
  });

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

  // Sync theme to DOM & localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('cyberoptix_dark_mode', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('cyberoptix_dark_mode', 'false');
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
      case 'connectors': return 'Connectors';
      case 'audit-log': return 'Audit Log';
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
            onShowToast={showToast}
          />
        );
      case 'scenarios':
        return (
          <RiskScenarioDetails 
            scenarioId={selectedScenarioId}
            onNavigate={(page) => setActivePage(page)}
            onBack={() => setActivePage('command-center')}
            onInspectEvidence={(ev) => setInspectedEvidence(ev)}
            onShowToast={showToast}
          />
        );
      case 'assets':
        return <AssetsExposure onNavigate={(page) => setActivePage(page)} onShowToast={showToast} />;
      case 'controls':
        return <ControlsMatrix onNavigate={(page) => setActivePage(page)} onShowToast={showToast} />;
      case 'optimizer':
        return (
          <InvestmentOptimizer 
            onNavigate={(page) => setActivePage(page)} 
            onShowToast={showToast}
            onOpenDocument={openDocument}
          />
        );
      case 'what-if':
        return <WhatIfSimulator onNavigate={(page) => setActivePage(page)} onShowToast={showToast} />;
      case 'compliance':
        return (
          <ComplianceEvidence 
            onNavigate={(page) => setActivePage(page)} 
            onShowToast={showToast}
            onOpenDocument={openDocument}
          />
        );
      case 'connectors':
        return <ConnectorsView onNavigate={(page) => setActivePage(page)} onShowToast={showToast} />;
      case 'audit-log':
        return <AuditLogView onNavigate={(page) => setActivePage(page)} onShowToast={showToast} />;
      case 'incidents':
        return <IncidentsResilience onNavigate={(page) => setActivePage(page)} onShowToast={showToast} />;
      case 'vendors':
        return <ThirdPartyRisk onNavigate={(page) => setActivePage(page)} onShowToast={showToast} />;
      case 'reports':
        return (
          <ReportsView 
            onNavigate={(page) => setActivePage(page)} 
            onOpenDocument={openDocument}
            onShowToast={showToast}
          />
        );
      case 'settings':
        return <SettingsView onShowToast={showToast} />;
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

  if (!isAuthenticated) {
    return <LoginView onShowToast={showToast} />;
  }

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
        currentRole={role}
        onChangeRole={(newRole) => {
          switchRole(newRole);
          showToast('info', 'Role Switched', `Active workspace persona updated to ${newRole}.`);
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
          currentRole={role}
          onChangeRole={(newRole) => {
            switchRole(newRole);
            showToast('info', 'Role Switched', `Active workspace persona updated to ${newRole}.`);
          }}
          darkMode={darkMode}
          onToggleTheme={() => {
            const nextMode = !darkMode;
            setDarkMode(nextMode);
            showToast('info', 'Theme Toggled', nextMode ? 'Switched to dark theme.' : 'Switched to editorial light ledger theme.');
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

      {/* Lock Screen Re-Authentication Modal */}
      <LockScreenModal />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <EnterpriseWorkspace />
    </AuthProvider>
  );
}

export default App;


