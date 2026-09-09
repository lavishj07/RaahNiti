from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database.connection import engine, Base, SessionLocal
from app.database.seed_data import seed_database
from app.api.data_router import router as data_router
from app.api.algorithms_router import router as algorithms_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed data on startup
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="RaahNiti Engine",
    description="Intelligent Route & Fleet Optimization API Engine powered by Custom DSA Algorithms",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data_router)
app.include_router(algorithms_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "RaahNiti Logistics Intelligence Platform Engine",
        "algorithms": ["KMP", "0/1 Knapsack", "Graham Scan", "Floyd-Warshall", "Edmonds-Karp"]
    }
