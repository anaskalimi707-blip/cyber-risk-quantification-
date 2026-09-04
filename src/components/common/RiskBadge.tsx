import React from 'react';
import { ToleranceStatus, RiskLevel } from '../../types';

interface RiskBadgeProps {
  status?: ToleranceStatus | string;
  level?: RiskLevel | string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ status, level }) => {
  if (status) {
    if (status === 'Above Tolerance') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-red-50 text-crimson border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
          Above Tolerance
        </span>
      );
    }
    if (status === 'Approaching Limit') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber border border-amber-200">
          <span>▲</span>
          Approaching Limit
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-teal/10 text-teal border border-teal/20">
        <span>✓</span>
        Within Tolerance
      </span>
    );
  }

  if (level) {
    if (level === 'Critical') {
      return (
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-red-50 text-crimson border border-red-200">
          Critical Risk
        </span>
      );
    }
    if (level === 'High') {
      return (
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber border border-amber-200">
          High Risk
        </span>
      );
    }
    if (level === 'Medium') {
      return (
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-ledger/10 text-ledger border border-ledger/20">
          Medium Risk
        </span>
      );
    }
    return (
      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-teal/10 text-teal border border-teal/20">
        Low Risk
      </span>
    );
  }

  return null;
};

