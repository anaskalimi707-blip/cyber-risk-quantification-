import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 200,
        pointerEvents: 'none'
      }}
    >
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isWarning = t.type === 'warning';
        return (
          <div
            key={t.id}
            style={{
              pointerEvents: 'auto',
              minWidth: '320px',
              maxWidth: '420px',
              padding: '0.85rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              backdropFilter: 'blur(20px)',
              border: isSuccess ? '1px solid var(--color-success)' : (isWarning ? '1px solid var(--color-warning)' : '1px solid var(--color-blue)'),
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}
            className="animate-slide-in"
          >
            {isSuccess && <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />}
            {isWarning && <AlertCircle size={18} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />}
            {!isSuccess && !isWarning && <Info size={18} color="var(--color-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />}

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                {t.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {t.description}
              </div>
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
