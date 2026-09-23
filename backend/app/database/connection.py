import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


def _resolve_database_url() -> str:
    env_url = os.environ.get("DATABASE_URL")
    if env_url:
        # Render / Heroku-style postgres URLs
        if env_url.startswith("postgres://"):
            return env_url.replace("postgres://", "postgresql://", 1)
        return env_url
    # Vercel serverless filesystem is read-only except /tmp
    if os.environ.get("VERCEL"):
        return "sqlite:////tmp/raahniti.db"
    return "sqlite:///" + os.path.join(os.path.dirname(os.path.abspath(__file__)), "raahniti.db")


DATABASE_URL = _resolve_database_url()
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    from app.database.bootstrap import init_db
    init_db()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
