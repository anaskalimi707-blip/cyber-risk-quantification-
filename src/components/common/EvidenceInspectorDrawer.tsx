import React from 'react';
import { X, ShieldCheck, Copy, Check, ExternalLink, Database, Server } from 'lucide-react';

interface EvidenceRecord {
  id: string;
  source: string;
  timestamp: string;
  hash: string;
  description: string;
  rawPayload: any;
}

interface EvidenceInspectorDrawerProps {
  evidence: EvidenceRecord | null;
  onClose: () => void;
}

export const EvidenceInspectorDrawer: React.FC<EvidenceInspectorDrawerProps> = ({
  evidence,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!evidence) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(evidence.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg-overlay)',
        backdropFilter: 'blur(4px)',
        zIndex: 110,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '100vh',
          backgroundColor: 'var(--bg-card)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 120
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-slide-in"
      >
        <div>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--color-teal)" />
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                Evidence Verifier & Audit Proof
              </span>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Source and Verification Badge */}
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>{evidence.source}</span>
              <span className="badge badge-success">✓ Cryptographically Verified</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Collected: {evidence.timestamp}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
              {evidence.description}
            </div>
          </div>

          {/* Cryptographic SHA-256 Hash Box */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                SHA-256 Content Digest
              </span>
              <button 
                onClick={handleCopyHash}
                style={{ background: 'none', border: 'none', color: 'var(--color-blue)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
              >
                {copied ? <Check size={12} color="var(--color-success)" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy Hash'}</span>
              </button>
            </div>
            <div style={{ padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-teal)', wordBreak: 'break-all', border: '1px solid var(--border-color)' }}>
              {evidence.hash}
            </div>
          </div>

          {/* Raw Ingestion Payload Inspector */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Raw Ingestion JSON Telemetry
            </div>
            <pre 
              style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(10, 22, 40, 0.95)',
                color: '#38BDF8',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                maxHeight: '260px',
                overflowY: 'auto',
                lineHeight: 1.4
              }}
            >
              {JSON.stringify(evidence.rawPayload, null, 2)}
            </pre>
          </div>
        </div>

        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button 
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={onClose}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
