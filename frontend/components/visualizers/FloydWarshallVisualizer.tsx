'use client';

import React, { useState } from 'react';
import { Route, ChevronRight, RotateCcw, Compass } from 'lucide-react';
import MapWrapper from '@/components/map/MapWrapper';
import { GraphNode } from '@/types';

const mockNodes: GraphNode[] = [
  { id: 'W1', label: 'Dwarka Warehouse', type: 'WAREHOUSE', latitude: 28.5521, longitude: 77.0589 },
  { id: 'N01', label: 'Dhaula Kuan', type: 'INTERSECTION', latitude: 28.5920, longitude: 77.1620 },
  { id: 'N02', label: 'AIIMS Flyover', type: 'INTERSECTION', latitude: 28.5670, longitude: 77.2100 },
  { id: 'N03', label: 'Punjabi Bagh', type: 'INTERSECTION', latitude: 28.6670, longitude: 77.1240 },
  { id: 'N05', label: 'Rajiv Chowk (CP)', type: 'INTERSECTION', latitude: 28.6315, longitude: 77.2167 },
];

const mockDistanceMatrix: Record<string, Record<string, number>> = {
  W1: { W1: 0, N01: 11.5, N02: 18.3, N03: 14.0, N05: 19.5 },
  N01: { W1: 11.5, N01: 0, N02: 6.8, N03: 12.1, N05: 8.0 },
  N02: { W1: 18.3, N01: 6.8, N02: 0, N03: 15.4, N05: 7.2 },
  N03: { W1: 14.0, N01: 12.1, N02: 15.4, N03: 0, N05: 11.2 },
  N05: { W1: 19.5, N01: 8.0, N02: 7.2, N03: 11.2, N05: 0 },
};

export const FloydWarshallVisualizer: React.FC = () => {
  const [sourceId, setSourceId] = useState('W1');
  const [targetId, setTargetId] = useState('N05');
  const [intermediateK, setIntermediateK] = useState(4);

  const shortestDistance = mockDistanceMatrix[sourceId]?.[targetId] ?? 19.5;
  const pathNodes = sourceId === 'W1' && targetId === 'N05' ? ['W1', 'N01', 'N05'] : [sourceId, targetId];

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md space-y-5 font-mono">
      {/* Shortest Path Solver Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-950 border border-slate-800">
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-semibold">Source Intersection Node</label>
          <select
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-cyan-400 font-bold focus:outline-none"
          >
            {mockNodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.id} - {n.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-semibold">Destination Node</label>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-bold focus:outline-none"
          >
            {mockNodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.id} - {n.label}
              </option>
            ))}
          </select>
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400">Optimal Shortest Distance</span>
          <span className="text-xl font-bold text-amber-400">{shortestDistance} km</span>
        </div>
      </div>

      {/* Grid: Distance Matrix & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* All-Pairs Distance Matrix Grid */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-purple-400">Distance Matrix dist[i][j] (k = {intermediateK})</span>
            <span className="text-slate-500">O(V³) All-Pairs Shortest Path</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                  <th className="p-2 text-left">From \ To</th>
                  {mockNodes.map((n) => (
                    <th key={n.id} className="p-2 font-bold text-cyan-400">{n.id}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockNodes.map((rowNode) => (
                  <tr key={rowNode.id} className="border-b border-slate-800/60">
                    <td className="p-2 text-left font-bold text-cyan-400">{rowNode.id}</td>
                    {mockNodes.map((colNode) => {
                      const distVal = mockDistanceMatrix[rowNode.id]?.[colNode.id] ?? 0;
                      const isHighlighted = rowNode.id === sourceId && colNode.id === targetId;

                      return (
                        <td
                          key={colNode.id}
                          className={`p-2 font-mono transition-all ${
                            isHighlighted
                              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-sm'
                              : 'text-slate-300'
                          }`}
                        >
                          {distVal}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="text-cyan-300 font-bold">Path Sequence:</span>
            <p className="text-slate-200 font-bold text-xs">{pathNodes.join(' ➔ ')}</p>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="min-h-[350px] rounded-xl overflow-hidden border border-slate-800">
          <MapWrapper mode="shortest-path" nodes={mockNodes} shortestPathNodes={pathNodes} />
        </div>
      </div>
    </div>
  );
};
