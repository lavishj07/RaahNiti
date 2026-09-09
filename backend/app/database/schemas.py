from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Entity Schemas
class WarehouseSchema(BaseModel):
    id: str
    name: str
    address: str
    latitude: float
    longitude: float
    capacity_sqft: int

class CustomerSchema(BaseModel):
    id: str
    name: str
    address: str
    latitude: float
    longitude: float
    priority: int
    zone_id: Optional[str] = None

class PackageSchema(BaseModel):
    id: str
    tracking_number: str
    customer_id: str
    weight_kg: float
    value_usd: float
    priority: int
    status: str
    assigned_vehicle_id: Optional[str] = None

class VehicleSchema(BaseModel):
    id: str
    vehicle_number: str
    driver_name: str
    payload_capacity_kg: float
    current_load_kg: float
    status: str
    current_latitude: float
    current_longitude: float
    current_route: Optional[str] = None

class GraphNodeSchema(BaseModel):
    id: str
    label: str
    type: str
    latitude: float
    longitude: float

class GraphEdgeSchema(BaseModel):
    id: str
    source: str
    target: str
    road_name: str
    distance_km: float
    capacity_vehicles_per_hr: float
    bidirectional: bool = True

class ZoneSchema(BaseModel):
    id: str
    name: str
    color: str
    centroid_lat: float
    centroid_lng: float
    area_sq_km: float
    customer_count: int

# Algorithm Request Schemas
class KMPRequest(BaseModel):
    pattern: str = Field(..., description="Search pattern for customer or address")
    text: Optional[str] = Field(None, description="Optional custom text to search. If omitted, searches customer database.")

class KnapsackRequest(BaseModel):
    capacity: int = Field(150, description="Truck payload weight capacity in kg")
    items: Optional[List[Dict[str, Any]]] = Field(None, description="Optional custom package items. If omitted, uses pending packages.")

class GrahamScanRequest(BaseModel):
    points: Optional[List[Dict[str, Any]]] = Field(None, description="2D points with x (lng/x) and y (lat/y). If omitted, uses customer coordinates.")

class FloydWarshallRequest(BaseModel):
    nodes: Optional[List[Dict[str, Any]]] = None
    edges: Optional[List[Dict[str, Any]]] = None
    source_id: Optional[str] = None
    target_id: Optional[str] = None

class EdmondsKarpRequest(BaseModel):
    nodes: Optional[List[Dict[str, Any]]] = None
    edges: Optional[List[Dict[str, Any]]] = None
    source_id: str = "W1"  # Warehouse Node ID
    sink_id: str = "HUB_SOUTH"  # Delivery Network Sink ID
