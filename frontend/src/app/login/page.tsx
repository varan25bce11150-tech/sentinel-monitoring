'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-zinc-950 flex flex-col justify-center items-center px-4 font-sans text-xs py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6 font-mono">
          <div className="inline-flex items-center gap-2 text-emerald-500 font-bold text-base mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span>SENTINEL</span>
          </div>
          <p className="text-zinc-500">Sign in to access telemetry console</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded p-6 shadow-xl">
          {error && (
            <div className="mb-4 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded text-rose-400 font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-zinc-400 font-mono mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@sentinel.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded pl-9 pr-3 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-mono mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded pl-9 pr-3 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-mono font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-zinc-800 text-center text-zinc-500 font-mono">
            Need an account?{' '}
            <Link href="/register" className="text-zinc-300 underline hover:text-white">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
