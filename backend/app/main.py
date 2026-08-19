from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import health
from sqlalchemy import text

from app import models  # noqa

 

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(health.router, prefix=settings.API_V1_PREFIX, tags=["Health"])

@app.get("/")
def root():
    return {"message": f"{settings.PROJECT_NAME} API is running!"}

@app.get("/test-db")
def test_db():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        return {"db_connected": True, "result": result.scalar()}

    