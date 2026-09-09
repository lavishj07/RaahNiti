'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { Warehouse, Customer, Vehicle, GraphNode, GraphEdge, Zone } from '@/types';

// Fix Leaflet Default Icon path issues in Next.js
const warehouseIcon = L.divIcon({
  className: 'custom-warehouse-marker',
  html: `<div style="background:#06B6D4; width:28px; height:28px; border-radius:50%; border:3px solid #FFFFFF; box-shadow: 0 0 15px #06B6D4; display:flex; align-items:center; justify-content:center; font-weight:bold; color:white; font-size:12px;">W</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const customerIcon = (priority: number) => {
  const color = priority >= 5 ? '#EF4444' : priority >= 4 ? '#F59E0B' : '#3B82F6';
  return L.divIcon({
    className: 'custom-customer-marker',
    html: `<div style="background:${color}; width:16px; height:16px; border-radius:50%; border:2px solid #FFFFFF; box-shadow: 0 0 8px ${color};"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const vehicleIcon = L.divIcon({
  className: 'custom-vehicle-marker',
  html: `<div style="background:#10B981; width:22px; height:22px; border-radius:6px; border:2px solid #FFFFFF; box-shadow: 0 0 12px #10B981; display:flex; align-items:center; justify-content:center; color:white; font-size:10px; font-weight:bold;">V</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const nodeIcon = L.divIcon({
  className: 'custom-node-marker',
  html: `<div style="background:#8B5CF6; width:12px; height:12px; border-radius:50%; border:1.5px solid #FFFFFF;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

interface InteractiveMapProps {
  mode?: 'normal' | 'zone' | 'network' | 'flow' | 'shortest-path';
  warehouse?: Warehouse | null;
  customers?: Customer[];
  vehicles?: Vehicle[];
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  zones?: Zone[];
  hullPoints?: any[];
  shortestPathNodes?: string[];
  flowEdges?: any[];
  onSelectCustomer?: (customer: Customer) => void;
  onSelectEdge?: (edge: any) => void;
}

export default function InteractiveMap({
  mode = 'normal',
  warehouse,
  customers = [],
  vehicles = [],
  nodes = [],
  edges = [],
  zones = [],
  hullPoints = [],
  shortestPathNodes = [],
  flowEdges = [],
  onSelectCustomer,
  onSelectEdge,
}: InteractiveMapProps) {
  const defaultCenter: [number, number] = warehouse
    ? [warehouse.latitude, warehouse.longitude]
    : [28.5800, 77.1800]; // Delhi NCR default center

  // Prepare Hull Polygon coordinates for Graham's Scan mode
  const hullCoords: [number, number][] = hullPoints.map((p) => [
    p.lat !== undefined ? p.lat : p.y,
    p.lng !== undefined ? p.lng : p.x,
  ]);

  // Map node IDs to Lat/Lng for quick polyline rendering
  const nodeMap = new Map<string, [number, number]>();
  if (warehouse) {
    nodeMap.set(warehouse.id, [warehouse.latitude, warehouse.longitude]);
  }
  nodes.forEach((n) => nodeMap.set(n.id, [n.latitude, n.longitude]));
  customers.forEach((c) => nodeMap.set(c.id, [c.latitude, c.longitude]));

  // Build shortest path polylines if active
  const shortestPathCoords: [number, number][] = shortestPathNodes
    .map((id) => nodeMap.get(id))
    .filter((coord): coord is [number, number] => coord !== undefined);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl dark-map-tiles">
      <MapContainer
        center={defaultCenter}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Warehouse Marker */}
        {warehouse && (
          <Marker position={[warehouse.latitude, warehouse.longitude]} icon={warehouseIcon}>
            <Popup>
              <div className="font-mono text-xs p-1 space-y-1">
                <p className="font-bold text-cyan-400">{warehouse.name}</p>
                <p className="text-slate-300">{warehouse.address}</p>
                <p className="text-slate-400">Capacity: {warehouse.capacity_sqft.toLocaleString()} sqft</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Customer Markers (Show in Normal, Zone, Shortest Path modes) */}
        {(mode === 'normal' || mode === 'zone' || mode === 'shortest-path') &&
          customers.map((c) => (
            <Marker
              key={c.id}
              position={[c.latitude, c.longitude]}
              icon={customerIcon(c.priority)}
              eventHandlers={{
                click: () => onSelectCustomer && onSelectCustomer(c),
              }}
            >
              <Popup>
                <div className="font-mono text-xs p-1 space-y-1">
                  <p className="font-bold text-slate-100">{c.name}</p>
                  <p className="text-slate-300 text-[11px]">{c.address}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Priority: {c.priority}/5</span>
                    <span className="text-cyan-400">{c.zone_id || 'Zone A'}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Vehicle Markers */}
        {(mode === 'normal' || mode === 'shortest-path') &&
          vehicles.map((v) => (
            <Marker key={v.id} position={[v.current_latitude, v.current_longitude]} icon={vehicleIcon}>
              <Popup>
                <div className="font-mono text-xs p-1 space-y-1">
                  <p className="font-bold text-emerald-400">{v.vehicle_number} ({v.driver_name})</p>
                  <p className="text-slate-300">Status: {v.status}</p>
                  <p className="text-slate-400">Payload: {v.current_load_kg} / {v.payload_capacity_kg} kg</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Graham Scan Convex Hull Polygon */}
        {mode === 'zone' && hullCoords.length >= 3 && (
          <Polygon
            positions={hullCoords}
            pathOptions={{
              color: '#06B6D4',
              fillColor: '#06B6D4',
              fillOpacity: 0.25,
              weight: 3,
              dashArray: '6, 6',
            }}
          />
        )}

        {/* Graph Nodes & Edges (Network Analysis / Flow Mode) */}
        {(mode === 'network' || mode === 'flow') && (
          <>
            {nodes.map((n) => (
              <Marker key={n.id} position={[n.latitude, n.longitude]} icon={nodeIcon}>
                <Popup>
                  <div className="font-mono text-xs p-1">
                    <p className="font-bold text-purple-300">{n.label}</p>
                    <p className="text-[10px] text-slate-400">Type: {n.type}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Base Graph Edges */}
            {edges.map((e) => {
              const srcCoord = nodeMap.get(e.source);
              const tgtCoord = nodeMap.get(e.target);
              if (!srcCoord || !tgtCoord) return null;

              // Check flow saturation
              const flowDetail = flowEdges.find(
                (fe) => fe.source === e.source && fe.target === e.target
              );
              const isSaturated = flowDetail?.is_saturated;
              const edgeColor = isSaturated ? '#EF4444' : mode === 'flow' ? '#10B981' : '#64748B';

              return (
                <Polyline
                  key={e.id}
                  positions={[srcCoord, tgtCoord]}
                  pathOptions={{
                    color: edgeColor,
                    weight: isSaturated ? 5 : 3,
                    opacity: 0.8,
                  }}
                  eventHandlers={{
                    click: () => onSelectEdge && onSelectEdge({ ...e, flowDetail }),
                  }}
                >
                  <Popup>
                    <div className="font-mono text-xs p-1 space-y-1">
                      <p className="font-bold text-slate-100">{e.road_name}</p>
                      <p className="text-slate-300">Distance: {e.distance_km} km</p>
                      <p className="text-slate-300">Max Capacity: {e.capacity_vehicles_per_hr} veh/hr</p>
                      {flowDetail && (
                        <p className={isSaturated ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                          Current Flow: {flowDetail.flow} veh/hr {isSaturated ? '(SATURATED BOTTLENECK)' : ''}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Polyline>
              );
            })}
          </>
        )}

        {/* Floyd-Warshall Shortest Path Highlight */}
        {mode === 'shortest-path' && shortestPathCoords.length >= 2 && (
          <Polyline
            positions={shortestPathCoords}
            pathOptions={{
              color: '#F59E0B',
              weight: 6,
              opacity: 0.95,
            }}
          />
        )}
      </MapContainer>

      {/* Map Mode Badge Overlay */}
      <div className="absolute top-4 left-4 z-10 font-mono text-xs px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-700 text-slate-200 backdrop-blur-md shadow-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        <span className="uppercase font-semibold tracking-wider text-cyan-400">Mode: {mode}</span>
      </div>
    </div>
  );
}
