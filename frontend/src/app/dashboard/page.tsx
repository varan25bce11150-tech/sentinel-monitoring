'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MonitorStats } from '@/components/monitors/MonitorStats';
import { MonitorTable } from '@/components/monitors/MonitorTable';
import { CreateMonitorModal } from '@/components/monitors/CreateMonitorModal';
import { apiFetch } from '@/lib/api';
import { Monitor } from '@/types';

export default function DashboardPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMonitors = useCallback(async () => {
    try {
      const data = await apiFetch<Monitor[]>('/monitors/');
      setMonitors(data);
    } catch (err) {
      console.error('Failed to load monitors:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonitors();
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchMonitors, 15000);
    return () => clearInterval(interval);
  }, [fetchMonitors]);

  const handleCreateMonitor = async (newMonitor: any) => {
    await apiFetch('/monitors/', {
      method: 'POST',
      body: JSON.stringify(newMonitor),
    });
    await fetchMonitors();
  };

  const handleTriggerCheck = async (id: number) => {
    await apiFetch(`/monitors/${id}/check`, { method: 'POST' });
    await fetchMonitors();
  };

  const handleDeleteMonitor = async (id: number) => {
    if (!confirm('Are you sure you want to delete this monitor?')) return;
    await apiFetch(`/monitors/${id}`, { method: 'DELETE' });
    await fetchMonitors();
  };

  return (
    <DashboardLayout title="Monitors Overview">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Active Monitors</h2>
          <p className="text-xs text-zinc-400 font-mono">Real-time HTTP health checking engine</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => fetchMonitors()}
            className="p-2 border border-zinc-800 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Monitor
          </button>
        </div>
      </div>

      <MonitorStats monitors={monitors} />

      {isLoading ? (
        <div className="p-8 text-center text-xs font-mono text-zinc-500">FETCHING MONITOR DATA...</div>
      ) : (
        <MonitorTable
          monitors={monitors}
          onTriggerCheck={handleTriggerCheck}
          onDeleteMonitor={handleDeleteMonitor}
        />
      )}

      <CreateMonitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateMonitor}
      />
    </DashboardLayout>
  );
}