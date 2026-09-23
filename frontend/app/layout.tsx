import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SearchProvider } from '@/components/layout/SearchProvider';

export const metadata: Metadata = {
  title: 'RaahNiti — Intelligent Route & Fleet Optimization',
  description: 'Interactive map-based logistics intelligence dashboard and fleet optimization platform powered by custom DSA algorithms.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
        <SearchProvider>
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6 overflow-y-auto max-w-[1600px] mx-auto w-full">
              {children}
            </main>
          </div>
        </SearchProvider>
      </body>
    </html>
  );
}
