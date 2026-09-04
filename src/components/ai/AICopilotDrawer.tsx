import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  ShieldCheck, 
  Copy, 
  Check, 
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
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg h-screen bg-card border-l border-line shadow-2xl flex flex-col z-60 animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-line flex items-center justify-between bg-paper/60 backdrop-blur-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-ink text-cyan-300 flex items-center justify-center shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="font-bold text-sm text-ink font-serif">
                CyberOptix AI Copilot
              </div>
              <div className="text-[11px] text-sub">
                Grounded Financial Risk Reasoning • Model v1.0
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-sub hover:text-text rounded cursor-pointer transition-colors"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div 
                className={`p-3.5 rounded-lg text-xs leading-relaxed max-w-[92%] shadow-xs ${
                  m.sender === 'user' 
                    ? 'bg-ink text-white rounded-br-none' 
                    : 'bg-paper text-text border border-line rounded-bl-none'
                }`}
              >
                <p className="m-0 text-[13px]">{m.text}</p>

                {/* Key Findings list */}
                {m.keyFindings && m.keyFindings.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-line/60">
                    <div className="text-[11px] font-bold text-sub mb-1 uppercase tracking-wider">
                      Key Telemetry Findings
                    </div>
                    <ul className="pl-4 m-0 text-xs space-y-1 list-disc text-text">
                      {m.keyFindings.map((kf, idx) => (
                        <li key={idx}>{kf}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Verifiable Evidence Citations */}
                {m.evidenceCitations && m.evidenceCitations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-line/60">
                    <div className="text-[11px] font-bold text-sub mb-1 uppercase tracking-wider">
                      Evidence & Telemetry Hashes
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {m.evidenceCitations.map((ev) => (
                        <span 
                          key={ev.id}
                          className="text-[10.5px] px-2 py-0.5 bg-card border border-line rounded text-teal font-medium inline-flex items-center gap-1 font-mono"
                        >
                          <ShieldCheck size={11} />
                          {ev.source} [{ev.hashSnippet}]
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Follow-up Actions */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2 space-y-1.5">
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
                        className="w-full text-left text-xs px-2.5 py-1.5 rounded border border-ledger/30 hover:border-ledger bg-card hover:bg-ledger/5 text-ledger font-medium cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <span>{act.label}</span>
                        <ChevronRight size={13} className="shrink-0 text-ledger" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Message metadata footer */}
              {m.sender === 'assistant' && (
                <div className="flex items-center gap-2 mt-1 text-[11px] text-sub px-1">
                  <span>Confidence: {m.confidence || 'High'}</span>
                  <span>•</span>
                  <span>Human signoff required</span>
                  <button 
                    onClick={() => copyToClipboard(m.text, m.id)}
                    className="text-sub hover:text-ink cursor-pointer p-0.5 transition-colors"
                    title="Copy text"
                  >
                    {copiedId === m.id ? <Check size={11} className="text-teal" /> : <Copy size={11} />}
                  </button>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-sub text-xs p-2">
              <Sparkles size={14} className="animate-spin text-teal" />
              <span>Analyzing telemetry & evaluating risk distributions...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-line bg-card">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask about risk drivers, investments, or scenarios..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-3 py-2 rounded border border-line bg-paper text-text placeholder:text-sub text-xs outline-none focus:border-ink transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="bg-ink hover:bg-slate-900 disabled:opacity-50 text-white rounded px-3.5 py-2 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-xs"
              aria-label="Send query"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

