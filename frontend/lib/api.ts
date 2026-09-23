import {
  Warehouse, Customer, PackageItem, Vehicle, GraphNode, GraphEdge, Zone, DashboardStats,
  KMPResult, KnapsackResult, GrahamScanResult, FloydWarshallResult, EdmondsKarpResult,
  RecommendationsResult
} from '@/types';

// In browser production on Vercel, empty string '' means same-origin relative fetch (/api/*)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL !== undefined
  ? process.env.NEXT_PUBLIC_API_URL
  : (typeof window !== 'undefined' ? '' : 'http://127.0.0.1:8000');

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const fullUrl = `${API_BASE_URL}${url}`;
    const res = await fetch(fullUrl, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Failed API request to ${url}:`, err);
    throw err;
  }
}

export const apiService = {
  // Data Endpoints
  getWarehouse: () => fetchJson<Warehouse>('/api/warehouse'),
  getCustomers: () => fetchJson<Customer[]>('/api/customers'),
  getPackages: () => fetchJson<PackageItem[]>('/api/packages'),
  getVehicles: () => fetchJson<Vehicle[]>('/api/vehicles'),
  getNetwork: () => fetchJson<{ nodes: GraphNode[]; edges: GraphEdge[] }>('/api/network'),
  getZones: () => fetchJson<Zone[]>('/api/zones'),
  getStats: () => fetchJson<DashboardStats>('/api/stats'),

  // Algorithm Endpoints
  runKMP: (pattern: string, text?: string) =>
    fetchJson<KMPResult>('/api/algorithms/kmp', {
      method: 'POST',
      body: JSON.stringify({ pattern, text: text ?? null }),
    }),

  runKnapsack: (capacity: number, items?: any[]) =>
    fetchJson<KnapsackResult>('/api/algorithms/knapsack', {
      method: 'POST',
      body: JSON.stringify({ capacity, items }),
    }),

  runGrahamScan: (points?: any[]) =>
    fetchJson<GrahamScanResult>('/api/algorithms/graham-scan', {
      method: 'POST',
      body: JSON.stringify({ points }),
    }),

  runFloydWarshall: (sourceId?: string, targetId?: string) =>
    fetchJson<FloydWarshallResult>('/api/algorithms/floyd-warshall', {
      method: 'POST',
      body: JSON.stringify({ source_id: sourceId, target_id: targetId }),
    }),

  runEdmondsKarp: (sourceId: string = 'W1', sinkId: string = 'HUB_SOUTH') =>
    fetchJson<EdmondsKarpResult>('/api/algorithms/edmonds-karp', {
      method: 'POST',
      body: JSON.stringify({ source_id: sourceId, sink_id: sinkId }),
    }),

  getRecommendations: () =>
    fetchJson<RecommendationsResult>('/api/recommendations'),
};
