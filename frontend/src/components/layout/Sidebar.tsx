'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, AlertTriangle, BarChart3, Settings, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Monitors', href: '/dashboard', icon: Activity },
  { name: 'Incidents', href: '/dashboard/incidents', icon: AlertTriangle },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col h-screen sticky top-0 text-zinc-900 dark:text-zinc-100">
      <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center gap-2 font-mono font-semibold text-sm">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
        <span>SENTINEL</span>
        <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-normal text-zinc-600 dark:text-zinc-400">v0.1</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-500">
        Engine: <span className="text-emerald-600 dark:text-emerald-400">ONLINE</span>
      </div>
    </aside>
  );
}