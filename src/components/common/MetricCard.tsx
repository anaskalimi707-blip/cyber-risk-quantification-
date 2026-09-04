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
        return 'badge-critical';
      case 'warning':
        return 'badge-warning';
      case 'success':
        return 'badge-success';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <div 
      className="card-base"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        minHeight: '135px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        <div 
          style={{ position: 'relative', cursor: 'help' }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <HelpCircle size={15} style={{ color: 'var(--text-muted)' }} />
          {showTooltip && (
            <div 
              style={{
                position: 'absolute',
                right: 0,
                top: '22px',
                width: '230px',
                padding: '0.6rem 0.75rem',
                fontSize: '0.74rem',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-lg)',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                lineHeight: 1.4,
                zIndex: 100
              }}
            >
              {tooltip}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div className="metric-value">{value}</div>
        <span className={`badge ${getStatusBadge()}`}>
          {subtext}
        </span>
      </div>

      {trend && (
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginTop: '0.75rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: trendPositive ? 'var(--color-success)' : 'var(--color-critical)'
          }}
        >
          {trendPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};
