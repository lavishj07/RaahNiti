'use client';

import React, { useState } from 'react';
import { FloydWarshallVisualizer } from '@/components/visualizers/FloydWarshallVisualizer';
import { EdmondsKarpVisualizer } from '@/components/visualizers/EdmondsKarpVisualizer';

export default function NetworkPage() {
  const [mode, setMode] = useState<'edmonds' | 'floyd'>('edmonds');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 font-mono">
            Road Network Capacity & Route Planner
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
              Graph Theory Algorithms
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Analyze maximum vehicle flow capacities and compute all-pairs shortest paths across Delhi NCR highways.
          </p>
        </div>

        <div className="flex items-center space-x-2 p-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setMode('edmonds')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === 'edmonds'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Edmonds-Karp (Max Flow)
          </button>
          <button
            onClick={() => setMode('floyd')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === 'floyd'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Floyd-Warshall (Shortest Path)
          </button>
        </div>
      </div>

      {mode === 'edmonds' ? <EdmondsKarpVisualizer /> : <FloydWarshallVisualizer />}
    </div>
  );
}
