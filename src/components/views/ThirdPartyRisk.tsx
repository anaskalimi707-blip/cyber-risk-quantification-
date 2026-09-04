import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { Plus, Download, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { VendorOnboardingModal } from '../modals/VendorOnboardingModal';
import { VendorAssessmentModal } from '../modals/VendorAssessmentModal';
import { ProcurementEscalationModal } from '../modals/ProcurementEscalationModal';

interface ThirdPartyRiskProps {
  onNavigate: (page: NavigationPage) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, description: string) => void;
}

export const ThirdPartyRisk: React.FC<ThirdPartyRiskProps> = ({ onNavigate, onShowToast }) => {
  const [vendors, setVendors] = useState([
    { id: 'v-1', name: 'CloudPay Processing Ltd.', crit: 'Critical', inherent: 'High', score: '62 / 100', evidenceStatus: 'Stale · 214 days', badgeClass: 'crit', contrib: '₹64 lakh', actionText: 'Request assessment' },
    { id: 'v-2', name: 'SecureID Auth Services', crit: 'High', inherent: 'Medium', score: '78 / 100', evidenceStatus: 'Fresh · 14 days', badgeClass: 'good', contrib: '₹21 lakh', actionText: 'Review evidence' },
    { id: 'v-3', name: 'DataVault Storage Inc.', crit: 'Medium', inherent: 'Medium', score: '81 / 100', evidenceStatus: 'Fresh · 40 days', badgeClass: 'good', contrib: '₹12 lakh', actionText: 'Send questionnaire' },
  ]);

  // Modal states
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState<boolean>(false);
  const [assessmentModalVendor, setAssessmentModalVendor] = useState<any | null>(null);
  const [escalationModalVendor, setEscalationModalVendor] = useState<any | null>(null);

  const handleAction = (vendor: any) => {
    if (vendor.actionText === 'Request assessment' || vendor.actionText === 'Send questionnaire') {
      setAssessmentModalVendor(vendor);
    } else if (vendor.actionText === 'Review evidence') {
      onNavigate('compliance');
    }
  };

  const handleAddVendor = () => {
    setIsOnboardingModalOpen(true);
  };

  const handleExport = () => {
    const headers = "Vendor,Criticality,Inherent Risk,External Score,Evidence Status,Risk Contribution\n";
    const rows = vendors.map(v => `"${v.name}","${v.crit}","${v.inherent}","${v.score}","${v.evidenceStatus}","${v.contrib}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cyberoptix_third_party_vendor_risk.csv';
    link.click();
    onShowToast?.('success', 'Vendor Matrix Exported', 'Downloaded cyberoptix_third_party_vendor_risk.csv');
  };

  return (
    <div className="animate-fade-in">
      <div className="masthead">
        <div>
          <div className="org">Third-Party Risk</div>
          <h1>Third-Party Vendors &amp; Concentration Risk</h1>
          <div className="period">Supply chain blast radius and evidence freshness tracking</div>
        </div>
        <div className="masthead-actions flex items-center gap-2">
          <button className="btn" onClick={handleExport}>
            <Download size={13} />
            <span>Export CSV</span>
          </button>
          <button className="btn primary" onClick={handleAddVendor}>
            <Plus size={13} />
            <span>Add Vendor</span>
          </button>
        </div>
      </div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Criticality</th>
            <th>Inherent risk</th>
            <th>External score</th>
            <th>Evidence</th>
            <th>Risk contribution</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((v) => (
            <tr key={v.id}>
              <td><strong>{v.name}</strong></td>
              <td><span className={`badge ${v.crit === 'Critical' ? 'crit' : v.crit === 'High' ? 'warn' : 'neutral'}`}>{v.crit}</span></td>
              <td>{v.inherent}</td>
              <td>{v.score}</td>
              <td><span className={`badge ${v.badgeClass}`}>{v.evidenceStatus}</span></td>
              <td className="num font-bold text-crimson">{v.contrib}</td>
              <td style={{ textAlign: 'right' }}>
                <button 
                  className="link-btn font-medium"
                  onClick={() => handleAction(v)}
                >
                  {v.actionText} →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="callout crimson flex items-center justify-between" style={{ marginTop: '22px' }}>
        <div>
          <b>CloudPay Processing Ltd.</b> — assessment overdue. This vendor is a critical supplier to Payment Processing; contract requires annual reassessment.
        </div>
        <button 
          className="btn sm crimson shrink-0 ml-4"
          onClick={() => setEscalationModalVendor(vendors[0])}
        >
          Escalate to Procurement
        </button>
      </div>

      {/* Vendor Onboarding Modal */}
      <VendorOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onAddVendor={(newV) => {
          const added = {
            id: `v-${Date.now()}`,
            name: newV.name,
            crit: newV.tier.split(' ')[0],
            inherent: 'Medium',
            score: 'Pending Audit',
            evidenceStatus: 'Pending initial assessment',
            badgeClass: 'warn',
            contrib: '₹35 lakh',
            actionText: 'Request assessment'
          };
          setVendors(prev => [added, ...prev]);
          onShowToast?.('success', 'Vendor Onboarded', `Registered "${newV.name}". Initial assessment workflow initiated.`);
        }}
      />

      {/* Vendor Assessment Dispatcher Modal */}
      <VendorAssessmentModal
        isOpen={!!assessmentModalVendor}
        onClose={() => setAssessmentModalVendor(null)}
        vendorName={assessmentModalVendor?.name || ''}
        onSendAssessment={(standard, deadline, recipient) => {
          onShowToast?.('success', 'Assessment Dispatched', `Sent ${standard} magic link to ${recipient} (Due: ${deadline}).`);
        }}
      />

      {/* Procurement Escalation Modal */}
      <ProcurementEscalationModal
        isOpen={!!escalationModalVendor}
        onClose={() => setEscalationModalVendor(null)}
        vendorName={escalationModalVendor?.name || ''}
        onConfirmEscalation={(level, notice) => {
          onShowToast?.('warning', 'Procurement Hold Issued', `Issued "${level}" for ${escalationModalVendor?.name}. Attached FAIR loss estimate.`);
        }}
      />
    </div>
  );
};

