import React from 'react';
import { ToleranceStatus, RiskLevel } from '../../types';

interface RiskBadgeProps {
  status?: ToleranceStatus | string;
  level?: RiskLevel | string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ status, level }) => {
  if (status) {
    if (status === 'Above Tolerance') {
      return <span className="badge badge-critical">● Above Tolerance</span>;
    }
    if (status === 'Approaching Limit') {
      return <span className="badge badge-warning">▲ Approaching Limit</span>;
    }
    return <span className="badge badge-success">✓ Within Tolerance</span>;
  }

  if (level) {
    if (level === 'Critical') {
      return <span className="badge badge-critical">Critical Risk</span>;
    }
    if (level === 'High') {
      return <span className="badge badge-warning">High Risk</span>;
    }
    if (level === 'Medium') {
      return <span className="badge badge-neutral">Medium Risk</span>;
    }
    return <span className="badge badge-success">Low Risk</span>;
  }

  return null;
};
