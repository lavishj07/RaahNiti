'use client';

import React, { useState } from 'react';
import { Package, Truck, Gauge, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { solve_01_knapsack } from '@/lib/algorithms/knapsack';

const samplePackages = [
  { id: 'P1', name: 'Medication Delivery', weight: 15, value: 1200, priority: 5 },
  { id: 'P2', name: 'Surgical Equipment', weight: 25, value: 3400, priority: 5 },
  { id: 'P3', name: 'Electronics Consignment', weight: 35, value: 1900, priority: 4 },
  { id: 'P4', name: 'Apparel Cartons', weight: 45, value: 850, priority: 2 },
  { id: 'P5', name: 'Hospital Supplies', weight: 20, value: 2500, priority: 5 },
  { id: 'P6', name: 'Retail Merchandise', weight: 30, value: 1400, priority: 3 },
];

export const KnapsackVisualizer: React.FC = () => {
  const [capacity, setCapacity] = useState(100);
  const [items, setItems] = useState(samplePackages);

  const result = solve_01_knapsack(items, capacity);

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md space-y-5 font-mono">
      {/* Top Capacity Slider */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-slate-950 border border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" /> Truck Payload Capacity Setting
          </h4>
          <p className="text-xs text-slate-400">Adjust truck weight limit to observe dynamic cargo re-optimization</p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="30"
            max="180"
            step="5"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-48 accent-cyan-400 cursor-pointer"
          />
          <span className="text-sm font-bold text-cyan-400 px-3 py-1 rounded bg-slate-900 border border-slate-700">
            {capacity} kg Limit
          </span>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <span className="text-slate-400 block text-[10px]">Loaded Weight</span>
          <span className="text-lg font-bold text-cyan-400">{result.totalWeight} / {capacity} kg</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <span className="text-slate-400 block text-[10px]">Payload Utilization</span>
          <span className="text-lg font-bold text-emerald-400">{result.utilizationPct}%</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <span className="text-slate-400 block text-[10px]">Total Cargo Value</span>
          <span className="text-lg font-bold text-amber-400">${result.totalValue.toLocaleString()}</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <span className="text-slate-400 block text-[10px]">Packages Rejected</span>
          <span className="text-lg font-bold text-rose-400">{result.rejectedItems.length}</span>
        </div>
      </div>

      {/* Visual Truck Payload Bay */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-cyan-400 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-emerald-400" /> Interactive Truck Loading Payload Bay
          </span>
          <span className="text-slate-400">{result.selectedItems.length} Packages Loaded</span>
        </div>

        <div className="w-full min-h-[100px] p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-wrap gap-2 items-center">
          {result.selectedItems.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs space-y-1 shadow-md shadow-cyan-500/10 flex-1 min-w-[140px] animate-fade-in"
            >
              <div className="flex items-center justify-between font-bold">
                <span>{item.id}</span>
                <span className="text-[10px] text-emerald-400">${item.value}</span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">{item.name}</p>
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>{item.weight} kg</span>
                <span>P{item.priority}</span>
              </div>
            </div>
          ))}

          {result.selectedItems.length === 0 && (
            <div className="w-full text-center text-xs text-slate-500 py-6">
              Truck payload bay is empty. Increase capacity limit.
            </div>
          )}
        </div>
      </div>

      {/* DP Matrix Table View */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-purple-400">2D Dynamic Programming State Matrix DP[i][w]</span>
          <span className="text-slate-500">State: max value with first i items & weight limit w</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                <th className="p-2">Item i</th>
                <th className="p-2">Name</th>
                <th className="p-2">Weight</th>
                <th className="p-2">Value</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const isSelected = result.selectedItems.some((s) => s.id === item.id);
                return (
                  <tr key={item.id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                    <td className="p-2 font-bold text-slate-300">{idx + 1}</td>
                    <td className="p-2 text-slate-200">{item.name}</td>
                    <td className="p-2 text-cyan-400 font-bold">{item.weight} kg</td>
                    <td className="p-2 text-amber-400 font-bold">${item.value}</td>
                    <td className="p-2">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                          <CheckCircle className="w-3 h-3 text-emerald-400" /> LOADED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-bold">
                          <XCircle className="w-3 h-3 text-rose-400" /> REJECTED
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
