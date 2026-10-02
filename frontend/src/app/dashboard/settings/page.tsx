'use client';

import React, { useState, useEffect } from 'react';

interface SettingsData {
  project_name: string;
  alert_email: string;
  slack_webhook_url: string;
  discord_webhook_url: string;
  ping_interval_seconds: number;
  timeout_seconds: number;
  cpu_threshold_percent: number;
  memory_threshold_percent: number;
  enable_email_alerts: boolean;
  enable_webhook_alerts: boolean;
}

interface APIKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'thresholds' | 'apikeys'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<SettingsData>({
    project_name: 'Sentinel Monitoring',
    alert_email: 'admin@sentinel.local',
    slack_webhook_url: '',
    discord_webhook_url: '',
    ping_interval_seconds: 60,
    timeout_seconds: 10,
    cpu_threshold_percent: 85,
    memory_threshold_percent: 90,
    enable_email_alerts: true,
    enable_webhook_alerts: true,
  });

  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchSettings();
    fetchApiKeys();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApiKeys = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings/api-keys`);
      if (res.ok) {
        const data = await res.json();
        setApiKeys(data);
      }
    } catch (err) {
      console.error('Failed to load API keys:', err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'System configuration updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update settings. Please check backend response.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/settings/api-keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedKey(data.api_key);
        setNewKeyName('');
        fetchApiKeys();
      }
    } catch (err) {
      console.error('Failed to generate key:', err);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    try {
      const res = await fetch(`${API_BASE}/settings/api-keys/${keyId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchApiKeys();
      }
    } catch (err) {
      console.error('Failed to delete key:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-500">Configure global monitoring rules, alert channels, and API credentials.</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            General & Notifications
          </button>
          <button
            onClick={() => setActiveTab('thresholds')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'thresholds'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Monitoring Thresholds
          </button>
          <button
            onClick={() => setActiveTab('apikeys')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'apikeys'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            API Keys & Integrations
          </button>
        </nav>
      </div>

      {/* Tab 1: General & Alerts */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveSettings} className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Name</label>
              <input
                type="text"
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Alert Notification Email</label>
              <input
                type="email"
                value={formData.alert_email}
                onChange={(e) => setFormData({ ...formData, alert_email: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Slack Webhook URL</label>
              <input
                type="url"
                value={formData.slack_webhook_url}
                onChange={(e) => setFormData({ ...formData, slack_webhook_url: e.target.value })}
                placeholder="https://hooks.slack.com/services/..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Discord Webhook URL</label>
              <input
                type="url"
                value={formData.discord_webhook_url}
                onChange={(e) => setFormData({ ...formData, discord_webhook_url: e.target.value })}
                placeholder="https://discord.com/api/webhooks/..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enable_email_alerts"
                checked={formData.enable_email_alerts}
                onChange={(e) => setFormData({ ...formData, enable_email_alerts: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="enable_email_alerts" className="ml-2 block text-sm text-gray-900">
                Send immediate email alerts on system failures
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enable_webhook_alerts"
                checked={formData.enable_webhook_alerts}
                onChange={(e) => setFormData({ ...formData, enable_webhook_alerts: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="enable_webhook_alerts" className="ml-2 block text-sm text-gray-900">
                Dispatch webhook payloads to Slack / Discord channels
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Thresholds */}
      {activeTab === 'thresholds' && (
        <form onSubmit={handleSaveSettings} className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ping Interval (Seconds)</label>
              <input
                type="number"
                min="10"
                max="3600"
                value={formData.ping_interval_seconds}
                onChange={(e) => setFormData({ ...formData, ping_interval_seconds: parseInt(e.target.value) || 60 })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <span className="text-xs text-gray-500">Frequency of automated health checks.</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Request Timeout (Seconds)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={formData.timeout_seconds}
                onChange={(e) => setFormData({ ...formData, timeout_seconds: parseInt(e.target.value) || 10 })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <span className="text-xs text-gray-500">Max wait duration before marking host offline.</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">CPU Alert Threshold (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.cpu_threshold_percent}
                onChange={(e) => setFormData({ ...formData, cpu_threshold_percent: parseInt(e.target.value) || 85 })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Memory Alert Threshold (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.memory_threshold_percent}
                onChange={(e) => setFormData({ ...formData, memory_threshold_percent: parseInt(e.target.value) || 90 })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Thresholds'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: API Keys */}
      {activeTab === 'apikeys' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Generate New API Key</h3>
            <form onSubmit={handleGenerateKey} className="flex gap-4">
              <input
                type="text"
                placeholder="Key Description (e.g. Production Agent)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
              >
                Generate Token
              </button>
            </form>

            {generatedKey && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-xs font-semibold text-yellow-800 uppercase">Save Your Key (Shown Once):</p>
                <code className="block mt-1 p-2 bg-white rounded border border-gray-300 text-sm font-mono text-gray-900 select-all">
                  {generatedKey}
                </code>
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Active Access Tokens</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Token Prefix</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Used</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiKeys.map((key) => (
                  <tr key={key.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{key.key_prefix}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{key.created_at}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{key.last_used}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteKey(key.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}