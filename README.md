# RaahNiti — Intelligent Route & Fleet Optimization

> **Tagline**: Visual Algorithmic Logistics Intelligence Platform

RaahNiti is an interactive, map-based logistics intelligence dashboard and fleet management platform engineered for delivery fleet dispatchers and logistics operations managers. Rather than hiding complex algorithms behind static UI buttons, RaahNiti enables users to **see real-world Data Structures and Algorithms (DSA) executing in real-time** across dynamic interactive maps, state matrices, and live vehicle playback simulations.

---

## 1. Project Vision & Core Concept

In modern logistics management (e.g. Amazon Logistics, Uber Freight, Delhivery), fleet managers process multi-constraint variables simultaneously:
- Customer location coordinates & address search queries
- Package payload weights vs truck payload capacity limits
- Delivery zone grouping boundaries around destination clusters
- Precomputed shortest road junction distances & turn-by-turn routes
- Road network throughput traffic capacities & congestion bottlenecks

RaahNiti bridges deep algorithmic computer science with state-of-the-art web application design to solve these challenges visually.

---

## 2. System Architecture

```
                                 ┌──────────────────────────────────────────┐
                                 │       Next.js 14 / React 18 UI           │
                                 │   (Tailwind CSS, Glassmorphism Theme,   │
                                 │     Leaflet Map, Framer Motion)          │
                                 └────────────────────┬─────────────────────┘
                                                      │
                                           REST API / JSON Payloads
                                                      │
                                                      v
                                 ┌──────────────────────────────────────────┐
                                 │       FastAPI Python Engine / Vercel     │
                                 │        (SOA Service Controller)          │
                                 └───────┬──────────────────────────┬───────┘
                                         │                          │
                 ┌───────────────────────┴──────────────┐         ┌─┴────────────────────────┐
                 │        Custom Core DSA Engine        │         │   Database Engine        │
                 ├──────────────────────────────────────┤         ├──────────────────────────┤
                 │ • KMP String Match       O(N + M)    │         │ PostgreSQL / SQLite      │
                 │ • 0/1 Knapsack DP        O(N · W)    │         │ (SQLAlchemy ORM + Seed)  │
                 │ • Graham's Scan Hull     O(N log N)  │         └──────────────────────────┘
                 │ • Floyd-Warshall        O(V³)       │
                 │ • Edmonds-Karp Max Flow  O(V · E²)    │
                 └──────────────────────────────────────┘
```

---

## 3. Core Algorithms Breakdown

### 1. Knuth-Morris-Pratt (KMP) — Address & Customer Search
- **Problem**: Efficient pattern matching across customer names, addresses, and tracking numbers.
- **Intuition**: Computes a Longest Prefix Suffix (LPS) table in $O(M)$ preprocessing time. When a mismatch occurs at index `j`, the pattern pointer falls back to `LPS[j-1]` without re-scanning text characters.
- **Complexity**: Time: $O(N + M)$ | Space: $O(M)$
- **RaahNiti Use Case**: Instant global search bar highlighting matching address indices and tracking comparison metrics.

### 2. 0/1 Knapsack Dynamic Programming — Truck Cargo Loader
- **Problem**: Select optimal package subset to maximize total cargo priority and value within truck payload capacity $W$.
- **Intuition**: Builds a 2D DP matrix $DP[i][w] = \max(DP[i-1][w], DP[i-1][w-wt[i]] + val[i])$. Backtracks through matrix to isolate selected vs rejected packages.
- **Complexity**: Time: $O(N \cdot W)$ | Space: $O(N \cdot W)$
- **RaahNiti Use Case**: Packs delivery trucks to maximum payload efficiency without exceeding weight limits.

### 3. Graham's Scan — Delivery Zone Boundaries
- **Problem**: Construct minimal convex polygon boundary enclosing delivery destination coordinate clusters.
- **Intuition**: Selects pivot $P_0$ (lowest Y, lowest X). Sorts remaining points by polar angle relative to $P_0$. Uses stack manipulation to pop points creating clockwise/collinear turns via cross product.
- **Complexity**: Time: $O(N \log N)$ | Space: $O(N)$
- **RaahNiti Use Case**: Generates convex delivery zone polygons on interactive Leaflet maps.

### 4. Floyd-Warshall — All-Pairs Shortest Path Matrix
- **Problem**: Precompute shortest distance between all road intersection pairs.
- **Intuition**: Dynamic programming considering all vertices $\{0..k\}$ as intermediate nodes: $dist[i][j] = \min(dist[i][j], dist[i][k] + dist[k][j])$.
- **Complexity**: Time: $O(V^3)$ | Space: $O(V^2)$
- **RaahNiti Use Case**: Precomputes road network distance matrices to calculate ETAs and optimal routes for fleet drivers.

### 5. Edmonds-Karp — Road Network Capacity & Traffic Bottlenecks
- **Problem**: Calculate maximum vehicle flow throughput from Central Warehouse (Source) to Regional Hubs (Sink) across capacity-constrained road edges.
- **Intuition**: Ford-Fulkerson algorithm using Breadth-First Search (BFS) to discover shortest augmenting paths in the residual capacity graph.
- **Complexity**: Time: $O(V \cdot E^2)$ | Space: $O(V + E)$
- **RaahNiti Use Case**: Identifies saturated bottleneck road segments across Delhi NCR highways for pro-active fleet rerouting.

---

## 4. Local Setup & Execution Guide

### Prerequisites
- Node.js 18+ & npm 9+
- Python 3.10+
- (Optional) Docker & Docker Compose

### 1. Clone & Database Setup
RaahNiti features **dual database support**:
- **Option A (Zero-Config SQLite)**: Runs automatically out of the box with zero external dependencies.
- **Option B (PostgreSQL via Docker)**:
  ```bash
  docker-compose up -d
  ```

### 2. Backend Setup (FastAPI Python Engine)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run backend unit tests
PYTHONPATH=. pytest app/tests/

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
*API Documentation will be available at `http://127.0.0.1:8000/docs`.*

### 3. Frontend Setup (Next.js Command Center)
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:3000` in your web browser.*

---

## 5. Environment Variables

Create `.env.local` in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Create `.env` in `backend/`:
```env
# Optional: Omit DATABASE_URL to automatically use local SQLite fallback
DATABASE_URL=postgresql://raahniti_user:raahniti_secure_password@localhost:5432/raahniti_db
```

---

## 6. Testing & Quality Verification

```bash
# Run all backend unit & API integration tests
PYTHONPATH=backend backend/venv/bin/pytest backend/app/tests/

# Run frontend build check
cd frontend && npm run build
```

---

## 7. Deployment to Vercel

RaahNiti is architected for single-repository Vercel deployment:
1. Push repository to your private GitHub/Vercel project.
2. Ensure `vercel.json` is located in the root directory.
3. Configure Environment Variables in Vercel Dashboard:
   - `NEXT_PUBLIC_API_URL` -> `/api`
4. Deploy! Next.js will serve the UI and `api/index.py` will run FastAPI serverless endpoints.

---

## 8. Interview / Viva Talking Points

### Q1: Why KMP over standard string `.includes()` search?
> **Answer**: Standard naive search takes $O(N \cdot M)$ worst-case time because it backtracks pattern matching upon every mismatch. KMP computes an $O(M)$ LPS table that dictates the exact pattern index to resume matching, guaranteeing $O(N + M)$ total time regardless of repetitive text structures.

### Q2: Why 0/1 Knapsack over Fractional Knapsack?
> **Answer**: Fractional Knapsack assumes cargo items can be split into arbitrary fractional quantities (solved greedily in $O(N \log N)$). In real-world logistics, delivery packages are indivisible 0/1 entities—a box cannot be half-delivered. Thus, 0/1 Dynamic Programming is mathematically required.

### Q3: Why Graham's Scan for delivery zoning?
> **Answer**: Graham's Scan computes the exact minimal convex hull enclosure of 2D coordinates in $O(N \log N)$ time by polar angle sorting and stack cross-product turn checking. It guarantees zero boundary overlap and optimal convex perimeter geometry for fleet dispatchers.

### Q4: Why Floyd-Warshall instead of running Dijkstra multiple times?
> **Answer**: Floyd-Warshall operates directly on adjacency matrices with simple triple nested loops $O(V^3)$, which is extremely cache-friendly and easy to snapshot for all-pairs distance matrices. Running Dijkstra $V$ times with min-heaps takes $O(V \cdot E \log V)$, which becomes more complex for dense all-pairs road network matrix precomputation.

### Q5: Why Edmonds-Karp for road network capacity analysis?
> **Answer**: Edmonds-Karp guarantees that Ford-Fulkerson terminates in $O(V \cdot E^2)$ by selecting the shortest augmenting path in terms of edge count using BFS. This prevents infinite loops or pseudo-polynomial iterations on irrational capacities and pinpoints exact saturated bottleneck road edges.

---

## 9. Git Safety Confirmation

> **Explicit Confirmation**: No GitHub repository, remote branch, pull request, or remote files were modified during this development process. All changes remain strictly on your local machine.
