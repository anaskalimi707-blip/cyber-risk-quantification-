import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AIChatMessage, NavigationPage } from '../../types';
import { apiService } from '../../services/api';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: NavigationPage) => void;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      timestamp: 'Just now',
      text: "Hello! I am your CyberOptix AI Reasoning Copilot. I analyze your security telemetry to quantify cyber risk in monetary terms and guide optimal investment choices.",
      keyFindings: [
        "Current total exposure is ₹18.4 Crore (Above Board Tolerance limit of ₹10.0 Crore).",
        "Top risk scenario: Ransomware on Payment Gateway (₹4.2 Cr Expected Yearly Loss)."
      ],
      suggestedActions: [
        { label: 'Why is Payment Gateway risk high?', actionId: 'why-ransomware' },
        { label: 'Which investments reduce most risk under ₹75 Lakh?', actionId: 'optimize-75l' }
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text: query
    };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    const response = await apiService.askAICopilot(query);

    const botMsg: AIChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      timestamp: 'Just now',
      text: response.answer,
      keyFindings: response.keyFindings,
      evidenceCitations: response.evidenceCitations,
      assumptions: response.assumptions,
      confidence: response.confidence,
      suggestedActions: response.suggestedActions,
      requiresApproval: true
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg-overlay)',
        backdropFilter: 'blur(2px)',
        zIndex: 90,
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
          borderLeft: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-slide-in"
      >
        {/* Drawer Header */}
        <div 
          style={{
            padding: '1.1rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-navy)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8'
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                CyberOptix AI Copilot
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Grounded Financial Risk Reasoning • Model v1.0
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat History */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((m) => (
            <div 
              key={m.id} 
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '92%'
              }}
            >
              <div 
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: m.sender === 'user' ? 'var(--color-blue)' : 'var(--bg-subtle)',
                  color: m.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  border: m.sender === 'user' ? 'none' : '1px solid var(--border-color)'
                }}
              >
                <p style={{ margin: 0 }}>{m.text}</p>

                {/* Key Findings list */}
                {m.keyFindings && m.keyFindings.length > 0 && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                      Key Telemetry Findings
                    </div>
                    <ul style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {m.keyFindings.map((kf, idx) => (
                        <li key={idx}>{kf}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Verifiable Evidence Citations */}
                {m.evidenceCitations && m.evidenceCitations.length > 0 && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                      Evidence & Telemetry Hashes
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {m.evidenceCitations.map((ev) => (
                        <span 
                          key={ev.id}
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 7px',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            color: 'var(--color-teal)',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <ShieldCheck size={12} />
                          {ev.source} [{ev.hashSnippet}]
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Follow-up Actions */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {m.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (act.actionId === 'portfolio-approve') {
                            onNavigate('optimizer');
                            onClose();
                          } else {
                            handleSendMessage(act.label);
                          }
                        }}
                        style={{
                          textAlign: 'left',
                          fontSize: '0.78rem',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--color-blue)',
                          color: 'var(--color-blue)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontWeight: 600
                        }}
                      >
                        <span>{act.label}</span>
                        <ChevronRight size={14} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Message metadata footer */}
              {m.sender === 'assistant' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>Confidence: {m.confidence || 'High'}</span>
                  <span>•</span>
                  <span>Human signoff required</span>
                  <button 
                    onClick={() => copyToClipboard(m.text, m.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                  >
                    {copiedId === m.id ? <Check size={12} color="var(--color-success)" /> : <Copy size={12} />}
                  </button>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem', padding: '0.5rem' }}>
              <Sparkles size={16} className="animate-spin" color="var(--color-teal)" />
              <span>Analyzing telemetry & evaluating risk distributions...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{ display: 'flex', gap: '0.5rem' }}
          >
            <input
              type="text"
              placeholder="Ask about risk drivers, investments, or scenarios..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.86rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              style={{
                backgroundColor: 'var(--color-blue)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
