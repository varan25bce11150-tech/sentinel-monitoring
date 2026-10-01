'use client';

import { Bell, RefreshCw, User } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h1>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-2 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 font-mono text-zinc-600 dark:text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Operational
        </div>

        <button 
          onClick={() => window.location.reload()} 
          className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}