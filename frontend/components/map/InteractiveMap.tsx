'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Warehouse, Customer, Vehicle, GraphNode, GraphEdge, Zone } from '@/types';
import type { HullPolygon, FlowEdgeViz } from '@/lib/mapLayers';

const warehouseIcon = L.divIcon({
  className: 'custom-warehouse-marker',
  html: `<div style="background:#06B6D4; width:28px; height:28px; border-radius:50%; border:3px solid #FFFFFF; box-shadow: 0 0 15px #06B6D4; display:flex; align-items:center; justify-content:center; font-weight:bold; color:white; font-size:12px;">W</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const customerIcon = (priority: number, highlighted = false) => {
  const color = highlighted ? '#F472B6' : priority >= 5 ? '#EF4444' : priority >= 4 ? '#F59E0B' : '#3B82F6';
  const size = highlighted ? 22 : 16;
  return L.divIcon({
    className: 'custom-customer-marker',
    html: `<div style="background:${color}; width:${size}px; height:${size}px; border-radius:50%; border:2px solid #FFFFFF; box-shadow: 0 0 8px ${color};"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const vehicleIcon = L.divIcon({
  className: 'custom-vehicle-marker',
  html: `<div style="background:#10B981; width:22px; height:22px; border-radius:6px; border:2px solid #FFFFFF; box-shadow: 0 0 12px #10B981; display:flex; align-items:center; justify-content:center; color:white; font-size:10px; font-weight:bold;">V</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const nodeIcon = (kind: string) => {
  const color = kind === 'WAREHOUSE' ? '#06B6D4' : kind === 'HUB' ? '#F43F5E' : '#A855F7';
  return L.divIcon({
    className: 'custom-node-marker',
    html: `<div style="background:${color}; width:14px; height:14px; border-radius:50%; border:1.5px solid #FFFFFF; box-shadow:0 0 8px ${color};"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

const TILES: Record<string, { url: string; attribution: string }> = {
  normal: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  },
  zone: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  },
  network: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  },
  flow: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  },
  'shortest-path': {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  },
};

const MODE_LABEL: Record<string, string> = {
  normal: 'Operations overlay',
  zone: 'Graham Scan convex zones',
  network: 'Road graph (nodes + edges)',
  flow: 'Edmonds-Karp max flow',
  'shortest-path': 'Floyd-Warshall shortest path',
};

interface InteractiveMapProps {
  mode?: 'normal' | 'zone' | 'network' | 'flow' | 'shortest-path';
  warehouse?: Warehouse | null;
  customers?: Customer[];
  vehicles?: Vehicle[];
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  zones?: Zone[];
  zoneHulls?: HullPolygon[];
  shortestPathNodes?: string[];
  flowEdges?: FlowEdgeViz[];
  highlightedCustomerIds?: string[];
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
  zoneHulls = [],
  shortestPathNodes = [],
  flowEdges = [],
  highlightedCustomerIds = [],
  onSelectCustomer,
  onSelectEdge,
}: InteractiveMapProps) {
  const defaultCenter: [number, number] = warehouse
    ? [warehouse.latitude, warehouse.longitude]
    : [28.5800, 77.1800];

  const nodeMap = new Map<string, [number, number]>();
  if (warehouse) {
    nodeMap.set(warehouse.id, [warehouse.latitude, warehouse.longitude]);
  }
  nodes.forEach((n) => nodeMap.set(n.id, [n.latitude, n.longitude]));
  customers.forEach((c) => nodeMap.set(c.id, [c.latitude, c.longitude]));

  const shortestPathCoords: [number, number][] = shortestPathNodes
    .map((id) => nodeMap.get(id))
    .filter((coord): coord is [number, number] => coord !== undefined);

  const pathSet = new Set(shortestPathNodes);
  const tiles = TILES[mode] || TILES.normal;
  const highlightSet = new Set(highlightedCustomerIds);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl dark-map-tiles">
      <MapContainer
        center={defaultCenter}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer key={mode} attribution={tiles.attribution} url={tiles.url} />

        {warehouse && (
          <Marker position={[warehouse.latitude, warehouse.longitude]} icon={warehouseIcon}>
            <Popup>
              <div className="font-mono text-xs p-1 space-y-1">
                <p className="font-bold text-cyan-400">{warehouse.name}</p>
                <p className="text-slate-300">{warehouse.address}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {mode === 'normal' &&
          customers.map((c) => (
            <Marker
              key={c.id}
              position={[c.latitude, c.longitude]}
              icon={customerIcon(c.priority, highlightSet.has(c.id))}
              eventHandlers={{ click: () => onSelectCustomer && onSelectCustomer(c) }}
            >
              <Popup>
                <div className="font-mono text-xs p-1 space-y-1">
                  <p className="font-bold text-slate-100">{c.name}</p>
                  <p className="text-slate-300 text-[11px]">{c.address}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {mode === 'normal' &&
          vehicles.map((v) => (
            <Marker key={v.id} position={[v.current_latitude, v.current_longitude]} icon={vehicleIcon}>
              <Popup>
                <div className="font-mono text-xs p-1 space-y-1">
                  <p className="font-bold text-emerald-400">{v.vehicle_number} ({v.driver_name})</p>
                  <p className="text-slate-300">Status: {v.status}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {mode === 'zone' &&
          zoneHulls.map((hull) => (
            <Polygon
              key={hull.id}
              positions={hull.positions}
              pathOptions={{
                color: hull.color,
                fillColor: hull.color,
                fillOpacity: 0.28,
                weight: 3,
              }}
            >
              <Tooltip sticky className="font-mono text-xs">
                {hull.name}
              </Tooltip>
            </Polygon>
          ))}

        {mode === 'zone' &&
          zones.map((z) => (
            <Circle
              key={`centroid-${z.id}`}
              center={[z.centroid_lat, z.centroid_lng]}
              radius={1800}
              pathOptions={{ color: z.color, fillColor: z.color, fillOpacity: 0.08, weight: 1, dashArray: '4 6' }}
            >
              <Tooltip direction="center" permanent className="font-mono text-[10px]">
                {z.name}
              </Tooltip>
            </Circle>
          ))}

        {mode === 'zone' &&
          customers.map((c) => (
            <Marker
              key={c.id}
              position={[c.latitude, c.longitude]}
              icon={customerIcon(c.priority, highlightSet.has(c.id))}
              eventHandlers={{ click: () => onSelectCustomer && onSelectCustomer(c) }}
            >
              <Popup>
                <div className="font-mono text-xs p-1">
                  <p className="font-bold">{c.name}</p>
                  <p>{c.zone_id}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {(mode === 'network' || mode === 'flow' || mode === 'shortest-path') &&
          nodes.map((n) => (
            <Marker key={n.id} position={[n.latitude, n.longitude]} icon={nodeIcon(n.type)}>
              <Popup>
                <div className="font-mono text-xs p-1">
                  <p className="font-bold text-purple-300">{n.label}</p>
                  <p className="text-[10px] text-slate-400">{n.id} · {n.type}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {mode === 'network' &&
          edges.map((e) => {
            const srcCoord = nodeMap.get(e.source);
            const tgtCoord = nodeMap.get(e.target);
            if (!srcCoord || !tgtCoord) return null;
            return (
              <Polyline
                key={e.id}
                positions={[srcCoord, tgtCoord]}
                pathOptions={{ color: '#6366F1', weight: 3, opacity: 0.85 }}
              >
                <Popup>
                  <div className="font-mono text-xs p-1 space-y-1">
                    <p className="font-bold">{e.road_name}</p>
                    <p>{e.distance_km} km · {e.capacity_vehicles_per_hr} veh/hr</p>
                  </div>
                </Popup>
              </Polyline>
            );
          })}

        {mode === 'flow' &&
          edges.map((e) => {
            const srcCoord = nodeMap.get(e.source);
            const tgtCoord = nodeMap.get(e.target);
            if (!srcCoord || !tgtCoord) return null;
            const flowDetail = flowEdges.find(
              (fe) =>
                (fe.source === e.source && fe.target === e.target) ||
                (fe.source === e.target && fe.target === e.source)
            );
            const util = flowDetail?.utilization_pct ?? 0;
            const isSaturated = flowDetail?.is_saturated;
            const edgeColor = isSaturated ? '#EF4444' : util > 60 ? '#F59E0B' : '#22D3EE';
            return (
              <Polyline
                key={e.id}
                positions={[srcCoord, tgtCoord]}
                pathOptions={{
                  color: edgeColor,
                  weight: isSaturated ? 7 : 4,
                  opacity: 0.95,
                }}
                eventHandlers={{ click: () => onSelectEdge && onSelectEdge({ ...e, flowDetail }) }}
              >
                <Popup>
                  <div className="font-mono text-xs p-1 space-y-1">
                    <p className="font-bold">{e.road_name}</p>
                    <p>Capacity: {e.capacity_vehicles_per_hr} veh/hr</p>
                    {flowDetail && (
                      <p className={isSaturated ? 'text-red-400 font-bold' : 'text-cyan-400'}>
                        Flow {flowDetail.flow} · {flowDetail.utilization_pct}%
                        {isSaturated ? ' SATURATED' : ''}
                      </p>
                    )}
                  </div>
                </Popup>
              </Polyline>
            );
          })}

        {mode === 'shortest-path' &&
          edges.map((e) => {
            const srcCoord = nodeMap.get(e.source);
            const tgtCoord = nodeMap.get(e.target);
            if (!srcCoord || !tgtCoord) return null;
            const onPath =
              pathSet.has(e.source) &&
              pathSet.has(e.target) &&
              Math.abs(shortestPathNodes.indexOf(e.source) - shortestPathNodes.indexOf(e.target)) === 1;
            return (
              <Polyline
                key={e.id}
                positions={[srcCoord, tgtCoord]}
                pathOptions={{
                  color: onPath ? '#F59E0B' : '#94A3B8',
                  weight: onPath ? 7 : 2,
                  opacity: onPath ? 1 : 0.35,
                  dashArray: onPath ? undefined : '6 8',
                }}
              />
            );
          })}

        {mode === 'shortest-path' && shortestPathCoords.length >= 2 && (
          <Polyline
            positions={shortestPathCoords}
            pathOptions={{ color: '#F59E0B', weight: 8, opacity: 0.95 }}
          >
            <Tooltip sticky>W1 → HUB_SOUTH shortest path</Tooltip>
          </Polyline>
        )}
      </MapContainer>

      <div className="absolute top-4 left-4 z-[400] font-mono text-xs px-3 py-2 rounded-lg bg-slate-950/85 border border-slate-700 text-slate-200 backdrop-blur-md shadow-lg space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="uppercase font-semibold tracking-wider text-cyan-400">{MODE_LABEL[mode]}</span>
        </div>
        {mode === 'flow' && (
          <p className="text-[10px] text-slate-400">Cyan = residual · Amber = busy · Red = saturated bottleneck</p>
        )}
        {mode === 'zone' && (
          <p className="text-[10px] text-slate-400">{zoneHulls.length} convex hulls from customer clusters</p>
        )}
        {mode === 'shortest-path' && (
          <p className="text-[10px] text-slate-400">
            {shortestPathNodes.length ? shortestPathNodes.join(' → ') : 'Computing path W1 → HUB_SOUTH'}
          </p>
        )}
      </div>
    </div>
  );
}
