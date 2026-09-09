'use client';

import React from 'react';
import { KnapsackVisualizer } from '@/components/visualizers/KnapsackVisualizer';
import { PackageCheck } from 'lucide-react';

export default function CargoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 font-mono">
          Cargo Payload Optimization
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
            0/1 Knapsack DP
          </span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Maximize total package priority and dollar value loaded into fleet trucks while adhering to strict payload weight limits.
        </p>
      </div>

      <KnapsackVisualizer />
    </div>
  );
}
