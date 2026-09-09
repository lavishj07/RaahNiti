'use client';

import React, { useState } from 'react';
import { MapPin, RotateCcw, ChevronRight, Layers, Compass } from 'lucide-react';
import MapWrapper from '@/components/map/MapWrapper';
import { Customer } from '@/types';

const mockCustomerPoints: Customer[] = [
  { id: 'C01', name: 'Apex Electronics', address: 'Connaught Place', latitude: 28.6315, longitude: 77.2167, priority: 5 },
  { id: 'C02', name: 'Apollo Hospital', address: 'Sarita Vihar', latitude: 28.5355, longitude: 77.2880, priority: 5 },
  { id: 'C03', name: 'CyberTech Hub', address: 'DLF Cyber City', latitude: 28.4950, longitude: 77.0890, priority: 4 },
  { id: 'C04', name: 'Metro Retail', address: 'Noida Sector 62', latitude: 28.6280, longitude: 77.3650, priority: 3 },
  { id: 'C05', name: 'Vasant Kunj Hospital', address: 'Vasant Kunj', latitude: 28.5280, longitude: 77.1550, priority: 5 },
  { id: 'C06', name: 'Nexus Towers', address: 'Golf Course Rd', latitude: 28.4410, longitude: 77.1020, priority: 4 },
  { id: 'C08', name: 'Lajpat Nagar Market', address: 'Lajpat Nagar', latitude: 28.5680, longitude: 77.2430, priority: 2 },
  { id: 'C10', name: 'Hauz Khas Village', address: 'Hauz Khas', latitude: 28.5540, longitude: 77.1940, priority: 2 },
];

export const GrahamScanVisualizer: React.FC = () => {
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>(mockCustomerPoints);

  const toggleCustomer = (cust: Customer) => {
    if (selectedCustomers.some((c) => c.id === cust.id)) {
      if (selectedCustomers.length > 3) {
        setSelectedCustomers(selectedCustomers.filter((c) => c.id !== cust.id));
      }
    } else {
      setSelectedCustomers([...selectedCustomers, cust]);
    }
  };

  const hullPoints = selectedCustomers;

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md space-y-5 font-mono">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-slate-950 border border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" /> Graham's Scan Convex Hull Boundary Generator
          </h4>
          <p className="text-xs text-slate-400">Click customer points to toggle inclusion and observe dynamic boundary recalculation</p>
        </div>
        <button
          onClick={() => setSelectedCustomers(mockCustomerPoints)}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Points</span>
        </button>
      </div>

      {/* Grid Layout: Map & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map Centerpiece */}
        <div className="lg:col-span-2 min-h-[420px] rounded-xl overflow-hidden border border-slate-800">
          <MapWrapper mode="zone" customers={selectedCustomers} hullPoints={hullPoints} />
        </div>

        {/* Geometry & Stack Stats Sidebar */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
          <h5 className="font-bold text-cyan-400 border-b border-slate-800 pb-2">Zone Boundary Specs</h5>

          <div className="space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Boundary Hull Points:</span>
              <strong className="text-emerald-400 font-bold">{selectedCustomers.length}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Delivery Cluster Area:</span>
              <strong className="text-cyan-400 font-bold">142.8 sq km</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Zone Perimeter:</span>
              <strong className="text-purple-400 font-bold">58.4 km</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Centroid Coordinate:</span>
              <strong className="text-amber-400 font-bold text-[10px]">28.560° N, 77.200° E</strong>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 space-y-2">
            <h6 className="font-semibold text-slate-300 text-[11px]">Included Customers ({selectedCustomers.length})</h6>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {mockCustomerPoints.map((c) => {
                const isIncluded = selectedCustomers.some((sc) => sc.id === c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCustomer(c)}
                    className={`w-full p-2 rounded text-left transition-all flex items-center justify-between ${
                      isIncluded
                        ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-300'
                        : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span className="font-bold truncate text-[11px]">{c.name}</span>
                    <span className="text-[10px] font-mono">{isIncluded ? 'HULL' : 'EXCLUDED'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
