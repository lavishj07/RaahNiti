import { Customer, GraphEdge, GraphNode, Warehouse, Vehicle, Zone, PackageItem } from '@/types';

export const DEMO_WAREHOUSE: Warehouse = {
  id: 'W1',
  name: 'RaahNiti Central Logistics Hub',
  address: 'Sector 21, Dwarka, New Delhi 110075',
  latitude: 28.5521,
  longitude: 77.0589,
  capacity_sqft: 75000,
};

export const DEMO_CUSTOMERS: Customer[] = [
  { id: 'C01', name: 'Apex Electronics Ltd', address: 'Inner Circle, Connaught Place, New Delhi', latitude: 28.6315, longitude: 77.2167, priority: 5, zone_id: 'Z_NORTH' },
  { id: 'C02', name: 'Apollo Medical Center', address: 'Mathura Road, Sarita Vihar, New Delhi', latitude: 28.5355, longitude: 77.2880, priority: 5, zone_id: 'Z_SOUTH' },
  { id: 'C03', name: 'CyberTech Systems Hub', address: 'DLF Cyber City, Sector 24, Gurugram', latitude: 28.4950, longitude: 77.0890, priority: 4, zone_id: 'Z_WEST' },
  { id: 'C04', name: 'Metro Retail Hypermarket', address: 'Sector 62, Electronic City, Noida', latitude: 28.6280, longitude: 77.3650, priority: 3, zone_id: 'Z_EAST' },
  { id: 'C05', name: 'Vasant Kunj General Hospital', address: 'Sector C, Vasant Kunj, New Delhi', latitude: 28.5280, longitude: 77.1550, priority: 5, zone_id: 'Z_SOUTH' },
  { id: 'C11', name: 'Rohini Sector 10 Hub', address: 'Sector 10, Rohini, New Delhi', latitude: 28.7180, longitude: 77.1150, priority: 3, zone_id: 'Z_NORTH' },
  { id: 'C13', name: 'Saket Select District', address: 'Press Enclave Marg, Saket, New Delhi', latitude: 28.5280, longitude: 77.2180, priority: 4, zone_id: 'Z_SOUTH' },
  { id: 'C22', name: 'Aerocity Hospitality Hub', address: 'Hospitality District, Aerocity, New Delhi', latitude: 28.5550, longitude: 77.1210, priority: 5, zone_id: 'Z_CENTRAL' },
  { id: 'C23', name: 'Faridabad Industrial S-31', address: 'Mathura Road, Sector 31, Faridabad', latitude: 28.4680, longitude: 77.3090, priority: 4, zone_id: 'Z_SOUTH' },
  { id: 'C30', name: 'IGI Cargo Terminal', address: 'NH-48, Near T3, New Delhi', latitude: 28.5620, longitude: 77.0930, priority: 5, zone_id: 'Z_CENTRAL' },
  { id: 'C33', name: 'Safdarjung Hospital Pharmacy', address: 'Ansari Nagar, Safdarjung Hospital, New Delhi', latitude: 28.5680, longitude: 77.2080, priority: 5, zone_id: 'Z_SOUTH' },
  { id: 'C34', name: 'Max Super Speciality Hospital', address: 'Press Enclave Road, Saket, New Delhi', latitude: 28.5275, longitude: 77.2115, priority: 5, zone_id: 'Z_SOUTH' },
  { id: 'C35', name: 'Fortis Hospital Noida', address: 'B-22, Sector 62, Noida', latitude: 28.6205, longitude: 77.3640, priority: 5, zone_id: 'Z_EAST' },
  { id: 'C36', name: 'MG Road Electronics Bazaar', address: '123 MG Road, Gurgaon Sector 14', latitude: 28.4740, longitude: 77.0800, priority: 3, zone_id: 'Z_WEST' },
  { id: 'C37', name: 'Connaught Place Flagship Store', address: 'A-12 Inner Circle, Connaught Place, New Delhi', latitude: 28.6328, longitude: 77.2197, priority: 4, zone_id: 'Z_NORTH' },
  { id: 'C38', name: 'AIIMS Trauma Centre', address: 'Ansari Nagar East, AIIMS, New Delhi', latitude: 28.5665, longitude: 77.2110, priority: 5, zone_id: 'Z_SOUTH' },
  { id: 'C40', name: 'Cyber Hub Gurugram Retail', address: 'DLF Cyber Hub, Cyber City, Gurugram', latitude: 28.4948, longitude: 77.0885, priority: 4, zone_id: 'Z_WEST' },
];

export const DEMO_VEHICLES: Vehicle[] = [
  { id: 'V01', vehicle_number: 'DL-01-EV-4091', driver_name: 'Rajesh Kumar', payload_capacity_kg: 300, current_load_kg: 228, status: 'ACTIVE', current_latitude: 28.6100, current_longitude: 77.1800 },
  { id: 'V02', vehicle_number: 'DL-03-EV-8812', driver_name: 'Amit Singh', payload_capacity_kg: 250, current_load_kg: 238, status: 'ACTIVE', current_latitude: 28.5400, current_longitude: 77.2400 },
  { id: 'V07', vehicle_number: 'DL-22-EV-3310', driver_name: 'Arjun Mehta', payload_capacity_kg: 300, current_load_kg: 0, status: 'IDLE', current_latitude: 28.5521, current_longitude: 77.0589 },
  { id: 'V08', vehicle_number: 'HR-09-GT-9981', driver_name: 'Deepak Rawat', payload_capacity_kg: 350, current_load_kg: 120, status: 'DELAYED', current_latitude: 28.5710, current_longitude: 77.2580 },
];

export const DEMO_NODES: GraphNode[] = [
  { id: 'W1', label: 'Dwarka Central Warehouse', type: 'WAREHOUSE', latitude: 28.5521, longitude: 77.0589 },
  { id: 'N01', label: 'Dhaula Kuan Junction', type: 'INTERSECTION', latitude: 28.5920, longitude: 77.1620 },
  { id: 'N02', label: 'AIIMS Flyover Hub', type: 'INTERSECTION', latitude: 28.5670, longitude: 77.2100 },
  { id: 'N03', label: 'Punjabi Bagh Cloverleaf', type: 'INTERSECTION', latitude: 28.6670, longitude: 77.1240 },
  { id: 'N04', label: 'Iffco Chowk Expressway', type: 'INTERSECTION', latitude: 28.4720, longitude: 77.0720 },
  { id: 'N05', label: 'Rajiv Chowk (CP)', type: 'INTERSECTION', latitude: 28.6315, longitude: 77.2167 },
  { id: 'N06', label: 'Noida Toll Bridge', type: 'INTERSECTION', latitude: 28.5630, longitude: 77.3020 },
  { id: 'N07', label: 'Akshardham Corridor', type: 'INTERSECTION', latitude: 28.6120, longitude: 77.2780 },
  { id: 'N08', label: 'Ashram Chowk', type: 'INTERSECTION', latitude: 28.5710, longitude: 77.2580 },
  { id: 'N09', label: 'Rajouri Garden Junction', type: 'INTERSECTION', latitude: 28.6490, longitude: 77.1220 },
  { id: 'N10', label: 'ISBT Kashmiri Gate', type: 'INTERSECTION', latitude: 28.6670, longitude: 77.2280 },
  { id: 'N11', label: 'Rohtak Road Flyover', type: 'INTERSECTION', latitude: 28.6900, longitude: 77.1510 },
  { id: 'N12', label: 'Nehru Place Interchange', type: 'INTERSECTION', latitude: 28.5494, longitude: 77.2509 },
  { id: 'N13', label: 'DND Kalindi Crossing', type: 'INTERSECTION', latitude: 28.5530, longitude: 77.2940 },
  { id: 'HUB_SOUTH', label: 'Okhla Regional Hub (Sink)', type: 'HUB', latitude: 28.5360, longitude: 77.2710 },
];

export const DEMO_EDGES: GraphEdge[] = [
  { id: 'E01', source: 'W1', target: 'N01', road_name: 'NH-48 Dwarka Expressway', distance_km: 11.5, capacity_vehicles_per_hr: 2500, bidirectional: true },
  { id: 'E02', source: 'W1', target: 'N03', road_name: 'Outer Ring Road North', distance_km: 14.0, capacity_vehicles_per_hr: 1800, bidirectional: true },
  { id: 'E03', source: 'W1', target: 'N04', road_name: 'Gurugram Link Road', distance_km: 9.2, capacity_vehicles_per_hr: 2200, bidirectional: true },
  { id: 'E04', source: 'N01', target: 'N02', road_name: 'Ring Road South', distance_km: 6.8, capacity_vehicles_per_hr: 1500, bidirectional: true },
  { id: 'E05', source: 'N01', target: 'N05', road_name: 'Vande Mataram Marg', distance_km: 8.0, capacity_vehicles_per_hr: 1400, bidirectional: true },
  { id: 'E06', source: 'N02', target: 'N08', road_name: 'Inner Ring Road Ashram', distance_km: 5.4, capacity_vehicles_per_hr: 1200, bidirectional: true },
  { id: 'E07', source: 'N02', target: 'HUB_SOUTH', road_name: 'Okhla Estate Road', distance_km: 4.5, capacity_vehicles_per_hr: 1600, bidirectional: true },
  { id: 'E08', source: 'N03', target: 'N09', road_name: 'Najafgarh Road Corridor', distance_km: 3.2, capacity_vehicles_per_hr: 1100, bidirectional: true },
  { id: 'E09', source: 'N03', target: 'N10', road_name: 'Rohtak Road Expressway', distance_km: 12.0, capacity_vehicles_per_hr: 1700, bidirectional: true },
  { id: 'E10', source: 'N05', target: 'N10', road_name: 'Deen Dayal Upadhyaya Marg', distance_km: 4.1, capacity_vehicles_per_hr: 1300, bidirectional: true },
  { id: 'E11', source: 'N05', target: 'N07', road_name: 'Vikas Marg East', distance_km: 7.5, capacity_vehicles_per_hr: 1000, bidirectional: true },
  { id: 'E12', source: 'N07', target: 'N06', road_name: 'Mayur Vihar Highway', distance_km: 5.8, capacity_vehicles_per_hr: 1900, bidirectional: true },
  { id: 'E13', source: 'N06', target: 'HUB_SOUTH', road_name: 'DND Flyway Expressway', distance_km: 6.2, capacity_vehicles_per_hr: 2800, bidirectional: true },
  { id: 'E14', source: 'N08', target: 'HUB_SOUTH', road_name: 'Mathura Road Bottleneck', distance_km: 3.8, capacity_vehicles_per_hr: 800, bidirectional: true },
  { id: 'E15', source: 'N12', target: 'HUB_SOUTH', road_name: 'Nehru Place Bypass Road', distance_km: 2.9, capacity_vehicles_per_hr: 1050, bidirectional: true },
  { id: 'E16', source: 'N02', target: 'N12', road_name: 'Ring Road Nehru Connector', distance_km: 4.2, capacity_vehicles_per_hr: 1350, bidirectional: true },
  { id: 'E17', source: 'N13', target: 'HUB_SOUTH', road_name: 'Kalindi Kunj Southern Bypass', distance_km: 5.1, capacity_vehicles_per_hr: 1100, bidirectional: true },
  { id: 'E18', source: 'N06', target: 'N13', road_name: 'Noida-Greater Noida Expressway', distance_km: 4.7, capacity_vehicles_per_hr: 2000, bidirectional: true },
  { id: 'E19', source: 'N03', target: 'N11', road_name: 'Pitampura Road Connector', distance_km: 3.5, capacity_vehicles_per_hr: 1200, bidirectional: true },
  { id: 'E20', source: 'N11', target: 'N10', road_name: 'GTK Road Extension', distance_km: 4.0, capacity_vehicles_per_hr: 950, bidirectional: true },
];

export const DEMO_ZONES: Zone[] = [
  { id: 'Z_NORTH', name: 'North Delhi Zone', color: '#3B82F6', centroid_lat: 28.6900, centroid_lng: 77.1600, area_sq_km: 85.4, customer_count: 8 },
  { id: 'Z_SOUTH', name: 'South & Faridabad Zone', color: '#10B981', centroid_lat: 28.5200, centroid_lng: 77.2600, area_sq_km: 138.0, customer_count: 9 },
  { id: 'Z_EAST', name: 'East Trans-Yamuna Zone', color: '#8B5CF6', centroid_lat: 28.6200, centroid_lng: 77.3500, area_sq_km: 95.8, customer_count: 6 },
  { id: 'Z_WEST', name: 'West Cyber & Gurugram Zone', color: '#F59E0B', centroid_lat: 28.5000, centroid_lng: 77.0700, area_sq_km: 120.2, customer_count: 5 },
  { id: 'Z_CENTRAL', name: 'Central Airport Corridor', color: '#EF4444', centroid_lat: 28.5550, centroid_lng: 77.1000, area_sq_km: 42.3, customer_count: 4 },
];

export const DEMO_PACKAGES: PackageItem[] = [
  { id: 'PKG-133', tracking_number: 'RN-HOSP-01', customer_id: 'C33', weight_kg: 7.5, value_usd: 4100, priority: 5, status: 'PENDING' },
  { id: 'PKG-134', tracking_number: 'RN-HOSP-02', customer_id: 'C34', weight_kg: 6.0, value_usd: 3900, priority: 5, status: 'PENDING' },
  { id: 'PKG-136', tracking_number: 'RN-MG-4401', customer_id: 'C36', weight_kg: 21.0, value_usd: 1450, priority: 3, status: 'PENDING' },
  { id: 'PKG-137', tracking_number: 'RN-CP-1188', customer_id: 'C37', weight_kg: 13.0, value_usd: 2200, priority: 4, status: 'PENDING' },
  { id: 'PKG-103', tracking_number: 'RN-98216', customer_id: 'C03', weight_kg: 28.0, value_usd: 850, priority: 4, status: 'PENDING' },
];
