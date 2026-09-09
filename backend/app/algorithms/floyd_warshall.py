from typing import Dict, Any, List, Optional

INF = float('inf')

def floyd_warshall(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Floyd-Warshall All-Pairs Shortest Path Algorithm.
    
    State: DP[k][i][j] = shortest distance from node i to node j using intermediate nodes {0..k}
    Transition: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    
    Time Complexity: O(V³)
    Space Complexity: O(V²)
    """
    node_ids = [n["id"] for n in nodes]
    id_to_idx = {nid: idx for idx, nid in enumerate(node_ids)}
    idx_to_id = {idx: nid for idx, nid in enumerate(node_ids)}
    V = len(nodes)

    # Initialize Distance Matrix & Predecessor/Next Matrix
    dist = [[INF] * V for _ in range(V)]
    next_node = [[None] * V for _ in range(V)]

    for i in range(V):
        dist[i][i] = 0.0
        next_node[i][i] = i

    for edge in edges:
        u_id = edge["source"]
        v_id = edge["target"]
        w = float(edge.get("weight", 1.0))
        if u_id in id_to_idx and v_id in id_to_idx:
            u = id_to_idx[u_id]
            v = id_to_idx[v_id]
            if w < dist[u][v]:
                dist[u][v] = w
                next_node[u][v] = v
            # If undirected, also add reverse edge
            if edge.get("bidirectional", True):
                if w < dist[v][u]:
                    dist[v][u] = w
                    next_node[v][u] = u

    snapshots = []
    
    # Save initial state (k = -1)
    snapshots.append({
        "k": -1,
        "k_node_id": "Initialization",
        "distance_matrix": [[val if val != INF else -1 for val in row] for row in dist]
    })

    # Main Floyd-Warshall DP loop
    for k in range(V):
        k_node_id = idx_to_id[k]
        for i in range(V):
            for j in range(V):
                if dist[i][k] != INF and dist[k][j] != INF:
                    if dist[i][k] + dist[k][j] < dist[i][j]:
                        dist[i][j] = dist[i][k] + dist[k][j]
                        next_node[i][j] = next_node[i][k]

        # Record matrix snapshot for each intermediate vertex k
        snapshots.append({
            "k": k,
            "k_node_id": k_node_id,
            "distance_matrix": [[round(val, 2) if val != INF else -1 for val in row] for row in dist]
        })

    # Format output matrices
    distance_matrix_dict = {}
    for i in range(V):
        u_id = idx_to_id[i]
        distance_matrix_dict[u_id] = {}
        for j in range(V):
            v_id = idx_to_id[j]
            d = dist[i][j]
            distance_matrix_dict[u_id][v_id] = round(d, 2) if d != INF else -1

    return {
        "nodes": nodes,
        "total_nodes": V,
        "distance_matrix": distance_matrix_dict,
        "matrix_snapshots": snapshots,
        "time_complexity": "O(V³)",
        "space_complexity": "O(V²)",
        "algorithm_info": {
            "name": "Floyd-Warshall All-Pairs Shortest Path",
            "purpose": "Precomputing optimal intersection-to-intersection shortest path distances across the entire road network",
            "state_transition": "dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])"
        },
        "_internal_dist": dist,
        "_internal_next": next_node,
        "_id_to_idx": id_to_idx,
        "_idx_to_id": idx_to_id
    }


def get_shortest_path(fw_result: Dict[str, Any], source_id: str, target_id: str) -> Dict[str, Any]:
    """
    Reconstructs the shortest path between source_id and target_id using Floyd-Warshall predecessor matrix.
    """
    id_to_idx = fw_result.get("_id_to_idx", {})
    idx_to_id = fw_result.get("_idx_to_id", {})
    next_node = fw_result.get("_internal_next", [])
    dist = fw_result.get("_internal_dist", [])

    if source_id not in id_to_idx or target_id not in id_to_idx:
        return {"path": [], "distance": -1, "found": False, "error": "Source or target node not found"}

    u = id_to_idx[source_id]
    v = id_to_idx[target_id]

    if dist[u][v] == INF:
        return {"path": [], "distance": -1, "found": False, "explanation": "No path exists between nodes"}

    path_indices = [u]
    curr = u
    while curr != v:
        nxt = next_node[curr][v]
        if nxt is None:
            return {"path": [], "distance": -1, "found": False, "explanation": "Broken path pointer"}
        curr = nxt
        path_indices.append(curr)

    path_node_ids = [idx_to_id[idx] for idx in path_indices]

    return {
        "source": source_id,
        "target": target_id,
        "distance": round(dist[u][v], 2),
        "path": path_node_ids,
        "node_count": len(path_node_ids),
        "found": True
    }
