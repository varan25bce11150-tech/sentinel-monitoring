'use client';

import { Play, Trash2, ExternalLink } from 'lucide-react';
import { Monitor } from '@/types';
import { clsx } from 'clsx';

interface MonitorTableProps {
  monitors: Monitor[];
  onTriggerCheck: (id: number) => Promise<void>;
  onDeleteMonitor: (id: number) => Promise<void>;
}

export function MonitorTable({ monitors, onTriggerCheck, onDeleteMonitor }: MonitorTableProps) {
  if (monitors.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900/50">
        <p className="text-xs font-mono text-zinc-500 mb-2">NO ACTIVE MONITORS CONFIGURED</p>
        <p className="text-xs text-zinc-400">Click "Add Monitor" above to start tracking endpoints.</p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden bg-white dark:bg-zinc-900 text-xs font-mono">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider">
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Name & URL</th>
              <th className="py-2.5 px-4">Method</th>
              <th className="py-2.5 px-4">Interval</th>
              <th className="py-2.5 px-4">Last Checked</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {monitors.map((m) => {
              const isUp = m.status === 'up';
              const isDown = m.status === 'down';

              return (
                <tr key={m.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border',
                        isUp && 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                        isDown && 'bg-rose-500/10 text-rose-500 border-rose-500/20',
                        !isUp && !isDown && 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                      )}
                    >
                      <span
                        className={clsx(
                          'w-1.5 h-1.5 rounded-full',
                          isUp && 'bg-emerald-500',
                          isDown && 'bg-rose-500',
                          !isUp && !isDown && 'bg-zinc-400'
                        )}
                      />
                      {m.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-sans font-medium text-zinc-900 dark:text-zinc-100">{m.name}</div>
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors text-[11px]"
                    >
                      {m.url} <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300 text-[10px]">
                      {m.method}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-zinc-400">{m.interval_seconds}s</td>

                  <td className="py-3 px-4 text-zinc-400">
                    {m.last_checked_at ? new Date(m.last_checked_at).toLocaleTimeString() : 'Never'}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onTriggerCheck(m.id)}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-100 transition-colors"
                        title="Trigger Instant Check"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteMonitor(m.id)}
                        className="p-1.5 hover:bg-rose-500/10 rounded text-zinc-400 hover:text-rose-400 transition-colors"
                        title="Delete Monitor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}