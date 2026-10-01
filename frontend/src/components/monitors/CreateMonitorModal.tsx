'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { MonitorCreate } from '@/types';

interface CreateMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MonitorCreate) => Promise<void>;
}

export function CreateMonitorModal({ isOpen, onClose, onSubmit }: CreateMonitorModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD'>('GET');
  const [interval, setInterval] = useState(60);
  const [timeout, setTimeout] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        url,
        method,
        interval_seconds: interval,
        timeout_seconds: timeout,
        is_active: true,
      });
      setName('');
      setUrl('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded shadow-xl text-xs font-sans">
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between font-mono">
          <span className="font-semibold text-zinc-100">CREATE MONITOR</span>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-zinc-400 font-mono mb-1">Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Core API Endpoint"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-mono mb-1">Target URL</label>
            <input
              type="url"
              required
              placeholder="https://api.example.com/health"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-400 font-mono mb-1">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="HEAD">HEAD</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-mono mb-1">Interval (s)</label>
              <input
                type="number"
                min="10"
                max="86400"
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-mono mb-1">Timeout (s)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={timeout}
                onChange={(e) => setTimeout(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-zinc-800 rounded text-zinc-400 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Monitor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}