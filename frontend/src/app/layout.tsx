import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Sentinel - Developer Monitoring Dashboard',
  description: 'Enterprise-grade uptime and health monitoring platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans antialiased">
        <div className="flex-1 flex flex-col">{children}</div>
        <footer className="py-3 text-center text-xs font-mono text-zinc-500 border-t border-zinc-800 bg-zinc-950">
          Sentinel Monitoring Infrastructure &copy; 2026. MIT Licensed.
        </footer>
      </body>
    </html>
  );
}
