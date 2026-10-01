'use client';

import { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { IncidentTable } from '@/components/incidents/IncidentTable';
import { apiFetch } from '@/lib/api';
import { Incident } from '@/types';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIncidents = useCallback(async () => {
    try {
      const data = await apiFetch<Incident[]>('/incidents');
      setIncidents(data);
    } catch (err) {
      console.error('Failed to load incidents:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const handleResolve = async (id: number) => {
    await apiFetch(`/incidents/${id}/resolve`, { method: 'POST' });
    await fetchIncidents();
  };

  return (
    <DashboardLayout title="Incidents & Outages">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Incident Log</h2>
          <p className="text-xs text-zinc-400 font-mono">Historical record of downtime and service disruptions</p>
        </div>

        <button
          onClick={() => fetchIncidents()}
          className="p-2 border border-zinc-800 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
          title="Refresh Incidents"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs font-mono text-zinc-500">LOADING INCIDENTS...</div>
      ) : (
        <IncidentTable incidents={incidents} onResolve={handleResolve} />
      )}
    </DashboardLayout>
  );
}