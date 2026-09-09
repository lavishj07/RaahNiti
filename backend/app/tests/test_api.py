import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def test_read_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_get_customers(client):
    response = client.get("/api/customers")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "name" in data[0]

def test_get_packages(client):
    response = client.get("/api/packages")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_get_vehicles(client):
    response = client.get("/api/vehicles")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_get_network(client):
    response = client.get("/api/network")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "edges" in data

def test_kmp_endpoint(client):
    response = client.post("/api/algorithms/kmp", json={"pattern": "Electronics"})
    assert response.status_code == 200
    data = response.json()
    assert "lps" in data
    assert "matching_customers" in data

def test_knapsack_endpoint(client):
    response = client.post("/api/algorithms/knapsack", json={"capacity": 100})
    assert response.status_code == 200
    data = response.json()
    assert "dp_table" in data
    assert "selected_items" in data

def test_graham_scan_endpoint(client):
    response = client.post("/api/algorithms/graham-scan", json={})
    assert response.status_code == 200
    data = response.json()
    assert "hull_points" in data

def test_floyd_warshall_endpoint(client):
    response = client.post("/api/algorithms/floyd-warshall", json={"source_id": "W1", "target_id": "N05"})
    assert response.status_code == 200
    data = response.json()
    assert "floyd_warshall" in data

def test_edmonds_karp_endpoint(client):
    response = client.post("/api/algorithms/edmonds-karp", json={"source_id": "W1", "sink_id": "HUB_SOUTH"})
    assert response.status_code == 200
    data = response.json()
    assert "max_flow" in data
    assert "bottlenecks" in data
