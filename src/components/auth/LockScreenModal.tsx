import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Key, ArrowRight, ShieldCheck } from 'lucide-react';

export const LockScreenModal: React.FC = () => {
  const { user, isLocked, unlockSession, logout } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isLocked || !user) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    unlockSession();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-card w-full max-w-md rounded-xl border border-line shadow-2xl p-8 text-center animate-scaleUp">
        <div className="w-16 h-16 bg-ink text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/10">
          <Lock size={28} className="text-teal" />
        </div>

        <h3 className="font-serif text-xl text-ink font-medium m-0 mb-1">Session Locked</h3>
        <p className="text-xs text-sub mb-6">
          Enterprise inactivity protection active for <strong>{user.name}</strong> ({user.role})
        </p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input
              autoFocus
              type="password"
              placeholder="Enter PIN or Password (press Enter)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center text-lg tracking-widest p-3 rounded-lg border border-line bg-paper text-ink focus:outline-none focus:border-ledger font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full btn primary py-2.5 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Unlock Workspace</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-line flex justify-between items-center text-xs text-sub">
          <button
            onClick={() => unlockSession()}
            className="text-ledger hover:underline cursor-pointer bg-none border-none p-0"
          >
            Quick 1-Click Biometric Bypass
          </button>
          <button
            onClick={logout}
            className="text-crimson hover:underline cursor-pointer bg-none border-none p-0"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};
