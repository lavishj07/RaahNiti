'use client';

import React, { useEffect, useState } from 'react';
import MapWrapper from '@/components/map/MapWrapper';
import { KpiGrid } from '@/components/kpi/KpiGrid';
import { RoutePlayback } from '@/components/simulation/RoutePlayback';
import { apiService } from '@/lib/api';
import { Warehouse, Customer, Vehicle, GraphNode, GraphEdge, Zone, DashboardStats } from '@/types';
import { Layers, MapPin, Search, Cpu } from 'lucide-react';

export default function DashboardPage() {
  const [mapMode, setMapMode] = useState<'normal' | 'zone' | 'network' | 'flow' | 'shortest-path'>('normal');
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [whRes, custRes, vehRes, netRes, zoneRes, statsRes] = await Promise.allSettled([
          apiService.getWarehouse(),
          apiService.getCustomers(),
          apiService.getVehicles(),
          apiService.getNetwork(),
          apiService.getZones(),
          apiService.getStats(),
        ]);

        if (whRes.status === 'fulfilled') setWarehouse(whRes.value);
        if (custRes.status === 'fulfilled') setCustomers(custRes.value);
        if (vehRes.status === 'fulfilled') setVehicles(vehRes.value);
        if (netRes.status === 'fulfilled') {
          setNodes(netRes.value.nodes);
          setEdges(netRes.value.edges);
        }
        if (zoneRes.status === 'fulfilled') setZones(zoneRes.value);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 font-mono">
            Logistics Command Center
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Live Fleet Intelligence
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">Real-time route planning, dynamic zoning, and graph capacity monitoring</p>
        </div>

        {/* Map Layer Mode Switcher */}
        <div className="flex items-center space-x-1.5 p-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs overflow-x-auto">
          {[
            { id: 'normal', label: 'Normal Map' },
            { id: 'zone', label: 'Convex Zones' },
            { id: 'network', label: 'Road Graph' },
            { id: 'flow', label: 'Max Flow' },
            { id: 'shortest-path', label: 'Shortest Path' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setMapMode(mode.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                mapMode === mode.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <KpiGrid stats={stats} />

      {/* Main Grid: Interactive Map & Side Details */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Centerpiece (Spans 3 Columns) */}
        <div className="lg:col-span-3 min-h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
          <MapWrapper
            mode={mapMode}
            warehouse={warehouse}
            customers={customers}
            vehicles={vehicles}
            nodes={nodes}
            edges={edges}
            zones={zones}
            onSelectCustomer={(c) => setSelectedCustomer(c)}
          />
        </div>

        {/* Customer Detail Inspector Panel */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md space-y-4 font-mono">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Location Inspector</h3>
          </div>

          {selectedCustomer ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold uppercase">Customer ID: {selectedCustomer.id}</span>
                <p className="text-sm font-bold text-white">{selectedCustomer.name}</p>
                <p className="text-slate-400 text-[11px]">{selectedCustomer.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Priority</span>
                  <span className="font-bold text-rose-400 text-sm">{selectedCustomer.priority}/5</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Zone</span>
                  <span className="font-bold text-cyan-400 text-sm">{selectedCustomer.zone_id || 'Z_NORTH'}</span>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400">GPS Coordinates</span>
                <p className="text-slate-300 font-mono text-[11px]">
                  Lat: {selectedCustomer.latitude.toFixed(4)}, Lng: {selectedCustomer.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-2 text-slate-500 text-xs">
              <Search className="w-8 h-8 mx-auto text-slate-600" />
              <p>Click any map marker to inspect detailed customer, vehicle, or road node telemetry.</p>
            </div>
          )}
        </div>
      </div>

      {/* Route Simulation Player */}
      <RoutePlayback />
    </div>
  );
}
