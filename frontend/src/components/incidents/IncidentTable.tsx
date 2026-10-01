'use client';

import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Incident } from '@/types';
import { clsx } from 'clsx';

interface IncidentTableProps {
  incidents: Incident[];
  onResolve: (id: number) => Promise<void>;
}

export function IncidentTable({ incidents, onResolve }: IncidentTableProps) {
  if (incidents.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-zinc-800 rounded bg-zinc-900/40 font-mono">
        <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
        <p className="text-xs text-zinc-400">NO INCIDENTS RECORDED</p>
        <p className="text-[11px] text-zinc-600 mt-1">All monitored systems are operating normally.</p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-800 rounded overflow-hidden bg-zinc-900 font-mono text-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-800/60 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider">
              <th className="py-2.5 px-4">State</th>
              <th className="py-2.5 px-4">Monitor ID</th>
              <th className="py-2.5 px-4">Cause / Error</th>
              <th className="py-2.5 px-4">Started At</th>
              <th className="py-2.5 px-4">Resolved At</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {incidents.map((incident) => {
              const isOpen = !incident.is_resolved;

              return (
                <tr key={incident.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border',
                        isOpen
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      )}
                    >
                      {isOpen ? (
                        <>
                          <AlertTriangle className="w-3 h-3 text-rose-400" /> OPEN
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> RESOLVED
                        </>
                      )}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-zinc-300"># {incident.monitor_id}</td>

                  <td className="py-3 px-4 text-zinc-300 font-sans max-w-xs truncate">
                    {incident.cause || 'Unknown failure'}
                  </td>

                  <td className="py-3 px-4 text-zinc-400">
                    {new Date(incident.started_at).toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-zinc-400">
                    {incident.resolved_at ? new Date(incident.resolved_at).toLocaleString() : '—'}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {isOpen && (
                      <button
                        onClick={() => onResolve(incident.id)}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700 text-[11px] transition-colors"
                      >
                        Resolve
                      </button>
                    )}
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