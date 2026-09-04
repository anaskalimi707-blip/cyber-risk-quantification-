import React, { useRef } from 'react';
import { X, Printer, Download, CheckCircle2, Shield, Lock, FileText, QrCode } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  documentType?: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentTitle = "Q3 2026 Board Cyber Risk Quantification & Investment Dossier",
  documentType = "Executive Board Briefing"
}) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg-overlay)',
        backdropFilter: 'blur(8px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '92vh',
          backgroundColor: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
      >
        {/* Modal Toolbar Header */}
        <div 
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={18} color="var(--color-blue)" />
            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              Document Preview: {documentType}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button 
              className="btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
              onClick={() => window.print()}
            >
              <Printer size={14} />
              <span>Print Document</span>
            </button>
            <button 
              className="btn-primary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
              onClick={() => {
                alert(`Downloaded ${documentTitle} (PDF with Cryptographic Seal).`);
                onClose();
              }}
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>
            <button 
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Document Body (Printable Paper Canvas) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
          <div 
            className="document-paper"
            style={{
              maxWidth: '740px',
              margin: '0 auto',
              padding: '3rem 3.5rem',
              fontFamily: 'var(--font-sans)',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              borderRadius: '4px'
            }}
          >
            {/* Header with Organization and Classification */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0C233F', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#1466AA', textTransform: 'uppercase' }}>
                  CyberOptix Enterprise Risk Intelligence
                </div>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0C233F', marginTop: '4px' }}>
                  Acme Financial Services Limited
                </h1>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Board Risk Committee • Executive Financial Cyber Risk Briefing
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', backgroundColor: '#FEE2E2', color: '#B91C1C', borderRadius: '4px', border: '1px solid #FCA5A5' }}>
                  CONFIDENTIAL • BOARD ONLY
                </span>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '6px' }}>
                  Date: 03 September 2026
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                  Ledger Ref: #COX-2026-Q3-0994
                </div>
              </div>
            </div>

            {/* Executive Summary Block */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0C233F', marginBottom: '0.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.3rem' }}>
                1. Executive Summary & Financial Exposure
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
                As of Q3 2026, Acme Financial Services' total aggregate Value-at-Risk (VaR 95%) is estimated at <strong>₹18.40 Crore</strong>, which currently exceeds the Board Risk Tolerance Limit of <strong>₹10.00 Crore</strong>. The Expected Annual Loss (EAL) is <strong>₹8.60 Crore</strong>, driven primarily by payment settlement disruption vectors and administrative credential exposure.
              </p>
            </div>

            {/* Financial Risk Summary Table */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0C233F', marginBottom: '0.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.3rem' }}>
                2. Quantified Exposure by Core Business Service
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left', marginTop: '0.5rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #CBD5E1', color: '#475569' }}>
                    <th style={{ padding: '0.5rem' }}>Business Service</th>
                    <th style={{ padding: '0.5rem' }}>Expected Yearly Loss</th>
                    <th style={{ padding: '0.5rem' }}>95th-Percentile Loss</th>
                    <th style={{ padding: '0.5rem' }}>Tolerance Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>Payment Processing (UPI & NetBanking)</td>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 700, color: '#B91C1C' }}>₹4.20 Crore</td>
                    <td style={{ padding: '0.6rem 0.5rem' }}>₹13.80 Crore</td>
                    <td style={{ padding: '0.6rem 0.5rem', color: '#B91C1C', fontWeight: 600 }}>Above Tolerance</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>Customer KYC & Account Vault</td>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 700, color: '#B91C1C' }}>₹3.60 Crore</td>
                    <td style={{ padding: '0.6rem 0.5rem' }}>₹9.40 Crore</td>
                    <td style={{ padding: '0.6rem 0.5rem', color: '#B91C1C', fontWeight: 600 }}>Above Tolerance</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>Algorithmic Trading & Settlement</td>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 700, color: '#B91C1C' }}>₹2.80 Crore</td>
                    <td style={{ padding: '0.6rem 0.5rem' }}>₹7.20 Crore</td>
                    <td style={{ padding: '0.6rem 0.5rem', color: '#B91C1C', fontWeight: 600 }}>Above Tolerance</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recommended Investment Package */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0C233F', marginBottom: '0.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.3rem' }}>
                3. Recommended Security Capital Allocation (₹70 Lakh Portfolio)
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                The Mixed-Integer Linear Programming (MIP) optimization solver prescribes a targeted ₹70.0 Lakh capital commitment across three controls to bring overall enterprise exposure below board tolerance:
              </p>

              <div style={{ padding: '0.85rem', backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '4px', fontSize: '0.82rem', color: '#166534' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>Approved Mitigation Bundle:</div>
                <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                  <li><strong>FIDO2 Hardware Keys (₹25L):</strong> Eliminates SMS credential bypass (Risk Reduced: ₹1.40 Cr)</li>
                  <li><strong>Air-Gapped Immutable Backups (₹35L):</strong> Guarantees 2-hour RTO (Risk Reduced: ₹1.10 Cr)</li>
                  <li><strong>Automated Recovery Drills (₹10L):</strong> Validates quarterly restore (Risk Reduced: ₹60 Lakh)</li>
                </ul>
                <div style={{ marginTop: '6px', fontWeight: 800 }}>
                  Total Risk Reduced: ₹2.10 Crore • Illustrative ROI: 200% (3.0x Capital Multiplier)
                </div>
              </div>
            </div>

            {/* Cryptographic Verification Seal & Signatures */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #0C233F', paddingTop: '1.25rem', marginTop: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#009687', fontWeight: 700, fontSize: '0.8rem' }}>
                  <CheckCircle2 size={16} />
                  <span>SHA-256 Cryptographic Tamper-Evident Seal Verified</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#64748B', marginTop: '2px' }}>
                  HASH: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0C233F' }}>
                  Authorized Signoff:
                </div>
                <div style={{ fontSize: '0.78rem', fontStyle: 'italic', color: '#475569', marginTop: '2px' }}>
                  CISO & CFO Risk Committee
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
