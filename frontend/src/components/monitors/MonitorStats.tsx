'use client';

import { Activity, CheckCircle2, AlertOctagon, Clock } from 'lucide-react';
import { Monitor } from '@/types';

interface MonitorStatsProps {
  monitors: Monitor[];
}

export function MonitorStats({ monitors }: MonitorStatsProps) {
  const total = monitors.length;
  const up = monitors.filter((m) => m.status === 'up').length;
  const down = monitors.filter((m) => m.status === 'down').length;
  const uptimePercentage = total > 0 ? ((up / total) * 100).toFixed(1) : '100.0';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 font-mono">
      <div className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
        <div className="flex items-center justify-between text-zinc-500 text-xs mb-1">
          <span>TOTAL MONITORS</span>
          <Activity className="w-3.5 h-3.5 text-zinc-400" />
        </div>
        <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{total}</div>
      </div>

      <div className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
        <div className="flex items-center justify-between text-zinc-500 text-xs mb-1">
          <span>HEALTHY (UP)</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        </div>
        <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{up}</div>
      </div>

      <div className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
        <div className="flex items-center justify-between text-zinc-500 text-xs mb-1">
          <span>OUTAGES (DOWN)</span>
          <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <div className="text-xl font-bold text-rose-600 dark:text-rose-400">{down}</div>
      </div>

      <div className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
        <div className="flex items-center justify-between text-zinc-500 text-xs mb-1">
          <span>HEALTH RATE</span>
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
        </div>
        <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{uptimePercentage}%</div>
      </div>
    </div>
  );
}