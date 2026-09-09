import pytest
from app.algorithms.kmp import kmp_search, compute_lps_array
from app.algorithms.knapsack import solve_01_knapsack
from app.algorithms.graham_scan import graham_scan
from app.algorithms.floyd_warshall import floyd_warshall, get_shortest_path
from app.algorithms.edmonds_karp import edmonds_karp

# ----------------------------------------------------
# KMP TESTS
# ----------------------------------------------------
def test_kmp_match_found():
    res = kmp_search("123 MG Road, Sector 4, New Delhi", "MG Road")
    assert res["matches"] == [4]
    assert res["comparisons"] > 0
    assert len(res["lps"]) == len("MG Road")

def test_kmp_match_not_found():
    res = kmp_search("123 MG Road, Sector 4, New Delhi", "Connaught Place")
    assert res["matches"] == []

def test_kmp_empty_pattern():
    res = kmp_search("Sample Text Address", "")
    assert res["matches"] == []
    assert res["lps"] == []

def test_kmp_repeated_characters():
    res = kmp_search("AAAAABAAAAAB", "AAAB")
    assert res["matches"] == [2, 8]
    assert res["lps"] == [0, 1, 2, 0]


# ----------------------------------------------------
# 0/1 KNAPSACK TESTS
# ----------------------------------------------------
def test_knapsack_normal():
    items = [
        {"id": 1, "name": "Medications", "weight": 2, "value": 10, "priority": 5},
        {"id": 2, "name": "Electronics", "weight": 3, "value": 15, "priority": 4},
        {"id": 3, "name": "Documents", "weight": 4, "value": 40, "priority": 5},
        {"id": 4, "name": "Apparel", "weight": 5, "value": 25, "priority": 2}
    ]
    res = solve_01_knapsack(items, capacity=6)
    # Optimal subset: Medications (w=2, v=10) + Documents (w=4, v=40) -> total weight 6, val 50
    assert res["total_weight"] == 6
    assert res["total_value"] == 50
    assert len(res["selected_items"]) == 2

def test_knapsack_zero_capacity():
    items = [{"id": 1, "weight": 3, "value": 10}]
    res = solve_01_knapsack(items, capacity=0)
    assert res["total_weight"] == 0
    assert res["total_value"] == 0
    assert len(res["selected_items"]) == 0

def test_knapsack_empty_packages():
    res = solve_01_knapsack([], capacity=50)
    assert res["total_weight"] == 0
    assert res["total_value"] == 0
    assert res["selected_items"] == []

def test_knapsack_single_package():
    items = [{"id": 1, "name": "Solo Box", "weight": 10, "value": 100}]
    res_fits = solve_01_knapsack(items, capacity=10)
    assert res_fits["total_value"] == 100
    res_no_fit = solve_01_knapsack(items, capacity=5)
    assert res_no_fit["total_value"] == 0


# ----------------------------------------------------
# GRAHAM SCAN TESTS
# ----------------------------------------------------
def test_graham_scan_basic_polygon():
    points = [
        {"id": 1, "name": "P1", "x": 0.0, "y": 0.0},
        {"id": 2, "name": "P2", "x": 5.0, "y": 0.0},
        {"id": 3, "name": "P3", "x": 5.0, "y": 5.0},
        {"id": 4, "name": "P4", "x": 0.0, "y": 5.0},
        {"id": 5, "name": "P5", "x": 2.0, "y": 2.0}  # Interior point
    ]
    res = graham_scan(points)
    assert res["hull_count"] == 4
    assert len(res["interior_points"]) == 1
    assert res["interior_points"][0]["id"] == 5

def test_graham_scan_collinear_points():
    points = [
        {"id": 1, "x": 0.0, "y": 0.0},
        {"id": 2, "x": 2.0, "y": 0.0},
        {"id": 3, "x": 4.0, "y": 0.0},
        {"id": 4, "x": 0.0, "y": 4.0}
    ]
    res = graham_scan(points)
    assert res["hull_count"] >= 3

def test_graham_scan_small_point_sets():
    points = [
        {"id": 1, "x": 0.0, "y": 0.0},
        {"id": 2, "x": 1.0, "y": 1.0}
    ]
    res = graham_scan(points)
    assert "error" in res


# ----------------------------------------------------
# FLOYD-WARSHALL TESTS
# ----------------------------------------------------
def test_floyd_warshall_connected_graph():
    nodes = [{"id": "N1"}, {"id": "N2"}, {"id": "N3"}]
    edges = [
        {"source": "N1", "target": "N2", "weight": 3.0, "bidirectional": False},
        {"source": "N2", "target": "N3", "weight": 4.0, "bidirectional": False},
        {"source": "N1", "target": "N3", "weight": 10.0, "bidirectional": False}
    ]
    fw_res = floyd_warshall(nodes, edges)
    path_res = get_shortest_path(fw_res, "N1", "N3")
    assert path_res["found"] is True
    assert path_res["distance"] == 7.0
    assert path_res["path"] == ["N1", "N2", "N3"]

def test_floyd_warshall_disconnected_graph():
    nodes = [{"id": "A"}, {"id": "B"}, {"id": "C"}]
    edges = [{"source": "A", "target": "B", "weight": 2.0, "bidirectional": False}]
    fw_res = floyd_warshall(nodes, edges)
    path_res = get_shortest_path(fw_res, "A", "C")
    assert path_res["found"] is False


# ----------------------------------------------------
# EDMONDS-KARP TESTS
# ----------------------------------------------------
def test_edmonds_karp_basic():
    nodes = [{"id": "S"}, {"id": "A"}, {"id": "B"}, {"id": "T"}]
    edges = [
        {"source": "S", "target": "A", "capacity": 10},
        {"source": "S", "target": "B", "capacity": 10},
        {"source": "A", "target": "B", "capacity": 1},
        {"source": "A", "target": "T", "capacity": 10},
        {"source": "B", "target": "T", "capacity": 10}
    ]
    res = edmonds_karp(nodes, edges, source_id="S", sink_id="T")
    assert res["max_flow"] == 20.0
    assert res["bottleneck_count"] >= 2

def test_edmonds_karp_zero_capacity():
    nodes = [{"id": "S"}, {"id": "T"}]
    edges = [{"source": "S", "target": "T", "capacity": 0}]
    res = edmonds_karp(nodes, edges, source_id="S", sink_id="T")
    assert res["max_flow"] == 0.0
