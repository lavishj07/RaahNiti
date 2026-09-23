from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database.connection import get_db
from app.database.models import Customer, Package, Vehicle, GraphNode, GraphEdge, Zone
from app.database.schemas import (
    KMPRequest, KnapsackRequest, GrahamScanRequest,
    FloydWarshallRequest, EdmondsKarpRequest
)
from app.algorithms.kmp import kmp_search
from app.algorithms.knapsack import solve_01_knapsack
from app.algorithms.graham_scan import graham_scan
from app.algorithms.floyd_warshall import floyd_warshall, get_shortest_path
from app.algorithms.edmonds_karp import edmonds_karp

router = APIRouter(prefix="/api/algorithms", tags=["algorithms"])

@router.post("/kmp")
def run_kmp(req: KMPRequest, db: Session = Depends(get_db)):
    pattern = req.pattern.strip()
    if not pattern:
        raise HTTPException(status_code=400, detail="Search pattern cannot be empty")

    if req.text:
        text_to_search = req.text
        kmp_result = kmp_search(text_to_search, pattern)
        return kmp_result

    customers = db.query(Customer).all()
    packages = db.query(Package).all()
    vehicles = db.query(Vehicle).all()
    zones = db.query(Zone).all()

    matching_customers = []
    matching_packages = []
    matching_vehicles = []
    matching_zones = []
    total_comparisons = 0
    needle = pattern.lower()

    for c in customers:
        target_str = f"{c.name} {c.address} {c.zone_id or ''} {c.id}"
        res = kmp_search(target_str.lower(), needle)
        total_comparisons += res["comparisons"]
        if res["matches"]:
            matching_customers.append({
                "customer": {
                    "id": c.id,
                    "name": c.name,
                    "address": c.address,
                    "latitude": c.latitude,
                    "longitude": c.longitude,
                    "priority": c.priority,
                    "zone_id": c.zone_id,
                },
                "matches": res["matches"],
                "matched_text": target_str
            })

    for p in packages:
        target_str = f"{p.id} {p.tracking_number} {p.customer_id} {p.status}"
        res = kmp_search(target_str.lower(), needle)
        total_comparisons += res["comparisons"]
        if res["matches"]:
            matching_packages.append({
                "id": p.id,
                "tracking_number": p.tracking_number,
                "customer_id": p.customer_id,
                "status": p.status,
                "priority": p.priority,
                "matched_text": target_str,
            })

    for v in vehicles:
        target_str = f"{v.id} {v.vehicle_number} {v.driver_name} {v.status}"
        res = kmp_search(target_str.lower(), needle)
        total_comparisons += res["comparisons"]
        if res["matches"]:
            matching_vehicles.append({
                "id": v.id,
                "vehicle_number": v.vehicle_number,
                "driver_name": v.driver_name,
                "status": v.status,
                "matched_text": target_str,
            })

    for z in zones:
        target_str = f"{z.id} {z.name}"
        res = kmp_search(target_str.lower(), needle)
        total_comparisons += res["comparisons"]
        if res["matches"]:
            matching_zones.append({"id": z.id, "name": z.name, "matched_text": target_str})

    sample_source = matching_customers[0]["matched_text"] if matching_customers else (
        (customers[0].name + " " + customers[0].address) if customers else
        "Apollo Medical Center Mathura Road Hospital Connaught Place MG Road"
    )
    kmp_result = kmp_search(sample_source.lower(), needle)
    kmp_result["matching_customers"] = matching_customers
    kmp_result["matching_packages"] = matching_packages
    kmp_result["matching_vehicles"] = matching_vehicles
    kmp_result["matching_zones"] = matching_zones
    kmp_result["total_customers_scanned"] = len(customers)
    kmp_result["total_records_scanned"] = len(customers) + len(packages) + len(vehicles) + len(zones)
    kmp_result["total_comparisons_all_customers"] = total_comparisons
    kmp_result["hit_count"] = (
        len(matching_customers) + len(matching_packages) + len(matching_vehicles) + len(matching_zones)
    )
    return kmp_result


@router.post("/knapsack")
def run_knapsack(req: KnapsackRequest, db: Session = Depends(get_db)):
    capacity = req.capacity
    if req.items:
        items = req.items
    else:
        # Use pending packages from database
        packages = db.query(Package).all()
        items = []
        for p in packages:
            items.append({
                "id": p.id,
                "name": f"{p.tracking_number} ({p.customer_id})",
                "weight": int(p.weight_kg),
                "value": int(p.value_usd),
                "priority": p.priority
            })

    result = solve_01_knapsack(items, capacity)
    return result


@router.post("/graham-scan")
def run_graham_scan(req: GrahamScanRequest, db: Session = Depends(get_db)):
    if req.points and len(req.points) >= 3:
        points = req.points
    else:
        customers = db.query(Customer).all()
        points = []
        for c in customers:
            # Map Lat/Lng to X/Y for Graham's Scan geometry (scaling longitudes & latitudes)
            points.append({
                "id": c.id,
                "name": c.name,
                "x": c.longitude,
                "y": c.latitude,
                "lat": c.latitude,
                "lng": c.longitude,
                "address": c.address
            })

    result = graham_scan(points)
    return result


@router.post("/floyd-warshall")
def run_floyd_warshall(req: FloydWarshallRequest, db: Session = Depends(get_db)):
    if req.nodes and req.edges:
        nodes = req.nodes
        edges = req.edges
    else:
        nodes_db = db.query(GraphNode).all()
        edges_db = db.query(GraphEdge).all()
        nodes = [{"id": n.id, "label": n.label, "type": n.type, "lat": n.latitude, "lng": n.longitude} for n in nodes_db]
        edges = [
            {
                "source": e.source,
                "target": e.target,
                "weight": e.distance_km,
                "name": e.road_name,
                "bidirectional": e.bidirectional
            }
            for e in edges_db
        ]

    fw_result = floyd_warshall(nodes, edges)

    # Optional shortest path calculation between source and target
    path_result = None
    if req.source_id and req.target_id:
        path_result = get_shortest_path(fw_result, req.source_id, req.target_id)

    return {
        "floyd_warshall": {
            "total_nodes": fw_result["total_nodes"],
            "distance_matrix": fw_result["distance_matrix"],
            "matrix_snapshots": fw_result["matrix_snapshots"],
            "time_complexity": fw_result["time_complexity"],
            "space_complexity": fw_result["space_complexity"],
            "algorithm_info": fw_result["algorithm_info"]
        },
        "nodes": nodes,
        "edges": edges,
        "selected_shortest_path": path_result
    }


@router.post("/edmonds-karp")
def run_edmonds_karp(req: EdmondsKarpRequest, db: Session = Depends(get_db)):
    if req.nodes and req.edges:
        nodes = req.nodes
        edges = req.edges
    else:
        nodes_db = db.query(GraphNode).all()
        edges_db = db.query(GraphEdge).all()
        nodes = [{"id": n.id, "label": n.label, "type": n.type, "lat": n.latitude, "lng": n.longitude} for n in nodes_db]
        edges = [
            {
                "source": e.source,
                "target": e.target,
                "capacity": e.capacity_vehicles_per_hr,
                "name": e.road_name
            }
            for e in edges_db
        ]

    result = edmonds_karp(nodes, edges, req.source_id, req.sink_id)
    return result
