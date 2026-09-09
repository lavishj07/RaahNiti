'use client';

import React from 'react';
import { GrahamScanVisualizer } from '@/components/visualizers/GrahamScanVisualizer';

export default function ZonesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 font-mono">
          Delivery Zone Boundaries
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
            Graham's Scan O(N log N)
          </span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Automatically construct convex polygon boundaries around customer delivery destination clusters.
        </p>
      </div>

      <GrahamScanVisualizer />
    </div>
  );
}
