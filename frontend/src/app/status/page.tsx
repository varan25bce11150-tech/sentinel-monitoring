'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertOctagon } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Monitor } from '@/types';

export default function PublicStatusPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await apiFetch<Monitor[]>('/monitors/');
        setMonitors(data);
      } catch (err) {
        console.error('Error fetching public status:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStatus();
  }, []);

  const total = monitors.length;
  const downCount = monitors.filter((m) => m.status === 'down').length;
  const isAllOperational = total > 0 && downCount === 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <header className="border-b border-zinc-800 py-4 px-6 max-w-4xl mx-auto flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>SYSTEM STATUS</span>
        </div>
        <span className="text-zinc-500">{new Date().toLocaleDateString()}</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Top Status Banner */}
        <div
          className={`p-4 rounded border font-mono text-xs flex items-center gap-3 ${
            isAllOperational
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : downCount > 0
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400'
          }`}
        >
          {isAllOperational ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <div>
                <div className="font-bold">All Systems Operational</div>
                <div className="text-[11px] opacity-80">All services are functioning within normal latency parameters.</div>
              </div>
            </>
          ) : (
            <>
              <AlertOctagon className="w-5 h-5 text-rose-500" />
              <div>
                <div className="font-bold">{downCount} Service Disruption(s) Detected</div>
                <div className="text-[11px] opacity-80">Incident isolation in progress.</div>
              </div>
            </>
          )}
        </div>

        {/* Services List */}
        <div className="border border-zinc-800 rounded bg-zinc-900/50 overflow-hidden font-mono text-xs">
          <div className="px-4 py-3 bg-zinc-800/60 border-b border-zinc-800 font-semibold text-zinc-400">
            SYSTEM SERVICES ({total})
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-zinc-500">FETCHING SYSTEM HEALTH...</div>
          ) : monitors.length === 0 ? (
            <div className="p-6 text-center text-zinc-500">NO PUBLIC MONITORS DISPLAYED</div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {monitors.map((m) => (
                <div key={m.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-sans font-medium text-zinc-200">{m.name}</div>
                    <div className="text-[11px] text-zinc-500">{m.url}</div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                      m.status === 'up'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : m.status === 'down'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        m.status === 'up' ? 'bg-emerald-500' : m.status === 'down' ? 'bg-rose-500' : 'bg-zinc-500'
                      }`}
                    />
                    {m.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}