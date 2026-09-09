export interface Warehouse {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity_sqft: number;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  priority: number;
  zone_id?: string;
}

export interface PackageItem {
  id: string;
  tracking_number: string;
  customer_id: string;
  weight_kg: number;
  value_usd: number;
  priority: number;
  status: 'PENDING' | 'LOADED' | 'DELIVERED';
  assigned_vehicle_id?: string;
}

export interface Vehicle {
  id: string;
  vehicle_number: string;
  driver_name: string;
  payload_capacity_kg: number;
  current_load_kg: number;
  status: 'ACTIVE' | 'IDLE' | 'LOADING' | 'DELAYED' | 'MAINTENANCE';
  current_latitude: number;
  current_longitude: number;
  current_route?: string; // JSON string of node IDs
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'WAREHOUSE' | 'INTERSECTION' | 'HUB' | 'CUSTOMER_STOP';
  latitude: number;
  longitude: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  road_name: string;
  distance_km: number;
  capacity_vehicles_per_hr: number;
  bidirectional: boolean;
}

export interface Zone {
  id: string;
  name: string;
  color: string;
  centroid_lat: number;
  centroid_lng: number;
  area_sq_km: number;
  customer_count: number;
}

export interface DashboardStats {
  active_deliveries: number;
  active_vehicles: number;
  pending_packages: number;
  total_customers: number;
  fleet_utilization_pct: number;
  network_bottlenecks_detected: number;
  average_delivery_eta_mins: number;
  total_optimized_distance_km: number;
}

// Algorithm Interfaces
export interface KMPResult {
  pattern: string;
  text: string;
  matches: number[];
  lps: number[];
  comparisons: number;
  lps_steps: any[];
  search_steps: any[];
  time_complexity: string;
  space_complexity: string;
  matching_customers?: any[];
  algorithm_info?: any;
}

export interface KnapsackResult {
  capacity: number;
  total_items: number;
  selected_items: any[];
  rejected_items: any[];
  total_weight: number;
  total_value: number;
  total_priority: number;
  remaining_capacity: number;
  utilization_percentage: number;
  dp_table: number[][];
  dp_steps: any[];
  time_complexity: string;
  space_complexity: string;
  algorithm_info?: any;
}

export interface GrahamScanResult {
  pivot?: any;
  hull_points: any[];
  interior_points: any[];
  hull_edges: any[];
  hull_count: number;
  total_points: number;
  perimeter: number;
  area: number;
  centroid: { x: number; y: number };
  steps: any[];
  time_complexity: string;
  space_complexity: string;
  algorithm_info?: any;
}

export interface FloydWarshallResult {
  floyd_warshall: {
    total_nodes: number;
    distance_matrix: Record<string, Record<string, number>>;
    matrix_snapshots: any[];
    time_complexity: string;
    space_complexity: string;
    algorithm_info?: any;
  };
  nodes: any[];
  edges: any[];
  selected_shortest_path?: any;
}

export interface EdmondsKarpResult {
  source: string;
  sink: string;
  max_flow: number;
  augmenting_paths: any[];
  total_augmenting_paths: number;
  edges: any[];
  bottlenecks: any[];
  bottleneck_count: number;
  time_complexity: string;
  space_complexity: string;
  algorithm_info?: any;
}
