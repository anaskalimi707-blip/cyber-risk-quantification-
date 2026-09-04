import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldCheck, Lock, ArrowRight, UserCheck, Sparkles, Building2 } from 'lucide-react';

interface LoginViewProps {
  onShowToast: (type: 'success' | 'warning' | 'info', title: string, desc: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onShowToast }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('priyanka.sharma@acme-financial.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CISO');

  const rolePresets: { role: UserRole; name: string; title: string; desc: string; badgeColor: string }[] = [
    {
      role: 'CISO',
      name: 'Priyanka Sharma',
      title: 'Chief Information Security Officer',
      desc: 'Full executive oversight, capital allocation & risk posture',
      badgeColor: 'teal'
    },
    {
      role: 'CFO',
      name: 'Ananya Fernandes',
      title: 'Chief Financial Officer & CRO',
      desc: 'Loss Value-at-Risk (VaR), ROSI analysis & sign-offs',
      badgeColor: 'amber'
    },
    {
      role: 'SecurityArchitect',
      name: 'Vikram Mehta',
      title: 'Principal Security Architect',
      desc: 'Attack path progression, controls matrix & asset graphs',
      badgeColor: 'neutral'
    },
    {
      role: 'Auditor',
      name: 'Rohit Iyer',
      title: 'Lead GRC & Regulatory Auditor',
      desc: 'SEBI CSCRF, ISO 27001, audit log & evidence hashes',
      badgeColor: 'good'
    },
    {
      role: 'Org Admin',
      name: 'System Administrator',
      title: 'Platform Administrator',
      desc: 'All 14 workspaces, connectors & organizational configuration',
      badgeColor: 'crit'
    }
  ];

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
    onShowToast('success', 'Authenticated Successfully', `Welcome to CyberOptix Enterprise, ${email}.`);
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    login('', role);
    onShowToast('success', 'Role Session Activated', `Signed in as ${role}. Role-tailored workspace loaded.`);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center items-center p-6 select-none animate-fade-in">
      <div className="w-full max-w-4xl bg-card border border-line rounded-xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Column: Brand & Value Proposition */}
        <div className="md:col-span-5 bg-ink p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 font-serif text-2xl tracking-wide mb-6">
              <img src="/cyberoptix-logo.png" alt="CyberOptix" className="w-9 h-9 rounded-lg object-cover ring-1 ring-white/20 shadow-md" />
              <span>Cyber<span className="text-[#7FB3DF]">Optix</span></span>
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Enterprise Cyber Risk Quantification
            </div>
            <h2 className="font-serif text-2xl font-normal leading-tight text-white mb-4">
              Turn cyber telemetry into financial certainty.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Continuous FAIR quantification, mixed-integer investment optimization, and cryptographically verifiable compliance evidence for executive boards.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-teal" />
              <span>Real-Time Poisson & Monte Carlo Simulation</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#7FB3DF]" />
              <span>MILP Continuous Pareto Frontier Optimization</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber" />
              <span>Immutable Cryptographic SHA-256 Audit Trail</span>
            </div>
          </div>

          {/* Background Glow */}
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-teal/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Right Column: Sign In Form & Fast Role Selector */}
        <div className="md:col-span-7 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-xs font-semibold text-sub uppercase tracking-wider">Enterprise Sign In</span>
                <h3 className="font-serif text-xl text-ink font-medium m-0">Access Your Workspace</h3>
              </div>
              <span className="badge good text-xs">SOC 2 Type II Verified</span>
            </div>

            {/* Fast 1-Click Role Switcher */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-sub uppercase tracking-wider mb-2">
                1-Click Quick Role Demo
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rolePresets.map((p) => (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleQuickRoleLogin(p.role)}
                    className="p-2.5 border border-line rounded-lg text-left hover:border-ledger hover:bg-paper cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-ink group-hover:text-ledger">{p.role}</span>
                      <span className={`badge ${p.badgeColor} text-[10px]`}>{p.role}</span>
                    </div>
                    <div className="text-[11px] text-sub truncate">{p.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-line" /></div>
              <div className="relative flex justify-center text-xs text-sub"><span className="bg-card px-2">or sign in with credentials</span></div>
            </div>

            {/* Standard Email & Password Form */}
            <form onSubmit={handleStandardSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-sub uppercase tracking-wider mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm p-2.5 rounded border border-line bg-paper text-text focus:outline-none focus:border-ledger"
                  placeholder="name@organization.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-sub uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-xs text-ledger cursor-pointer hover:underline">Forgot password?</span>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm p-2.5 rounded border border-line bg-paper text-text focus:outline-none focus:border-ledger font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full btn primary py-2.5 text-sm flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>Enter Enterprise Portal</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-line text-[11px] text-sub flex justify-between items-center mt-6">
            <span>Acme Financial Services · SSO Okta / SAML 2.0</span>
            <span className="flex items-center gap-1"><Lock size={12} /> Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};
