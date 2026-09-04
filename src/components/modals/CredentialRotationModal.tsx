import React, { useState } from 'react';
import { X, KeyRound, ShieldAlert, CheckCircle2, Lock, RefreshCw } from 'lucide-react';

interface CredentialRotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetName: string;
  onConfirmRotation: (targetVault: string) => void;
}

export const CredentialRotationModal: React.FC<CredentialRotationModalProps> = ({
  isOpen,
  onClose,
  assetName,
  onConfirmRotation
}) => {
  const [vaultProvider, setVaultProvider] = useState<string>('HashiCorp Vault Enterprise (Cluster-APAC)');
  const [revokeSessions, setRevokeSessions] = useState<boolean>(true);
  const [enforceFido2, setEnforceFido2] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
      onConfirmRotation(vaultProvider);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-amber/10 text-amber border border-amber/20">
              <KeyRound size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Privileged Credential & Key Rotation</h2>
              <p className="text-xs text-sub m-0">Zero-Trust Secret Re-generation & Session Revocation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="p-3 rounded bg-paper border border-line">
            <div className="text-[11px] text-sub uppercase font-semibold">Target Entity</div>
            <div className="text-sm font-bold text-ink">{assetName}</div>
            <div className="text-xs text-sub mt-0.5">Database Root & API Service Account Credentials</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Secret Store / KMS Provider</label>
            <select
              value={vaultProvider}
              onChange={(e) => setVaultProvider(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
            >
              <option value="HashiCorp Vault Enterprise (Cluster-APAC)">HashiCorp Vault Enterprise (Cluster-APAC)</option>
              <option value="AWS Secrets Manager (ap-south-1)">AWS Secrets Manager (ap-south-1)</option>
              <option value="CyberArk Privileged Access Manager">CyberArk Privileged Access Manager</option>
              <option value="Azure Key Vault (Premium HSM)">Azure Key Vault (Premium HSM)</option>
            </select>
          </div>

          <div className="space-y-2 p-3 rounded bg-paper border border-line">
            <label className="flex items-center gap-2 text-xs text-text cursor-pointer">
              <input 
                type="checkbox"
                checked={revokeSessions}
                onChange={(e) => setRevokeSessions(e.target.checked)}
                className="rounded border-line text-ink focus:ring-0"
              />
              <span className="font-medium">Force immediate invalidation of all active SSH/API sessions</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-text cursor-pointer">
              <input 
                type="checkbox"
                checked={enforceFido2}
                onChange={(e) => setEnforceFido2(e.target.checked)}
                className="rounded border-line text-ink focus:ring-0"
              />
              <span className="font-medium">Enforce FIDO2 hardware token challenge on next credential checkout</span>
            </label>
          </div>

          <div className="p-3 rounded bg-amber/5 border border-amber/20 text-xs text-sub">
            ⚠️ Automated blast radius analysis confirms 0 dependent microservices will experience downtime during rotation.
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-line flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-sub hover:text-ink rounded border border-line hover:bg-paper transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRotating}
              className="px-5 py-2 text-xs font-semibold text-white bg-amber hover:bg-amber/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isRotating ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Rotating Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound size={13} />
                  <span>Rotate Credentials Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
