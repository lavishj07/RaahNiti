import { Customer, GraphEdge, GraphNode, Zone } from '@/types';

export type HullPolygon = {
  id: string;
  name: string;
  color: string;
  positions: [number, number][];
};

export type FlowEdgeViz = {
  source: string;
  target: string;
  flow: number;
  capacity: number;
  utilization_pct: number;
  is_saturated: boolean;
  road_name?: string;
};

function cross(o: [number, number], a: [number, number], b: [number, number]) {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

/** Graham scan on (lng, lat) → closed Leaflet [lat, lng] ring */
export function convexHullLatLng(points: { latitude: number; longitude: number }[]): [number, number][] {
  const unique = points.map((p) => [p.longitude, p.latitude] as [number, number]);
  if (unique.length < 3) {
    return unique.map(([lng, lat]) => [lat, lng]);
  }
  unique.sort((a, b) => (a[1] === b[1] ? a[0] - b[0] : a[1] - b[1]));
  const pivot = unique[0];
  const rest = unique.slice(1).sort((a, b) => {
    const angA = Math.atan2(a[1] - pivot[1], a[0] - pivot[0]);
    const angB = Math.atan2(b[1] - pivot[1], b[0] - pivot[0]);
    return angA - angB || (a[0] - pivot[0]);
  });
  const sorted = [pivot, ...rest];
  const stack: [number, number][] = [];
  for (const p of sorted) {
    while (stack.length >= 2 && cross(stack[stack.length - 2], stack[stack.length - 1], p) <= 0) {
      stack.pop();
    }
    stack.push(p);
  }
  if (stack.length < 3) return stack.map(([lng, lat]) => [lat, lng]);
  return stack.map(([lng, lat]) => [lat, lng] as [number, number]);
}

export function buildZoneHulls(customers: Customer[], zones: Zone[]): HullPolygon[] {
  const byZone = new Map<string, Customer[]>();
  customers.forEach((c) => {
    const zid = c.zone_id || 'UNZONED';
    if (!byZone.has(zid)) byZone.set(zid, []);
    byZone.get(zid)!.push(c);
  });
  const zoneMeta = new Map(zones.map((z) => [z.id, z]));
  const hulls: HullPolygon[] = [];
  byZone.forEach((group, zid) => {
    const meta = zoneMeta.get(zid);
    const positions = convexHullLatLng(group);
    if (positions.length >= 3) {
      hulls.push({
        id: zid,
        name: meta?.name || zid,
        color: meta?.color || '#06B6D4',
        positions,
      });
    }
  });
  return hulls;
}

export function shortestPathIds(
  nodes: GraphNode[],
  edges: GraphEdge[],
  sourceId: string,
  targetId: string
): string[] {
  const ids = nodes.map((n) => n.id);
  if (!ids.includes(sourceId) || !ids.includes(targetId)) return [];
  const adj = new Map<string, { to: string; w: number }[]>();
  ids.forEach((id) => adj.set(id, []));
  edges.forEach((e) => {
    adj.get(e.source)?.push({ to: e.target, w: e.distance_km });
    if (e.bidirectional !== false) {
      adj.get(e.target)?.push({ to: e.source, w: e.distance_km });
    }
  });
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const q = new Set(ids);
  ids.forEach((id) => {
    dist.set(id, Infinity);
    prev.set(id, null);
  });
  dist.set(sourceId, 0);
  while (q.size) {
    let u: string | null = null;
    let best = Infinity;
    q.forEach((id) => {
      const d = dist.get(id) ?? Infinity;
      if (d < best) {
        best = d;
        u = id;
      }
    });
    if (u === null || best === Infinity) break;
    q.delete(u);
    if (u === targetId) break;
    for (const { to, w } of adj.get(u) || []) {
      const nd = best + w;
      if (nd < (dist.get(to) ?? Infinity)) {
        dist.set(to, nd);
        prev.set(to, u);
      }
    }
  }
  if ((dist.get(targetId) ?? Infinity) === Infinity) return [];
  const path: string[] = [];
  let cur: string | null = targetId;
  while (cur) {
    path.unshift(cur);
    cur = prev.get(cur) ?? null;
  }
  return path;
}

export function computeMaxFlowEdges(
  nodes: GraphNode[],
  edges: GraphEdge[],
  sourceId: string,
  sinkId: string
): FlowEdgeViz[] {
  const ids = nodes.map((n) => n.id);
  const idx = new Map(ids.map((id, i) => [id, i]));
  const V = ids.length;
  if (!idx.has(sourceId) || !idx.has(sinkId) || V === 0) {
    return edges.map((e) => ({
      source: e.source,
      target: e.target,
      flow: 0,
      capacity: e.capacity_vehicles_per_hr,
      utilization_pct: 0,
      is_saturated: false,
      road_name: e.road_name,
    }));
  }
  const cap: number[][] = Array.from({ length: V }, () => Array(V).fill(0));
  const flow: number[][] = Array.from({ length: V }, () => Array(V).fill(0));
  edges.forEach((e) => {
    const u = idx.get(e.source);
    const v = idx.get(e.target);
    if (u === undefined || v === undefined) return;
    cap[u][v] += e.capacity_vehicles_per_hr;
    cap[v][u] += e.capacity_vehicles_per_hr;
  });
  const s = idx.get(sourceId)!;
  const t = idx.get(sinkId)!;

  const bfsParent = (): number[] | null => {
    const parent = Array(V).fill(-1);
    parent[s] = s;
    const q = [s];
    while (q.length && parent[t] === -1) {
      const cur = q.shift()!;
      for (let nxt = 0; nxt < V; nxt++) {
        if (parent[nxt] === -1 && cap[cur][nxt] - flow[cur][nxt] > 1e-6) {
          parent[nxt] = cur;
          q.push(nxt);
        }
      }
    }
    return parent[t] === -1 ? null : parent;
  };

  let parent = bfsParent();
  while (parent) {
    let bottleneck = Infinity;
    let cur = t;
    while (cur !== s) {
      const p = parent[cur];
      bottleneck = Math.min(bottleneck, cap[p][cur] - flow[p][cur]);
      cur = p;
    }
    cur = t;
    while (cur !== s) {
      const p = parent[cur];
      flow[p][cur] += bottleneck;
      flow[cur][p] -= bottleneck;
      cur = p;
    }
    parent = bfsParent();
  }

  return edges.map((e) => {
    const u = idx.get(e.source);
    const v = idx.get(e.target);
    const capacity = e.capacity_vehicles_per_hr;
    const f = u !== undefined && v !== undefined ? Math.max(0, flow[u][v], flow[v][u]) : 0;
    const clamped = Math.min(f, capacity);
    const utilization = capacity > 0 ? (clamped / capacity) * 100 : 0;
    return {
      source: e.source,
      target: e.target,
      flow: Math.round(clamped),
      capacity,
      utilization_pct: Math.round(utilization * 10) / 10,
      is_saturated: capacity > 0 && Math.abs(clamped - capacity) < 1,
      road_name: e.road_name,
    };
  });
}
