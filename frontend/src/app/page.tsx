import Link from 'next/link';
import { ShieldCheck, ArrowRight, Activity, Terminal, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between font-sans">
      <header className="border-b border-zinc-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>SENTINEL</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <Link href="/dashboard" className="px-3 py-1.5 bg-zinc-100 text-zinc-900 hover:bg-white font-medium rounded transition-colors">
            Go to Console
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded font-mono text-xs text-zinc-400 mb-8">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-time Async Engine Ready</span>
        </div>

        <h1 className="text-4xl font-mono font-bold tracking-tight text-zinc-50 sm:text-5xl mb-6">
          High-performance service health monitoring.
        </h1>

        <p className="text-base text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Sentinel tracks HTTP endpoints, records sub-millisecond response latency, and handles automated incident lifecycles without bloat.
        </p>

        <div className="flex items-center justify-center gap-4 text-sm font-mono">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded transition-colors"
          >
            Open Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-zinc-800 px-8 py-4 text-center font-mono text-xs text-zinc-600">
        Sentinel Monitoring Infrastructure &copy; 2026. MIT Licensed.
      </footer>
    </div>
  );
}