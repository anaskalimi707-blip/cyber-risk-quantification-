import React, { useState, useEffect, Suspense, lazy } from 'react';
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

// Code-split / Lazy-loaded Views
const ExecutiveOverview = lazy(() => import('./components/views/ExecutiveOverview').then(m => ({ default: m.ExecutiveOverview })));
const CrimXView = lazy(() => import('./components/views/CrimXView').then(m => ({ default: m.CrimXView })));
const RiskCommandCenter = lazy(() => import('./components/views/RiskCommandCenter').then(m => ({ default: m.RiskCommandCenter })));
const RiskScenarioDetails = lazy(() => import('./components/views/RiskScenarioDetails').then(m => ({ default: m.RiskScenarioDetails })));
const AssetsExposure = lazy(() => import('./components/views/AssetsExposure').then(m => ({ default: m.AssetsExposure })));
const ControlsMatrix = lazy(() => import('./components/views/ControlsMatrix').then(m => ({ default: m.ControlsMatrix })));
const InvestmentOptimizer = lazy(() => import('./components/views/InvestmentOptimizer').then(m => ({ default: m.InvestmentOptimizer })));
const WhatIfSimulator = lazy(() => import('./components/views/WhatIfSimulator').then(m => ({ default: m.WhatIfSimulator })));
const ComplianceEvidence = lazy(() => import('./components/views/ComplianceEvidence').then(m => ({ default: m.ComplianceEvidence })));
const ConnectorsView = lazy(() => import('./components/views/ConnectorsView').then(m => ({ default: m.ConnectorsView })));
const AuditLogView = lazy(() => import('./components/views/AuditLogView').then(m => ({ default: m.AuditLogView })));
const IncidentsResilience = lazy(() => import('./components/views/IncidentsResilience').then(m => ({ default: m.IncidentsResilience })));
const ThirdPartyRisk = lazy(() => import('./components/views/ThirdPartyRisk').then(m => ({ default: m.ThirdPartyRisk })));
const ReportsView = lazy(() => import('./components/views/ReportsView').then(m => ({ default: m.ReportsView })));
const SettingsView = lazy(() => import('./components/views/SettingsView').then(m => ({ default: m.SettingsView })));

import { NavigationPage, UserRole } from './types';

// Financial ledger loading skeleton
const ViewLoadingSkeleton = () => (
  <div className="p-8 space-y-6 animate-pulse select-none">
    <div className="h-8 bg-line/60 rounded w-1/3 mb-2" />
    <div className="h-4 bg-line/40 rounded w-1/2 mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="h-24 bg-card rounded-lg border border-line" />
      <div className="h-24 bg-card rounded-lg border border-line" />
      <div className="h-24 bg-card rounded-lg border border-line" />
      <div className="h-24 bg-card rounded-lg border border-line" />
    </div>
    <div className="h-72 bg-card rounded-lg border border-line" />
  </div>
);


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
      case 'crim-x': return 'CRIM-X Apex Engine';
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
      case 'crim-x':
        return (
          <CrimXView
            onNavigate={(page) => setActivePage(page)}
            onShowToast={showToast}
            onOpenDocument={openDocument}
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
          <Suspense fallback={<ViewLoadingSkeleton />}>
            {renderActiveView()}
          </Suspense>
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


