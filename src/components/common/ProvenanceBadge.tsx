import React from 'react';
import { Database, Clock, AlertTriangle, CheckCircle, XCircle, Wifi } from 'lucide-react';

export type DataStatus = 'LIVE' | 'PUBLIC_SNAPSHOT' | 'CACHED' | 'SYNTHETIC' | 'ILLUSTRATIVE' | 'STALE' | 'UNAVAILABLE';

interface ProvenanceBadgeProps {
  source: string;
  status: DataStatus;
  lastUpdated?: string;
  className?: string;
}

const statusConfig: Record<DataStatus, { color: string; icon: React.ReactNode; label: string }> = {
  LIVE: { color: 'bg-green-900/30 text-green-400 border-green-800', icon: <Wifi size={10} />, label: 'Live' },
  PUBLIC_SNAPSHOT: { color: 'bg-blue-900/30 text-blue-400 border-blue-800', icon: <Database size={10} />, label: 'Public Snapshot' },
  CACHED: { color: 'bg-sky-900/30 text-sky-400 border-sky-800', icon: <Database size={10} />, label: 'Cached' },
  SYNTHETIC: { color: 'bg-purple-900/30 text-purple-400 border-purple-800', icon: <Database size={10} />, label: 'Synthetic' },
  ILLUSTRATIVE: { color: 'bg-amber-900/30 text-amber-400 border-amber-800', icon: <AlertTriangle size={10} />, label: 'Illustrative' },
  STALE: { color: 'bg-orange-900/30 text-orange-400 border-orange-800', icon: <Clock size={10} />, label: 'Stale' },
  UNAVAILABLE: { color: 'bg-red-900/30 text-red-400 border-red-800', icon: <XCircle size={10} />, label: 'Unavailable' },
};

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  source,
  status,
  lastUpdated,
  className = ''
}) => {
  const config = statusConfig[status];
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-medium tracking-wide uppercase ${config.color} ${className}`}
         title={lastUpdated ? `Source: ${source} · Last updated: ${lastUpdated}` : `Source: ${source}`}
    >
      {config.icon}
      <span>{source}</span>
      <span className="opacity-60">·</span>
      <span>{config.label}</span>
    </div>
  );
};
