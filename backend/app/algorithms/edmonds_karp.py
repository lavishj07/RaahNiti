from collections import deque
from typing import Dict, Any, List

def edmonds_karp(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]], source_id: str, sink_id: str) -> Dict[str, Any]:
    """
    Edmonds-Karp Maximum Flow Algorithm using BFS for finding augmenting paths.
    
    Time Complexity: O(V * E²)
    Space Complexity: O(V + E)
    """
    node_ids = [n["id"] for n in nodes]
    if source_id not in node_ids or sink_id not in node_ids:
        return {"error": "Source or Sink node ID not found in network nodes."}

    # Build Capacity Matrix and Residual Graph
    # Mapping nodes to 0..V-1
    id_to_idx = {nid: idx for idx, nid in enumerate(node_ids)}
    idx_to_id = {idx: nid for idx, nid in enumerate(node_ids)}
    V = len(nodes)

    capacity = [[0.0] * V for _ in range(V)]
    flow = [[0.0] * V for _ in range(V)]
    edge_map = {}

    for edge in edges:
        u_id = edge["source"]
        v_id = edge["target"]
        cap = float(edge.get("capacity", 0.0))
        if u_id in id_to_idx and v_id in id_to_idx:
            u = id_to_idx[u_id]
            v = id_to_idx[v_id]
            capacity[u][v] += cap
            if edge.get("bidirectional", True):
                capacity[v][u] += cap
            edge_map[(u_id, v_id)] = edge

    s = id_to_idx[source_id]
    t = id_to_idx[sink_id]

    max_flow = 0.0
    augmenting_paths = []
    step_count = 1

    while True:
        # BFS to find shortest augmenting path from source to sink in residual graph
        parent = [-1] * V
        parent[s] = s
        queue = deque([s])

        while queue and parent[t] == -1:
            curr = queue.popleft()
            for nxt in range(V):
                residual_cap = capacity[curr][nxt] - flow[curr][nxt]
                if parent[nxt] == -1 and residual_cap > 0:
                    parent[nxt] = curr
                    queue.append(nxt)

        # If sink is not reachable in residual graph, max flow reached
        if parent[t] == -1:
            break

        # Find bottleneck capacity along the augmenting path
        path_bottleneck = float('inf')
        curr = t
        path_nodes_idx = []

        while curr != s:
            path_nodes_idx.append(curr)
            prev = parent[curr]
            residual_cap = capacity[prev][curr] - flow[prev][curr]
            path_bottleneck = min(path_bottleneck, residual_cap)
            curr = prev
        path_nodes_idx.append(s)
        path_nodes_idx.reverse()

        # Update flows along path
        curr = t
        while curr != s:
            prev = parent[curr]
            flow[prev][curr] += path_bottleneck
            flow[curr][prev] -= path_bottleneck
            curr = prev

        max_flow += path_bottleneck
        path_node_ids = [idx_to_id[idx] for idx in path_nodes_idx]

        augmenting_paths.append({
            "step": step_count,
            "path": path_node_ids,
            "bottleneck_capacity": round(path_bottleneck, 2),
            "accumulated_max_flow": round(max_flow, 2),
            "explanation": f"Augmenting path found: {' -> '.join(path_node_ids)} with bottleneck capacity {path_bottleneck:.2f}"
        })
        step_count += 1

    # Analyze edge flows and saturated bottleneck edges
    edge_results = []
    saturated_bottlenecks = []

    for edge in edges:
        u_id = edge["source"]
        v_id = edge["target"]
        u = id_to_idx[u_id]
        v = id_to_idx[v_id]
        cap = capacity[u][v]
        f = max(0.0, flow[u][v])
        residual = max(0.0, cap - f)
        is_saturated = (cap > 0 and abs(f - cap) < 1e-5)

        edge_detail = {
            "source": u_id,
            "target": v_id,
            "road_name": edge.get("name", f"Road {u_id}-{v_id}"),
            "capacity": round(cap, 2),
            "flow": round(f, 2),
            "residual_capacity": round(residual, 2),
            "utilization_pct": round((f / cap * 100), 2) if cap > 0 else 0.0,
            "is_saturated": is_saturated
        }
        edge_results.append(edge_detail)
        if is_saturated:
            saturated_bottlenecks.append(edge_detail)

    return {
        "source": source_id,
        "sink": sink_id,
        "max_flow": round(max_flow, 2),
        "augmenting_paths": augmenting_paths,
        "total_augmenting_paths": len(augmenting_paths),
        "edges": edge_results,
        "bottlenecks": saturated_bottlenecks,
        "bottleneck_count": len(saturated_bottlenecks),
        "time_complexity": "O(V * E²)",
        "space_complexity": "O(V + E)",
        "algorithm_info": {
            "name": "Edmonds-Karp Maximum Flow",
            "purpose": "Analyze maximum throughput capacity and road congestion bottlenecks from Warehouse to Delivery Network",
            "search_strategy": "BFS to guarantee shortest augmenting path in edge count",
            "termination": "No path with residual capacity > 0 exists from Source to Sink"
        }
    }
