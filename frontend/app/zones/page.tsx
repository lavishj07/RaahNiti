'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the whole visualizer to prevent any SSR issues on Vercel
const GrahamScanVisualizer = dynamic(
  () => import('@/components/visualizers/GrahamScanVisualizer').then(m => ({ default: m.GrahamScanVisualizer })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[500px] rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-cyan-400">Initializing Graham Scan Engine...</p>
        </div>
      </div>
    ),
  }
);

export default function ZonesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 font-mono">
          Delivery Zone Boundaries
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
            Graham&apos;s Scan O(N log N)
          </span>
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Automatically construct convex polygon boundaries around customer delivery destination clusters.
          Toggle customer stops to see the hull recalculate in real-time.
        </p>
      </div>

      <GrahamScanVisualizer />
    </div>
  );
}
