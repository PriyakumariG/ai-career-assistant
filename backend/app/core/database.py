from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# The "engine" manages the actual connection pool to PostgreSQL
engine = create_engine(settings.DATABASE_URL)

# Each request will get its own "session" - a temporary workspace for DB operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# All our table models will inherit from this Base class
Base = declarative_base()

# Dependency function - FastAPI will call this for routes that need DB access
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()