'use client';

import React, { useEffect, useState } from 'react';
import { Truck, ShieldCheck, Gauge, Navigation, UserCheck } from 'lucide-react';
import { RoutePlayback } from '@/components/simulation/RoutePlayback';
import { apiService } from '@/lib/api';
import { Vehicle } from '@/types';

const mockVehicles: Vehicle[] = [
  { id: 'V01', vehicle_number: 'DL-01-EV-4091', driver_name: 'Rajesh Kumar', payload_capacity_kg: 300, current_load_kg: 185, status: 'ACTIVE', current_latitude: 28.6100, current_longitude: 77.1800 },
  { id: 'V02', vehicle_number: 'DL-03-EV-8812', driver_name: 'Amit Singh', payload_capacity_kg: 250, current_load_kg: 210, status: 'ACTIVE', current_latitude: 28.5400, current_longitude: 77.2400 },
  { id: 'V03', vehicle_number: 'HR-26-CC-1920', driver_name: 'Vikram Verma', payload_capacity_kg: 400, current_load_kg: 310, status: 'ACTIVE', current_latitude: 28.6800, current_longitude: 77.1300 },
  { id: 'V04', vehicle_number: 'UP-14-BT-9041', driver_name: 'Sanjay Sharma', payload_capacity_kg: 350, current_load_kg: 140, status: 'ACTIVE', current_latitude: 28.5600, current_longitude: 77.1100 },
  { id: 'V05', vehicle_number: 'DL-10-EV-5544', driver_name: 'Pankaj Yadav', payload_capacity_kg: 250, current_load_kg: 0, status: 'IDLE', current_latitude: 28.5521, current_longitude: 77.0589 },
  { id: 'V06', vehicle_number: 'HR-55-EX-7781', driver_name: 'Manoj Tiwari', payload_capacity_kg: 500, current_load_kg: 0, status: 'LOADING', current_latitude: 28.5521, current_longitude: 77.0589 },
];

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(mockVehicles[0]);

  useEffect(() => {
    async function loadVehicles() {
      try {
        const data = await apiService.getVehicles();
        if (data && data.length > 0) {
          setVehicles(data);
          setSelectedVehicle(data[0]);
        }
      } catch (err) {
        console.warn('Using mock fleet data');
      }
    }
    loadVehicles();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 font-mono">
          Fleet Management & Route Simulator
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
            6 Vehicles Active
          </span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Monitor active vehicle loads, driver assignments, route progress, and live vehicle playback simulations.
        </p>
      </div>

      {/* Fleet Table */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Active Delivery Fleet Roster</h3>
          </div>
          <span className="text-xs text-slate-400">Total Capacity: 2,050 kg</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                <th className="p-2.5">Vehicle ID / Number</th>
                <th className="p-2.5">Driver</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">Payload Utilization</th>
                <th className="p-2.5">Current GPS</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => {
                const utilPct = Math.round((v.current_load_kg / v.payload_capacity_kg) * 100);
                const isSelected = selectedVehicle?.id === v.id;

                return (
                  <tr
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className={`border-b border-slate-800/60 cursor-pointer transition-all ${
                      isSelected ? 'bg-cyan-950/40 border-cyan-500/40' : 'hover:bg-slate-900/50'
                    }`}
                  >
                    <td className="p-2.5 font-bold text-cyan-400">{v.vehicle_number}</td>
                    <td className="p-2.5 text-slate-200">{v.driver_name}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          v.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : v.status === 'LOADING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                          <div
                            className={`h-full ${utilPct >= 80 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                            style={{ width: `${utilPct}%` }}
                          ></div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-300">{v.current_load_kg} / {v.payload_capacity_kg} kg ({utilPct}%)</span>
                      </div>
                    </td>
                    <td className="p-2.5 text-slate-400 text-[10px]">
                      {v.current_latitude.toFixed(4)}° N, {v.current_longitude.toFixed(4)}° E
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulation Playback */}
      <RoutePlayback />
    </div>
  );
}
