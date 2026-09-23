'use client';

import React, { useState, useMemo } from 'react';
import { RotateCcw, Compass } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Customer } from '@/types';

// Dynamic import to avoid SSR crash (Leaflet requires browser window)
const MapWrapper = dynamic(() => import('@/components/map/MapWrapper'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-slate-900/90 flex items-center justify-center rounded-xl">
      <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const mockCustomerPoints: Customer[] = [
  { id: 'C01', name: 'Apex Electronics',      address: 'Connaught Place',  latitude: 28.6315, longitude: 77.2167, priority: 5 },
  { id: 'C02', name: 'Apollo Hospital',        address: 'Sarita Vihar',     latitude: 28.5355, longitude: 77.2880, priority: 5 },
  { id: 'C03', name: 'CyberTech Hub',          address: 'DLF Cyber City',   latitude: 28.4950, longitude: 77.0890, priority: 4 },
  { id: 'C04', name: 'Metro Retail',           address: 'Noida Sector 62',  latitude: 28.6280, longitude: 77.3650, priority: 3 },
  { id: 'C05', name: 'Vasant Kunj Hospital',   address: 'Vasant Kunj',      latitude: 28.5280, longitude: 77.1550, priority: 5 },
  { id: 'C06', name: 'Nexus Towers',           address: 'Golf Course Rd',   latitude: 28.4410, longitude: 77.1020, priority: 4 },
  { id: 'C08', name: 'Lajpat Nagar Market',    address: 'Lajpat Nagar',     latitude: 28.5680, longitude: 77.2430, priority: 2 },
  { id: 'C10', name: 'Hauz Khas Village',      address: 'Hauz Khas',        latitude: 28.5540, longitude: 77.1940, priority: 2 },
  { id: 'C11', name: 'Rohini Sector 10',       address: 'Rohini',           latitude: 28.7180, longitude: 77.1150, priority: 3 },
  { id: 'C22', name: 'Aerocity Hub',           address: 'Aerocity',         latitude: 28.5550, longitude: 77.1210, priority: 5 },
];

// Pure front-end Graham Scan (no API needed — avoids SSR issues on Vercel)
function crossProduct(o: Customer, a: Customer, b: Customer): number {
  return (a.longitude - o.longitude) * (b.latitude - o.latitude)
       - (a.latitude  - o.latitude)  * (b.longitude - o.longitude);
}

function distSq(a: Customer, b: Customer): number {
  return (a.longitude - b.longitude) ** 2 + (a.latitude - b.latitude) ** 2;
}

function computeHull(points: Customer[]): Customer[] {
  if (points.length < 3) return points;
  const pivot = [...points].sort((a, b) => a.latitude - b.latitude || a.longitude - b.longitude)[0];
  const rest = points.filter(p => p.id !== pivot.id);
  rest.sort((a, b) => {
    const angA = Math.atan2(a.latitude - pivot.latitude, a.longitude - pivot.longitude);
    const angB = Math.atan2(b.latitude - pivot.latitude, b.longitude - pivot.longitude);
    if (Math.abs(angA - angB) < 1e-10) return distSq(pivot, a) - distSq(pivot, b);
    return angA - angB;
  });

  const stack: Customer[] = [pivot, rest[0]];
  for (let i = 1; i < rest.length; i++) {
    while (stack.length >= 2 && crossProduct(stack[stack.length - 2], stack[stack.length - 1], rest[i]) <= 0) {
      stack.pop();
    }
    stack.push(rest[i]);
  }
  return stack;
}

function shoelaceArea(pts: Customer[]): number {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    a += pts[i].longitude * pts[j].latitude;
    a -= pts[j].longitude * pts[i].latitude;
  }
  return Math.abs(a) / 2;
}

function perimeter(pts: Customer[]): number {
  let p = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    p += Math.sqrt(distSq(pts[i], pts[j]));
  }
  return p;
}

export const GrahamScanVisualizer: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(mockCustomerPoints.map(c => c.id))
  );

  const selectedCustomers = mockCustomerPoints.filter(c => selectedIds.has(c.id));

  const hull = useMemo(() => computeHull(selectedCustomers), [selectedCustomers]);

  const areaVal = useMemo(() => {
    if (hull.length < 3) return 0;
    // Convert degree² → rough km² (1° lat ≈ 111 km)
    return shoelaceArea(hull) * 111 * 111;
  }, [hull]);

  const periVal = useMemo(() => {
    if (hull.length < 2) return 0;
    return perimeter(hull) * 111; // degrees → km approximation
  }, [hull]);

  const centroid = useMemo(() => {
    if (hull.length === 0) return { lat: 28.56, lng: 77.20 };
    return {
      lat: hull.reduce((s, p) => s + p.latitude, 0) / hull.length,
      lng: hull.reduce((s, p) => s + p.longitude, 0) / hull.length,
    };
  }, [hull]);

  const toggleCustomer = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      if (next.size > 3) next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md space-y-5 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-slate-950 border border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            Graham&apos;s Scan — Convex Hull Boundary Generator
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Toggle customer stops to dynamically recalculate the delivery zone boundary polygon.
          </p>
        </div>
        <button
          onClick={() => setSelectedIds(new Set(mockCustomerPoints.map(c => c.id)))}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All Points
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 min-h-[420px] rounded-xl overflow-hidden border border-slate-800">
          <MapWrapper
            mode="zone"
            customers={selectedCustomers}
            zoneHulls={[{ id: 'custom', name: 'Custom Hull', color: '#06B6D4', positions: hull.map(h => [h.latitude, h.longitude]) }]}
          />
        </div>

        {/* Sidebar Stats */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
          <h5 className="font-bold text-cyan-400 border-b border-slate-800 pb-2">Zone Boundary Specs</h5>

          <div className="space-y-2.5">
            <div className="flex justify-between text-slate-300">
              <span>Total Points:</span>
              <strong className="text-slate-200">{selectedCustomers.length}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Hull Points (Boundary):</span>
              <strong className="text-emerald-400">{hull.length}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Interior Points:</span>
              <strong className="text-purple-400">{selectedCustomers.length - hull.length}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Zone Area (approx):</span>
              <strong className="text-cyan-400">{areaVal.toFixed(1)} km²</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Perimeter (approx):</span>
              <strong className="text-purple-400">{periVal.toFixed(1)} km</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Centroid Lat:</span>
              <strong className="text-amber-400">{centroid.lat.toFixed(4)}° N</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Centroid Lng:</span>
              <strong className="text-amber-400">{centroid.lng.toFixed(4)}° E</strong>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <h6 className="font-semibold text-slate-300 text-[11px] mb-2">
              Customer Stops ({mockCustomerPoints.length})
            </h6>
            <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
              {mockCustomerPoints.map((c) => {
                const isHull = hull.some(h => h.id === c.id);
                const isIncluded = selectedIds.has(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCustomer(c.id)}
                    className={`w-full p-2 rounded text-left transition-all flex items-center justify-between ${
                      isIncluded
                        ? isHull
                          ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-300'
                          : 'bg-slate-900 border border-slate-700 text-slate-300'
                        : 'bg-slate-900/40 border border-slate-800 text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    <span className="font-bold truncate text-[11px]">{c.name}</span>
                    <span className={`text-[10px] font-mono shrink-0 ml-1 ${
                      !isIncluded ? 'text-slate-600' : isHull ? 'text-cyan-400' : 'text-slate-500'
                    }`}>
                      {!isIncluded ? 'OFF' : isHull ? 'HULL' : 'INTERIOR'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Complexity badge */}
          <div className="border-t border-slate-800 pt-3 space-y-1 text-[11px] text-slate-500">
            <div className="flex justify-between"><span>Time Complexity:</span><span className="text-cyan-400">O(N log N)</span></div>
            <div className="flex justify-between"><span>Space Complexity:</span><span className="text-purple-400">O(N)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
