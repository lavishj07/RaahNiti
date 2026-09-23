from app.database.connection import engine, Base, SessionLocal
from app.database import models  # noqa: F401 — register ORM tables
from app.database.seed_data import seed_database

_initialized = False


def init_db() -> None:
    """Create tables and seed demo data. Safe to call on every request (serverless)."""
    global _initialized
    if _initialized:
        return
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    _initialized = True
