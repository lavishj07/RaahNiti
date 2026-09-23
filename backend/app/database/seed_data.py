import json
from sqlalchemy.orm import Session
from app.database.models import Warehouse, Customer, Package, Vehicle, GraphNode, GraphEdge, Zone

def seed_database(db: Session):
    """
    Populate database with comprehensive realistic logistics demo data if empty.
    Covers all operational scenarios: peak load, delayed vehicles, bottleneck networks,
    urgent deliveries, idle fleet, and zone boundary edge cases.
    """
    already_seeded = db.query(Warehouse).first() is not None
    if already_seeded:
        _upsert_extra_search_records(db)
        return

    # ─── 1. Warehouse ─────────────────────────────────────────────────
    warehouse = Warehouse(
        id="W1",
        name="RaahNiti Central Logistics Hub",
        address="Sector 21, Dwarka, New Delhi 110075",
        latitude=28.5521,
        longitude=77.0589,
        capacity_sqft=75000
    )
    db.add(warehouse)

    # ─── 2. Customers ─────────────────────────────────────────────────
    # 30 customers spread across 5 zones (NORTH, SOUTH, EAST, WEST, CENTRAL)
    # Mix of: high priority hospitals/govt, medium retail, low residential
    customers_data = [
        # --- NORTH ZONE (6 customers) ---
        {"id": "C01", "name": "Apex Electronics Ltd",         "address": "Inner Circle, Connaught Place, New Delhi",        "lat": 28.6315, "lng": 77.2167, "priority": 5, "zone": "Z_NORTH"},
        {"id": "C11", "name": "Rohini Sector 10 Hub",         "address": "Sector 10, Rohini, New Delhi",                   "lat": 28.7180, "lng": 77.1150, "priority": 3, "zone": "Z_NORTH"},
        {"id": "C12", "name": "Pitampura Telecom Plaza",      "address": "Netaji Subhash Place, Pitampura, New Delhi",      "lat": 28.6940, "lng": 77.1520, "priority": 4, "zone": "Z_NORTH"},
        {"id": "C07", "name": "Pacific Mall Distribution",    "address": "Najafgarh Road, Subhash Nagar, New Delhi",        "lat": 28.6360, "lng": 77.1120, "priority": 3, "zone": "Z_NORTH"},
        {"id": "C21", "name": "Karol Bagh Wholesale",         "address": "Padam Singh Road, Karol Bagh, New Delhi",         "lat": 28.6520, "lng": 77.1910, "priority": 3, "zone": "Z_NORTH"},
        {"id": "C25", "name": "Rajouri Garden Trade Center",  "address": "Ring Road, Rajouri Garden, New Delhi",             "lat": 28.6490, "lng": 77.1220, "priority": 3, "zone": "Z_NORTH"},
        {"id": "C26", "name": "Model Town Medical Centre",    "address": "GT Karnal Road, Model Town, New Delhi",            "lat": 28.7110, "lng": 77.1910, "priority": 5, "zone": "Z_NORTH"},
        {"id": "C27", "name": "Shalimar Bagh Depot",          "address": "Ring Road, Shalimar Bagh, New Delhi",              "lat": 28.7200, "lng": 77.1740, "priority": 2, "zone": "Z_NORTH"},

        # --- SOUTH ZONE (8 customers) ---
        {"id": "C02", "name": "Apollo Medical Center",        "address": "Mathura Road, Sarita Vihar, New Delhi",           "lat": 28.5355, "lng": 77.2880, "priority": 5, "zone": "Z_SOUTH"},
        {"id": "C05", "name": "Vasant Kunj General Hospital", "address": "Sector C, Vasant Kunj, New Delhi",                "lat": 28.5280, "lng": 77.1550, "priority": 5, "zone": "Z_SOUTH"},
        {"id": "C08", "name": "Lajpat Nagar Central Market",  "address": "Block 3, Lajpat Nagar II, New Delhi",             "lat": 28.5680, "lng": 77.2430, "priority": 2, "zone": "Z_SOUTH"},
        {"id": "C10", "name": "Hauz Khas Social Retail",      "address": "Hauz Khas Village, New Delhi",                    "lat": 28.5540, "lng": 77.1940, "priority": 2, "zone": "Z_SOUTH"},
        {"id": "C13", "name": "Saket Select District",        "address": "Press Enclave Marg, Saket, New Delhi",            "lat": 28.5280, "lng": 77.2180, "priority": 4, "zone": "Z_SOUTH"},
        {"id": "C16", "name": "Greater Kailash Fashion House","address": "M-Block Market, GK-1, New Delhi",                 "lat": 28.5510, "lng": 77.2350, "priority": 3, "zone": "Z_SOUTH"},
        {"id": "C18", "name": "Okhla Industrial Phase III",   "address": "Okhla Estate, New Delhi",                         "lat": 28.5360, "lng": 77.2710, "priority": 5, "zone": "Z_SOUTH"},
        {"id": "C23", "name": "Faridabad Industrial S-31",    "address": "Mathura Road, Sector 31, Faridabad",              "lat": 28.4680, "lng": 77.3090, "priority": 4, "zone": "Z_SOUTH"},
        {"id": "C28", "name": "Tughlakabad Government Depot", "address": "Mehrauli-Badarpur Road, New Delhi",               "lat": 28.4880, "lng": 77.2640, "priority": 5, "zone": "Z_SOUTH"},

        # --- EAST ZONE (5 customers) ---
        {"id": "C04", "name": "Metro Retail Hypermarket",     "address": "Sector 62, Electronic City, Noida",               "lat": 28.6280, "lng": 77.3650, "priority": 3, "zone": "Z_EAST"},
        {"id": "C09", "name": "Indirapuram Tech Park",        "address": "Ahinsa Khand II, Indirapuram, Ghaziabad",         "lat": 28.6410, "lng": 77.3780, "priority": 3, "zone": "Z_EAST"},
        {"id": "C15", "name": "Noida Sector 18 Retail",       "address": "Atta Market, Sector 18, Noida",                   "lat": 28.5700, "lng": 77.3250, "priority": 4, "zone": "Z_EAST"},
        {"id": "C19", "name": "Mayur Vihar Plaza",             "address": "Phase 1 Commercial Belt, Mayur Vihar, New Delhi", "lat": 28.6080, "lng": 77.2950, "priority": 2, "zone": "Z_EAST"},
        {"id": "C24", "name": "Kaushambi Metro Mart",         "address": "Near Bus Terminal, Kaushambi, Ghaziabad",          "lat": 28.6450, "lng": 77.3220, "priority": 2, "zone": "Z_EAST"},
        {"id": "C29", "name": "Vasundhara Freight Depot",     "address": "Sector 14, Vasundhara, Ghaziabad",                "lat": 28.6590, "lng": 77.3510, "priority": 3, "zone": "Z_EAST"},

        # --- WEST ZONE (5 customers) ---
        {"id": "C03", "name": "CyberTech Systems Hub",        "address": "DLF Cyber City, Sector 24, Gurugram",             "lat": 28.4950, "lng": 77.0890, "priority": 4, "zone": "Z_WEST"},
        {"id": "C06", "name": "Nexus Corporate Towers",       "address": "Golf Course Road, Sector 54, Gurugram",           "lat": 28.4410, "lng": 77.1020, "priority": 4, "zone": "Z_WEST"},
        {"id": "C14", "name": "Janakpuri Business Complex",   "address": "District Centre, Janakpuri, New Delhi",           "lat": 28.6290, "lng": 77.0780, "priority": 3, "zone": "Z_WEST"},
        {"id": "C17", "name": "Sohna Road Freight Terminal",  "address": "Vatika City, Sohna Road, Gurugram",               "lat": 28.4120, "lng": 77.0410, "priority": 4, "zone": "Z_WEST"},
        {"id": "C20", "name": "Dwarka Sector 12 Depot",       "address": "Main Market, Sector 12, Dwarka, New Delhi",       "lat": 28.5910, "lng": 77.0420, "priority": 3, "zone": "Z_WEST"},

        # --- CENTRAL ZONE (4 customers) ---
        {"id": "C22", "name": "Aerocity Hospitality Hub",     "address": "Hospitality District, Aerocity, New Delhi",       "lat": 28.5550, "lng": 77.1210, "priority": 5, "zone": "Z_CENTRAL"},
        {"id": "C30", "name": "IGI Cargo Terminal",           "address": "NH-48, Near T3, New Delhi",                       "lat": 28.5620, "lng": 77.0930, "priority": 5, "zone": "Z_CENTRAL"},
        {"id": "C31", "name": "Mahipalpur Warehouse Zone",    "address": "NH-48, Mahipalpur, New Delhi",                    "lat": 28.5430, "lng": 77.1050, "priority": 4, "zone": "Z_CENTRAL"},
        {"id": "C32", "name": "Palam Tech Market",            "address": "Palam Village Road, Dwarka, New Delhi",           "lat": 28.5920, "lng": 77.0710, "priority": 3, "zone": "Z_CENTRAL"},

        # Extra KMP-searchable landmarks (hospitals, MG Road, Connaught, tracking aliases)
        {"id": "C33", "name": "Safdarjung Hospital Pharmacy", "address": "Ansari Nagar, Safdarjung Hospital, New Delhi",    "lat": 28.5680, "lng": 77.2080, "priority": 5, "zone": "Z_SOUTH"},
        {"id": "C34", "name": "Max Super Speciality Hospital","address": "Press Enclave Road, Saket, New Delhi",            "lat": 28.5275, "lng": 77.2115, "priority": 5, "zone": "Z_SOUTH"},
        {"id": "C35", "name": "Fortis Hospital Noida",        "address": "B-22, Sector 62, Noida",                          "lat": 28.6205, "lng": 77.3640, "priority": 5, "zone": "Z_EAST"},
        {"id": "C36", "name": "MG Road Electronics Bazaar",   "address": "123 MG Road, Gurgaon Sector 14",                  "lat": 28.4740, "lng": 77.0800, "priority": 3, "zone": "Z_WEST"},
        {"id": "C37", "name": "Connaught Place Flagship Store","address": "A-12 Inner Circle, Connaught Place, New Delhi",  "lat": 28.6328, "lng": 77.2197, "priority": 4, "zone": "Z_NORTH"},
        {"id": "C38", "name": "AIIMS Trauma Centre",          "address": "Ansari Nagar East, AIIMS, New Delhi",             "lat": 28.5665, "lng": 77.2110, "priority": 5, "zone": "Z_SOUTH"},
        {"id": "C39", "name": "Dwarka Sector 21 Metro Depot", "address": "Sector 21, Dwarka Expressway, New Delhi",         "lat": 28.5528, "lng": 77.0580, "priority": 3, "zone": "Z_WEST"},
        {"id": "C40", "name": "Cyber Hub Gurugram Retail",    "address": "DLF Cyber Hub, Cyber City, Gurugram",             "lat": 28.4948, "lng": 77.0885, "priority": 4, "zone": "Z_WEST"},
    ]

    for c in customers_data:
        db.add(Customer(
            id=c["id"],
            name=c["name"],
            address=c["address"],
            latitude=c["lat"],
            longitude=c["lng"],
            priority=c["priority"],
            zone_id=c["zone"]
        ))

    # ─── 3. Packages ──────────────────────────────────────────────────
    # 30 packages: mix of PENDING, LOADED, DELIVERED status
    # Weight range: 5–55 kg; Value range: 500–6000 USD; Priority 1–5
    packages_data = [
        # Critical / High-priority (LOADED on vehicles)
        {"id": "PKG-101", "tn": "RN-98214", "cid": "C01", "w": 18.5,  "v": 1200.0, "p": 5, "st": "LOADED",    "vid": "V01"},
        {"id": "PKG-102", "tn": "RN-98215", "cid": "C02", "w": 5.2,   "v": 3400.0, "p": 5, "st": "LOADED",    "vid": "V02"},
        {"id": "PKG-105", "tn": "RN-98218", "cid": "C05", "w": 12.0,  "v": 4500.0, "p": 5, "st": "LOADED",    "vid": "V02"},
        {"id": "PKG-118", "tn": "RN-98231", "cid": "C18", "w": 16.0,  "v": 5200.0, "p": 5, "st": "LOADED",    "vid": "V03"},
        {"id": "PKG-120", "tn": "RN-98233", "cid": "C22", "w": 11.0,  "v": 3600.0, "p": 5, "st": "LOADED",    "vid": "V04"},
        {"id": "PKG-126", "tn": "RN-98239", "cid": "C26", "w": 8.0,   "v": 4800.0, "p": 5, "st": "LOADED",    "vid": "V01"},
        {"id": "PKG-128", "tn": "RN-98241", "cid": "C28", "w": 20.0,  "v": 5500.0, "p": 5, "st": "LOADED",    "vid": "V02"},
        {"id": "PKG-130", "tn": "RN-98243", "cid": "C30", "w": 35.0,  "v": 6000.0, "p": 5, "st": "LOADED",    "vid": "V05"},
        # Medium priority (some LOADED, some PENDING)
        {"id": "PKG-103", "tn": "RN-98216", "cid": "C03", "w": 28.0,  "v": 850.0,  "p": 4, "st": "PENDING",   "vid": None},
        {"id": "PKG-106", "tn": "RN-98219", "cid": "C06", "w": 35.5,  "v": 1900.0, "p": 4, "st": "PENDING",   "vid": None},
        {"id": "PKG-111", "tn": "RN-98224", "cid": "C11", "w": 25.0,  "v": 1400.0, "p": 3, "st": "LOADED",    "vid": "V06"},
        {"id": "PKG-112", "tn": "RN-98225", "cid": "C12", "w": 14.2,  "v": 2800.0, "p": 4, "st": "LOADED",    "vid": "V06"},
        {"id": "PKG-113", "tn": "RN-98226", "cid": "C13", "w": 38.0,  "v": 3100.0, "p": 4, "st": "PENDING",   "vid": None},
        {"id": "PKG-115", "tn": "RN-98228", "cid": "C15", "w": 45.0,  "v": 3900.0, "p": 5, "st": "PENDING",   "vid": None},
        {"id": "PKG-117", "tn": "RN-98230", "cid": "C17", "w": 50.0,  "v": 2400.0, "p": 4, "st": "PENDING",   "vid": None},
        {"id": "PKG-121", "tn": "RN-98234", "cid": "C21", "w": 22.5,  "v": 1750.0, "p": 3, "st": "PENDING",   "vid": None},
        {"id": "PKG-123", "tn": "RN-98236", "cid": "C23", "w": 55.0,  "v": 2200.0, "p": 4, "st": "PENDING",   "vid": None},
        {"id": "PKG-129", "tn": "RN-98242", "cid": "C29", "w": 32.0,  "v": 1600.0, "p": 3, "st": "PENDING",   "vid": None},
        {"id": "PKG-131", "tn": "RN-98244", "cid": "C31", "w": 18.0,  "v": 2100.0, "p": 4, "st": "PENDING",   "vid": None},
        {"id": "PKG-132", "tn": "RN-98245", "cid": "C32", "w": 12.5,  "v": 980.0,  "p": 3, "st": "PENDING",   "vid": None},
        # Lower priority (PENDING — optimization candidates)
        {"id": "PKG-104", "tn": "RN-98217", "cid": "C04", "w": 42.0,  "v": 2100.0, "p": 3, "st": "PENDING",   "vid": None},
        {"id": "PKG-107", "tn": "RN-98220", "cid": "C07", "w": 22.0,  "v": 600.0,  "p": 2, "st": "PENDING",   "vid": None},
        {"id": "PKG-109", "tn": "RN-98222", "cid": "C09", "w": 30.0,  "v": 1750.0, "p": 3, "st": "PENDING",   "vid": None},
        {"id": "PKG-110", "tn": "RN-98223", "cid": "C10", "w": 8.4,   "v": 950.0,  "p": 2, "st": "PENDING",   "vid": None},
        {"id": "PKG-114", "tn": "RN-98227", "cid": "C14", "w": 19.8,  "v": 1650.0, "p": 3, "st": "PENDING",   "vid": None},
        {"id": "PKG-119", "tn": "RN-98232", "cid": "C19", "w": 27.5,  "v": 800.0,  "p": 2, "st": "PENDING",   "vid": None},
        {"id": "PKG-124", "tn": "RN-98237", "cid": "C24", "w": 15.0,  "v": 700.0,  "p": 2, "st": "PENDING",   "vid": None},
        {"id": "PKG-125", "tn": "RN-98238", "cid": "C25", "w": 9.5,   "v": 1050.0, "p": 3, "st": "PENDING",   "vid": None},
        # Already delivered (history)
        {"id": "PKG-108", "tn": "RN-98221", "cid": "C08", "w": 15.0,  "v": 1100.0, "p": 3, "st": "DELIVERED", "vid": "V01"},
        {"id": "PKG-116", "tn": "RN-98229", "cid": "C16", "w": 9.5,   "v": 1300.0, "p": 3, "st": "DELIVERED", "vid": "V01"},
        {"id": "PKG-133", "tn": "RN-HOSP-01", "cid": "C33", "w": 7.5, "v": 4100.0, "p": 5, "st": "PENDING", "vid": None},
        {"id": "PKG-134", "tn": "RN-HOSP-02", "cid": "C34", "w": 6.0, "v": 3900.0, "p": 5, "st": "PENDING", "vid": None},
        {"id": "PKG-135", "tn": "RN-HOSP-03", "cid": "C38", "w": 4.8, "v": 5200.0, "p": 5, "st": "PENDING", "vid": None},
        {"id": "PKG-136", "tn": "RN-MG-4401", "cid": "C36", "w": 21.0, "v": 1450.0, "p": 3, "st": "PENDING", "vid": None},
        {"id": "PKG-137", "tn": "RN-CP-1188", "cid": "C37", "w": 13.0, "v": 2200.0, "p": 4, "st": "PENDING", "vid": None},
        {"id": "PKG-138", "tn": "RN-CYBER-9", "cid": "C40", "w": 16.5, "v": 2600.0, "p": 4, "st": "PENDING", "vid": None},
    ]

    for p in packages_data:
        db.add(Package(
            id=p["id"],
            tracking_number=p["tn"],
            customer_id=p["cid"],
            weight_kg=p["w"],
            value_usd=p["v"],
            priority=p["p"],
            status=p["st"],
            assigned_vehicle_id=p["vid"]
        ))

    # ─── 4. Fleet Vehicles ────────────────────────────────────────────
    # 8 vehicles covering all operational states
    vehicles_data = [
        {   # ACTIVE — near full capacity, on route north zone
            "id": "V01", "num": "DL-01-EV-4091", "driver": "Rajesh Kumar",
            "cap": 300.0, "load": 228.0, "status": "ACTIVE",
            "lat": 28.6100, "lng": 77.1800,
            "route": json.dumps(["W1", "N01", "N05", "N10", "C01", "C26"])
        },
        {   # ACTIVE — high value south zone run
            "id": "V02", "num": "DL-03-EV-8812", "driver": "Amit Singh",
            "cap": 250.0, "load": 238.0, "status": "ACTIVE",
            "lat": 28.5400, "lng": 77.2400,
            "route": json.dumps(["W1", "N02", "N08", "C02", "C05", "C18", "C28"])
        },
        {   # ACTIVE — large capacity heavy cargo
            "id": "V03", "num": "HR-26-CC-1920", "driver": "Vikram Verma",
            "cap": 400.0, "load": 350.0, "status": "ACTIVE",
            "lat": 28.6800, "lng": 77.1300,
            "route": json.dumps(["W1", "N03", "N11", "C11", "C12", "C18"])
        },
        {   # ACTIVE — airport/central zone run
            "id": "V04", "num": "UP-14-BT-9041", "driver": "Sanjay Sharma",
            "cap": 350.0, "load": 205.0, "status": "ACTIVE",
            "lat": 28.5600, "lng": 77.1100,
            "route": json.dumps(["W1", "N04", "C22", "C30", "C31"])
        },
        {   # ACTIVE — cargo terminal high priority
            "id": "V05", "num": "DL-10-EV-5544", "driver": "Pankaj Yadav",
            "cap": 250.0, "load": 155.0, "status": "ACTIVE",
            "lat": 28.5640, "lng": 77.0900,
            "route": json.dumps(["W1", "C30", "C22"])
        },
        {   # LOADING — being loaded at warehouse
            "id": "V06", "num": "HR-55-EX-7781", "driver": "Manoj Tiwari",
            "cap": 500.0, "load": 180.0, "status": "LOADING",
            "lat": 28.5521, "lng": 77.0589,
            "route": json.dumps(["W1", "C11", "C12", "C21", "C25"])
        },
        {   # IDLE — awaiting dispatch, available for optimization
            "id": "V07", "num": "DL-22-EV-3310", "driver": "Arjun Mehta",
            "cap": 300.0, "load": 0.0, "status": "IDLE",
            "lat": 28.5521, "lng": 77.0589,
            "route": json.dumps(["W1"])
        },
        {   # DELAYED — stuck in network bottleneck — real problem for fleet manager
            "id": "V08", "num": "HR-09-GT-9981", "driver": "Deepak Rawat",
            "cap": 350.0, "load": 120.0, "status": "DELAYED",
            "lat": 28.5710, "lng": 77.2580,  # Stuck near Ashram Chowk bottleneck
            "route": json.dumps(["W1", "N08", "HUB_SOUTH", "C23"])
        },
    ]

    for v in vehicles_data:
        db.add(Vehicle(
            id=v["id"],
            vehicle_number=v["num"],
            driver_name=v["driver"],
            payload_capacity_kg=v["cap"],
            current_load_kg=v["load"],
            status=v["status"],
            current_latitude=v["lat"],
            current_longitude=v["lng"],
            current_route=v["route"]
        ))

    # ─── 5. Graph Network Nodes ───────────────────────────────────────
    # 15 nodes: 1 warehouse, 1 hub sink, 13 real Delhi road intersections
    nodes_data = [
        {"id": "W1",       "label": "Dwarka Central Warehouse",    "type": "WAREHOUSE",     "lat": 28.5521, "lng": 77.0589},
        {"id": "N01",      "label": "Dhaula Kuan Junction",        "type": "INTERSECTION",  "lat": 28.5920, "lng": 77.1620},
        {"id": "N02",      "label": "AIIMS Flyover Hub",            "type": "INTERSECTION",  "lat": 28.5670, "lng": 77.2100},
        {"id": "N03",      "label": "Punjabi Bagh Cloverleaf",     "type": "INTERSECTION",  "lat": 28.6670, "lng": 77.1240},
        {"id": "N04",      "label": "Iffco Chowk Expressway",      "type": "INTERSECTION",  "lat": 28.4720, "lng": 77.0720},
        {"id": "N05",      "label": "Rajiv Chowk (CP)",            "type": "INTERSECTION",  "lat": 28.6315, "lng": 77.2167},
        {"id": "N06",      "label": "Noida Toll Bridge",           "type": "INTERSECTION",  "lat": 28.5630, "lng": 77.3020},
        {"id": "N07",      "label": "Akshardham Corridor",         "type": "INTERSECTION",  "lat": 28.6120, "lng": 77.2780},
        {"id": "N08",      "label": "Ashram Chowk",                "type": "INTERSECTION",  "lat": 28.5710, "lng": 77.2580},
        {"id": "N09",      "label": "Rajouri Garden Junction",     "type": "INTERSECTION",  "lat": 28.6490, "lng": 77.1220},
        {"id": "N10",      "label": "ISBT Kashmiri Gate",          "type": "INTERSECTION",  "lat": 28.6670, "lng": 77.2280},
        {"id": "N11",      "label": "Rohtak Road Flyover",         "type": "INTERSECTION",  "lat": 28.6900, "lng": 77.1510},
        {"id": "N12",      "label": "Nehru Place Interchange",     "type": "INTERSECTION",  "lat": 28.5494, "lng": 77.2509},
        {"id": "N13",      "label": "DND Kalindi Crossing",        "type": "INTERSECTION",  "lat": 28.5530, "lng": 77.2940},
        {"id": "HUB_SOUTH","label": "Okhla Regional Hub (Sink)",   "type": "HUB",           "lat": 28.5360, "lng": 77.2710},
    ]

    for n in nodes_data:
        db.add(GraphNode(
            id=n["id"],
            label=n["label"],
            type=n["type"],
            latitude=n["lat"],
            longitude=n["lng"]
        ))

    # ─── 6. Graph Network Edges ───────────────────────────────────────
    # 18 edges — deliberately include:
    #   • High-capacity expressways  
    #   • A BOTTLENECK (Ashram Chowk → Hub, cap=800 — critical for Edmonds-Karp)
    #   • A second path around the bottleneck
    edges_data = [
        {"id": "E01",  "src": "W1",       "tgt": "N01",      "name": "NH-48 Dwarka Expressway",       "dist": 11.5, "cap": 2500.0},
        {"id": "E02",  "src": "W1",       "tgt": "N03",      "name": "Outer Ring Road North",          "dist": 14.0, "cap": 1800.0},
        {"id": "E03",  "src": "W1",       "tgt": "N04",      "name": "Gurugram Link Road",             "dist": 9.2,  "cap": 2200.0},
        {"id": "E04",  "src": "N01",      "tgt": "N02",      "name": "Ring Road South",                "dist": 6.8,  "cap": 1500.0},
        {"id": "E05",  "src": "N01",      "tgt": "N05",      "name": "Vande Mataram Marg",             "dist": 8.0,  "cap": 1400.0},
        {"id": "E06",  "src": "N02",      "tgt": "N08",      "name": "Inner Ring Road Ashram",         "dist": 5.4,  "cap": 1200.0},
        {"id": "E07",  "src": "N02",      "tgt": "HUB_SOUTH","name": "Okhla Estate Road",              "dist": 4.5,  "cap": 1600.0},
        {"id": "E08",  "src": "N03",      "tgt": "N09",      "name": "Najafgarh Road Corridor",        "dist": 3.2,  "cap": 1100.0},
        {"id": "E09",  "src": "N03",      "tgt": "N10",      "name": "Rohtak Road Expressway",         "dist": 12.0, "cap": 1700.0},
        {"id": "E10",  "src": "N05",      "tgt": "N10",      "name": "Deen Dayal Upadhyaya Marg",      "dist": 4.1,  "cap": 1300.0},
        {"id": "E11",  "src": "N05",      "tgt": "N07",      "name": "Vikas Marg East",                "dist": 7.5,  "cap": 1000.0},
        {"id": "E12",  "src": "N07",      "tgt": "N06",      "name": "Mayur Vihar Highway",            "dist": 5.8,  "cap": 1900.0},
        {"id": "E13",  "src": "N06",      "tgt": "HUB_SOUTH","name": "DND Flyway Expressway",          "dist": 6.2,  "cap": 2800.0},
        # ★ BOTTLENECK — intentionally low capacity (Edmonds-Karp will detect this)
        {"id": "E14",  "src": "N08",      "tgt": "HUB_SOUTH","name": "Mathura Road Bottleneck",        "dist": 3.8,  "cap": 800.0},
        # Alternative routes
        {"id": "E15",  "src": "N12",      "tgt": "HUB_SOUTH","name": "Nehru Place Bypass Road",        "dist": 2.9,  "cap": 1050.0},
        {"id": "E16",  "src": "N02",      "tgt": "N12",      "name": "Ring Road Nehru Connector",      "dist": 4.2,  "cap": 1350.0},
        {"id": "E17",  "src": "N13",      "tgt": "HUB_SOUTH","name": "Kalindi Kunj Southern Bypass",   "dist": 5.1,  "cap": 1100.0},
        {"id": "E18",  "src": "N06",      "tgt": "N13",      "name": "Noida-Greater Noida Expressway", "dist": 4.7,  "cap": 2000.0},
        {"id": "E19",  "src": "N03",      "tgt": "N11",      "name": "Pitampura Road Connector",       "dist": 3.5,  "cap": 1200.0},
        {"id": "E20",  "src": "N11",      "tgt": "N10",      "name": "GTK Road Extension",             "dist": 4.0,  "cap": 950.0},
    ]

    for e in edges_data:
        db.add(GraphEdge(
            id=e["id"],
            source=e["src"],
            target=e["tgt"],
            road_name=e["name"],
            distance_km=e["dist"],
            capacity_vehicles_per_hr=e["cap"],
            bidirectional=True
        ))

    # ─── 7. Delivery Zones ────────────────────────────────────────────
    zones_data = [
        {"id": "Z_NORTH",   "name": "North Delhi Zone",          "color": "#3B82F6", "lat": 28.6900, "lng": 77.1600, "area": 85.4,  "count": 8},
        {"id": "Z_SOUTH",   "name": "South & Faridabad Zone",    "color": "#10B981", "lat": 28.5200, "lng": 77.2600, "area": 138.0, "count": 9},
        {"id": "Z_EAST",    "name": "East Trans-Yamuna Zone",    "color": "#8B5CF6", "lat": 28.6200, "lng": 77.3500, "area": 95.8,  "count": 6},
        {"id": "Z_WEST",    "name": "West Cyber & Gurugram Zone","color": "#F59E0B", "lat": 28.5000, "lng": 77.0700, "area": 120.2, "count": 5},
        {"id": "Z_CENTRAL", "name": "Central Airport Corridor",  "color": "#EF4444", "lat": 28.5550, "lng": 77.1000, "area": 42.3,  "count": 4},
    ]

    for z in zones_data:
        db.add(Zone(
            id=z["id"],
            name=z["name"],
            color=z["color"],
            centroid_lat=z["lat"],
            centroid_lng=z["lng"],
            area_sq_km=z["area"],
            customer_count=z["count"]
        ))

    db.commit()


def _upsert_extra_search_records(db: Session):
    """Add KMP-searchable hospitals / landmarks if this DB was seeded before they existed."""
    extra_customers = [
        {"id": "C33", "name": "Safdarjung Hospital Pharmacy", "address": "Ansari Nagar, Safdarjung Hospital, New Delhi", "lat": 28.5680, "lng": 77.2080, "priority": 5, "zone": "Z_SOUTH"},
        {"id": "C34", "name": "Max Super Speciality Hospital", "address": "Press Enclave Road, Saket, New Delhi", "lat": 28.5275, "lng": 77.2115, "priority": 5, "zone": "Z_SOUTH"},
        {"id": "C35", "name": "Fortis Hospital Noida", "address": "B-22, Sector 62, Noida", "lat": 28.6205, "lng": 77.3640, "priority": 5, "zone": "Z_EAST"},
        {"id": "C36", "name": "MG Road Electronics Bazaar", "address": "123 MG Road, Gurgaon Sector 14", "lat": 28.4740, "lng": 77.0800, "priority": 3, "zone": "Z_WEST"},
        {"id": "C37", "name": "Connaught Place Flagship Store", "address": "A-12 Inner Circle, Connaught Place, New Delhi", "lat": 28.6328, "lng": 77.2197, "priority": 4, "zone": "Z_NORTH"},
        {"id": "C38", "name": "AIIMS Trauma Centre", "address": "Ansari Nagar East, AIIMS, New Delhi", "lat": 28.5665, "lng": 77.2110, "priority": 5, "zone": "Z_SOUTH"},
        {"id": "C39", "name": "Dwarka Sector 21 Metro Depot", "address": "Sector 21, Dwarka Expressway, New Delhi", "lat": 28.5528, "lng": 77.0580, "priority": 3, "zone": "Z_WEST"},
        {"id": "C40", "name": "Cyber Hub Gurugram Retail", "address": "DLF Cyber Hub, Cyber City, Gurugram", "lat": 28.4948, "lng": 77.0885, "priority": 4, "zone": "Z_WEST"},
    ]
    extra_packages = [
        {"id": "PKG-133", "tn": "RN-HOSP-01", "cid": "C33", "w": 7.5, "v": 4100.0, "p": 5, "st": "PENDING", "vid": None},
        {"id": "PKG-134", "tn": "RN-HOSP-02", "cid": "C34", "w": 6.0, "v": 3900.0, "p": 5, "st": "PENDING", "vid": None},
        {"id": "PKG-135", "tn": "RN-HOSP-03", "cid": "C38", "w": 4.8, "v": 5200.0, "p": 5, "st": "PENDING", "vid": None},
        {"id": "PKG-136", "tn": "RN-MG-4401", "cid": "C36", "w": 21.0, "v": 1450.0, "p": 3, "st": "PENDING", "vid": None},
        {"id": "PKG-137", "tn": "RN-CP-1188", "cid": "C37", "w": 13.0, "v": 2200.0, "p": 4, "st": "PENDING", "vid": None},
        {"id": "PKG-138", "tn": "RN-CYBER-9", "cid": "C40", "w": 16.5, "v": 2600.0, "p": 4, "st": "PENDING", "vid": None},
    ]
    existing_cids = {row[0] for row in db.query(Customer.id).all()}
    for c in extra_customers:
        if c["id"] not in existing_cids:
            db.add(Customer(
                id=c["id"], name=c["name"], address=c["address"],
                latitude=c["lat"], longitude=c["lng"], priority=c["priority"], zone_id=c["zone"]
            ))
    existing_pids = {row[0] for row in db.query(Package.id).all()}
    for p in extra_packages:
        if p["id"] not in existing_pids:
            db.add(Package(
                id=p["id"], tracking_number=p["tn"], customer_id=p["cid"],
                weight_kg=p["w"], value_usd=p["v"], priority=p["p"],
                status=p["st"], assigned_vehicle_id=p["vid"]
            ))
    db.commit()
