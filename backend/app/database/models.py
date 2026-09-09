from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    capacity_sqft = Column(Integer, default=50000)

class Customer(Base):
    __tablename__ = "customers"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    priority = Column(Integer, default=1)  # 1 to 5
    zone_id = Column(String, nullable=True)

    packages = relationship("Package", back_populates="customer")

class Package(Base):
    __tablename__ = "packages"

    id = Column(String, primary_key=True)
    tracking_number = Column(String, unique=True, nullable=False)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    weight_kg = Column(Float, nullable=False)
    value_usd = Column(Float, nullable=False)
    priority = Column(Integer, default=1)
    status = Column(String, default="PENDING")  # PENDING, LOADED, DELIVERED
    assigned_vehicle_id = Column(String, nullable=True)

    customer = relationship("Customer", back_populates="packages")

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String, primary_key=True)
    vehicle_number = Column(String, nullable=False)
    driver_name = Column(String, nullable=False)
    payload_capacity_kg = Column(Float, nullable=False)
    current_load_kg = Column(Float, default=0.0)
    status = Column(String, default="IDLE")  # ACTIVE, IDLE, LOADING, DELAYED, MAINTENANCE
    current_latitude = Column(Float, nullable=False)
    current_longitude = Column(Float, nullable=False)
    current_route = Column(Text, nullable=True)  # JSON representation of stop sequence

class GraphNode(Base):
    __tablename__ = "graph_nodes"

    id = Column(String, primary_key=True)
    label = Column(String, nullable=False)
    type = Column(String, default="INTERSECTION")  # WAREHOUSE, INTERSECTION, HUB, CUSTOMER_STOP
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

class GraphEdge(Base):
    __tablename__ = "graph_edges"

    id = Column(String, primary_key=True)
    source = Column(String, ForeignKey("graph_nodes.id"), nullable=False)
    target = Column(String, ForeignKey("graph_nodes.id"), nullable=False)
    road_name = Column(String, nullable=False)
    distance_km = Column(Float, nullable=False)
    capacity_vehicles_per_hr = Column(Float, nullable=False)
    bidirectional = Column(Boolean, default=True)

class Zone(Base):
    __tablename__ = "zones"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    color = Column(String, default="#06B6D4")
    centroid_lat = Column(Float, nullable=False)
    centroid_lng = Column(Float, nullable=False)
    area_sq_km = Column(Float, default=0.0)
    customer_count = Column(Integer, default=0)
