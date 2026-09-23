from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database.connection import get_db
from app.database.models import Warehouse, Customer, Package, Vehicle, GraphNode, GraphEdge, Zone
from app.database.schemas import (
    WarehouseSchema, CustomerSchema, PackageSchema,
    VehicleSchema, GraphNodeSchema, GraphEdgeSchema, ZoneSchema
)

router = APIRouter(prefix="/api", tags=["data"])

@router.get("/warehouse", response_model=WarehouseSchema)
def get_warehouse(db: Session = Depends(get_db)):
    wh = db.query(Warehouse).first()
    return wh

@router.get("/customers", response_model=List[CustomerSchema])
def get_customers(db: Session = Depends(get_db)):
    return db.query(Customer).all()

@router.get("/packages", response_model=List[PackageSchema])
def get_packages(db: Session = Depends(get_db)):
    return db.query(Package).all()

@router.get("/vehicles", response_model=List[VehicleSchema])
def get_vehicles(db: Session = Depends(get_db)):
    return db.query(Vehicle).all()

@router.get("/network")
def get_network(db: Session = Depends(get_db)):
    nodes = db.query(GraphNode).all()
    edges = db.query(GraphEdge).all()
    return {
        "nodes": [
            {
                "id": n.id,
                "label": n.label,
                "type": n.type,
                "latitude": n.latitude,
                "longitude": n.longitude
            }
            for n in nodes
        ],
        "edges": [
            {
                "id": e.id,
                "source": e.source,
                "target": e.target,
                "road_name": e.road_name,
                "distance_km": e.distance_km,
                "capacity_vehicles_per_hr": e.capacity_vehicles_per_hr,
                "bidirectional": e.bidirectional
            }
            for e in edges
        ]
    }

@router.get("/zones", response_model=List[ZoneSchema])
def get_zones(db: Session = Depends(get_db)):
    return db.query(Zone).all()

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    active_deliveries = db.query(Package).filter(Package.status == "LOADED").count()
    active_vehicles = db.query(Vehicle).filter(Vehicle.status == "ACTIVE").count()
    pending_packages = db.query(Package).filter(Package.status == "PENDING").count()
    delivered_packages = db.query(Package).filter(Package.status == "DELIVERED").count()
    delayed_vehicles = db.query(Vehicle).filter(Vehicle.status == "DELAYED").count()
    total_customers = db.query(Customer).count()
    
    vehicles = db.query(Vehicle).all()
    total_capacity = sum(v.payload_capacity_kg for v in vehicles)
    total_current_load = sum(v.current_load_kg for v in vehicles)
    fleet_utilization = round((total_current_load / total_capacity * 100), 1) if total_capacity > 0 else 0

    delivered_pkgs = db.query(Package).filter(Package.status == "DELIVERED").all()
    total_value_delivered = sum(p.value_usd for p in delivered_pkgs)

    return {
        "active_deliveries": active_deliveries,
        "active_vehicles": active_vehicles,
        "pending_packages": pending_packages,
        "delivered_packages": delivered_packages,
        "delayed_vehicles": delayed_vehicles,
        "total_customers": total_customers,
        "fleet_utilization_pct": fleet_utilization,
        "network_bottlenecks_detected": 1,
        "average_delivery_eta_mins": 34,
        "total_optimized_distance_km": 174.6,
        "total_value_delivered_usd": round(total_value_delivered, 2),
    }
