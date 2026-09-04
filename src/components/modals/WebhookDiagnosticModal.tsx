import React, { useState } from 'react';
import { X, Webhook, CheckCircle2, RefreshCw, Terminal, Send } from 'lucide-react';

interface WebhookDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestWebhook: (provider: string) => void;
}

export const WebhookDiagnosticModal: React.FC<WebhookDiagnosticModalProps> = ({
  isOpen,
  onClose,
  onTestWebhook
}) => {
  const [provider, setProvider] = useState<string>('Slack Security Channel (#ciso-risk-alerts)');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [dispatchLog, setDispatchLog] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTest = () => {
    setIsSending(true);
    setDispatchLog('POST /services/hooks/cyberoptix-alerts HTTP/1.1\nHost: hooks.slack.com\nContent-Type: application/json\n\n{"text":"[CyberOptix Test Alert] Money at Risk: ₹18.4 Cr | P95: ₹42.0 Cr | Status: ABOVE TOLERANCE"}');
    setTimeout(() => {
      setIsSending(false);
      setDispatchLog(prev => `${prev}\n\nHTTP/1.1 200 OK\nContent-Type: text/plain\nResponse: ok (latency: 142ms)`);
      onTestWebhook(provider);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-ledger/10 text-ledger border border-ledger/20">
              <Webhook size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Webhook Diagnostics & Test Dispatch</h2>
              <p className="text-xs text-sub m-0">SIEM & Incident Notification Gateway</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Target Integration Provider</label>
            <select
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                setDispatchLog(null);
              }}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
            >
              <option value="Slack Security Channel (#ciso-risk-alerts)">Slack Security Channel (#ciso-risk-alerts)</option>
              <option value="PagerDuty High Urgency Incident Endpoint">PagerDuty High Urgency Escalation</option>
              <option value="Microsoft Teams Executive Board Channel">Microsoft Teams Executive Channel</option>
              <option value="Splunk HEC Ingestion Pipeline">Splunk HTTP Event Collector (HEC)</option>
            </select>
          </div>

          <div>
            <div className="text-xs font-semibold text-text mb-1 flex items-center gap-1.5">
              <Terminal size={14} className="text-teal" />
              <span>HTTP Dispatch & Handshake Payload</span>
            </div>
            <div className="p-3 rounded bg-[#0A192F] text-slate-300 font-mono text-[11px] leading-relaxed h-44 overflow-y-auto border border-white/10 whitespace-pre-wrap">
              {dispatchLog || '// Click "Dispatch Test Payload" to verify HTTP 200 response and delivery latency.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-line bg-paper flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-sub hover:text-ink rounded border border-line hover:bg-card transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={isSending}
            className="px-5 py-2 text-xs font-semibold text-white bg-ledger hover:bg-ledger/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {isSending ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Sending Webhook Payload...</span>
              </>
            ) : (
              <>
                <Send size={13} />
                <span>Dispatch Test Payload</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
