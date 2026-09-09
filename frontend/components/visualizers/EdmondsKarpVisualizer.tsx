'use client';

import React, { useState } from 'react';
import { Network, AlertTriangle, CheckCircle, ChevronRight, Activity } from 'lucide-react';
import MapWrapper from '@/components/map/MapWrapper';
import { GraphNode } from '@/types';

const mockFlowEdges = [
  { source: 'W1', target: 'N01', road_name: 'NH-48 Dwarka Expressway', capacity: 2500, flow: 1500, residual: 1000, is_saturated: false },
  { source: 'W1', target: 'N03', road_name: 'Outer Ring Road North', capacity: 1800, flow: 1100, residual: 700, is_saturated: false },
  { source: 'W1', target: 'N04', road_name: 'Gurugram Link Road', capacity: 2200, flow: 800, residual: 1400, is_saturated: false },
  { source: 'N01', target: 'N02', road_name: 'Ring Road South', capacity: 1500, flow: 1500, residual: 0, is_saturated: true },
  { source: 'N02', target: 'HUB_SOUTH', road_name: 'Okhla Estate Road', capacity: 1600, flow: 1600, residual: 0, is_saturated: true },
  { source: 'N08', target: 'HUB_SOUTH', road_name: 'Mathura Road Bottleneck', capacity: 800, flow: 800, residual: 0, is_saturated: true },
];

const mockNodes: GraphNode[] = [
  { id: 'W1', label: 'Warehouse Source', type: 'WAREHOUSE', latitude: 28.5521, longitude: 77.0589 },
  { id: 'N01', label: 'Dhaula Kuan', type: 'INTERSECTION', latitude: 28.5920, longitude: 77.1620 },
  { id: 'N02', label: 'AIIMS Flyover', type: 'INTERSECTION', latitude: 28.5670, longitude: 77.2100 },
  { id: 'N03', label: 'Punjabi Bagh', type: 'INTERSECTION', latitude: 28.6670, longitude: 77.1240 },
  { id: 'HUB_SOUTH', label: 'Okhla Hub Sink', type: 'HUB', latitude: 28.5360, longitude: 77.2710 },
];

export const EdmondsKarpVisualizer: React.FC = () => {
  const [selectedEdge, setSelectedEdge] = useState<any>(mockFlowEdges[4]);

  const maxFlow = 3400; // Total vehicles/hr max flow
  const saturatedCount = mockFlowEdges.filter((e) => e.is_saturated).length;

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md space-y-5 font-mono">
      {/* Top Flow Header & KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[10px]">Source Warehouse → Sink Hub</span>
            <span className="text-lg font-bold text-cyan-400">W1 ➔ HUB_SOUTH</span>
          </div>
          <Network className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[10px]">Maximum Flow Throughput</span>
            <span className="text-lg font-bold text-emerald-400">{maxFlow.toLocaleString()} veh/hr</span>
          </div>
          <Activity className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[10px]">Saturated Bottleneck Roads</span>
            <span className="text-lg font-bold text-rose-400">{saturatedCount} Roads Saturated</span>
          </div>
          <AlertTriangle className="w-5 h-5 text-rose-400" />
        </div>
      </div>

      {/* Grid: Map & Saturated Edge Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map Centerpiece */}
        <div className="lg:col-span-2 min-h-[400px] rounded-xl overflow-hidden border border-slate-800">
          <MapWrapper
            mode="flow"
            nodes={mockNodes}
            edges={mockFlowEdges as any}
            flowEdges={mockFlowEdges}
            onSelectEdge={(e) => setSelectedEdge(e)}
          />
        </div>

        {/* Road Capacities List */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
          <h5 className="font-bold text-cyan-400 border-b border-slate-800 pb-2">Road Network Capacities</h5>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {mockFlowEdges.map((e, idx) => {
              const isSelected = selectedEdge?.road_name === e.road_name;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedEdge(e)}
                  className={`p-2.5 rounded-lg cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                      : e.is_saturated
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <span className="truncate">{e.road_name}</span>
                    {e.is_saturated && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[9px] border border-rose-500/40 font-bold">
                        BOTTLENECK
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                    <span>Flow: {e.flow} / {e.capacity} veh/hr</span>
                    <span>Residual: {e.residual}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
