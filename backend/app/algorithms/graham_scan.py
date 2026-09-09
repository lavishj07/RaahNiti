import math
from typing import Dict, Any, List

def cross_product(o: Dict[str, float], a: Dict[str, float], b: Dict[str, float]) -> float:
    """
    Returns 2D cross product of vectors OA and OB.
    > 0 if OA -> OB is counter-clockwise (left turn)
    < 0 if OA -> OB is clockwise (right turn)
    = 0 if collinear
    """
    return (a["x"] - o["x"]) * (b["y"] - o["y"]) - (a["y"] - o["y"]) * (b["x"] - o["x"])

def distance_sq(a: Dict[str, float], b: Dict[str, float]) -> float:
    """Euclidean distance squared between points a and b."""
    return (a["x"] - b["x"])**2 + (a["y"] - b["y"])**2

def graham_scan(points: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Graham's Scan Algorithm to find Convex Hull of 2D points (e.g. delivery locations).
    Time Complexity: O(N log N) due to sorting.
    Space Complexity: O(N) for stack.
    """
    n = len(points)
    if n < 3:
        return {
            "hull_points": points,
            "interior_points": [],
            "hull_edges": [],
            "area": 0.0,
            "perimeter": 0.0,
            "centroid": {"x": 0.0, "y": 0.0},
            "steps": [],
            "error": "At least 3 points are required to compute a 2D convex hull."
        }

    # Step 1: Find pivot P0 (lowest y, then lowest x)
    pivot = min(points, key=lambda p: (p["y"], p["x"]))
    
    # Step 2: Sort remaining points by polar angle with pivot
    def polar_angle_comparator(p):
        angle = math.atan2(p["y"] - pivot["y"], p["x"] - pivot["x"])
        dist = distance_sq(pivot, p)
        return (angle, dist)

    other_points = [p for p in points if p["id"] != pivot["id"]]
    sorted_points = sorted(other_points, key=polar_angle_comparator)

    # Filter collinear points keeping furthest
    cleaned_points = [pivot]
    for p in sorted_points:
        while len(cleaned_points) > 1 and cross_product(cleaned_points[-2], cleaned_points[-1], p) == 0:
            if distance_sq(pivot, p) >= distance_sq(pivot, cleaned_points[-1]):
                cleaned_points.pop()
            else:
                break
        cleaned_points.append(p)

    if len(cleaned_points) < 3:
        return {
            "hull_points": cleaned_points,
            "interior_points": [p for p in points if p not in cleaned_points],
            "hull_edges": [],
            "area": 0.0,
            "perimeter": 0.0,
            "centroid": {"x": sum(p["x"] for p in points)/n, "y": sum(p["y"] for p in points)/n},
            "steps": [],
            "warning": "Points are collinear."
        }

    # Step 3: Stack processing
    stack = [cleaned_points[0], cleaned_points[1], cleaned_points[2]]
    steps = []
    
    steps.append({
        "step_index": 1,
        "action": "Initialize stack with pivot and first 2 polar-sorted points",
        "stack": [p["name"] if "name" in p else f"P{p['id']}" for p in stack],
        "current_point": stack[2]["name"] if "name" in stack[2] else f"P{stack[2]['id']}"
    })

    step_idx = 2
    for i in range(3, len(cleaned_points)):
        pt = cleaned_points[i]
        pt_label = pt.get("name", f"P{pt['id']}")

        while len(stack) >= 2:
            cp = cross_product(stack[-2], stack[-1], pt)
            if cp <= 0:  # Non-left turn (clockwise or collinear) -> Pop
                popped = stack.pop()
                popped_label = popped.get("name", f"P{popped['id']}")
                steps.append({
                    "step_index": step_idx,
                    "action": f"Clockwise / Collinear turn detected (cp = {cp:.2f}). POP {popped_label} from stack",
                    "stack": [p.get("name", f"P{p['id']}") for p in stack],
                    "current_point": pt_label
                })
                step_idx += 1
            else:
                break

        stack.append(pt)
        steps.append({
            "step_index": step_idx,
            "action": f"Counter-clockwise turn (cp > 0). PUSH {pt_label} to stack",
            "stack": [p.get("name", f"P{p['id']}") for p in stack],
            "current_point": pt_label
        })
        step_idx += 1

    hull_points = stack
    hull_ids = {p["id"] for p in hull_points}
    interior_points = [p for p in points if p["id"] not in hull_ids]

    # Calculate hull edges
    hull_edges = []
    h_len = len(hull_points)
    perimeter = 0.0
    for i in range(h_len):
        p1 = hull_points[i]
        p2 = hull_points[(i + 1) % h_len]
        hull_edges.append({"from": p1["id"], "to": p2["id"]})
        perimeter += math.sqrt(distance_sq(p1, p2))

    # Polygon Area via Shoelace Formula
    area = 0.0
    for i in range(h_len):
        p1 = hull_points[i]
        p2 = hull_points[(i + 1) % h_len]
        area += (p1["x"] * p2["y"]) - (p2["x"] * p1["y"])
    area = abs(area) / 2.0

    # Centroid
    cx = sum(p["x"] for p in hull_points) / h_len
    cy = sum(p["y"] for p in hull_points) / h_len

    return {
        "pivot": pivot,
        "hull_points": hull_points,
        "interior_points": interior_points,
        "hull_edges": hull_edges,
        "hull_count": len(hull_points),
        "total_points": n,
        "perimeter": round(perimeter, 4),
        "area": round(area, 4),
        "centroid": {"x": round(cx, 6), "y": round(cy, 6)},
        "steps": steps,
        "time_complexity": "O(N log N)",
        "space_complexity": "O(N)",
        "algorithm_info": {
            "name": "Graham's Scan Convex Hull",
            "purpose": "Boundary zone polygon generation around delivery destination clusters",
            "pivot_selection": "Lowest Y coordinate (lowest X on tie)",
            "sorting": "Polar angle with respect to pivot P0",
            "stack_rule": "Maintain counter-clockwise turn (cross product > 0)"
        }
    }
