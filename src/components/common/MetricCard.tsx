import React, { useState } from 'react';
import { HelpCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { TopMetric } from '../../types';

export const MetricCard: React.FC<TopMetric> = ({
  title,
  value,
  subtext,
  status,
  trend,
  trendPositive,
  tooltip
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStatusBadge = () => {
    switch (status) {
      case 'critical':
        return 'bg-red-50 text-crimson border-red-200';
      case 'warning':
        return 'bg-amber-50 text-amber border-amber-200';
      case 'success':
        return 'bg-teal/10 text-teal border-teal/20';
      default:
        return 'bg-slate-50 text-sub border-line';
    }
  };

  return (
    <div className="p-4 rounded-lg bg-card border border-line shadow-xs hover:shadow-sm transition-all flex flex-col justify-between relative min-h-[125px]">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-sub tracking-wide">
          {title}
        </span>
        <div 
          className="relative cursor-help"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <HelpCircle size={14} className="text-sub hover:text-ink transition-colors" />
          {showTooltip && tooltip && (
            <div className="absolute right-0 top-5 w-60 p-2.5 text-xs rounded-md shadow-xl bg-slate-900 text-slate-100 leading-relaxed z-50 animate-fadeIn border border-slate-800">
              {tooltip}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="font-serif text-2xl font-semibold text-ink">{value}</div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${getStatusBadge()}`}>
          {subtext}
        </span>
      </div>

      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${
          trendPositive ? 'text-teal' : 'text-crimson'
        }`}>
          {trendPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

