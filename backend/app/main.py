from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import health, auth

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(health.router, prefix=settings.API_V1_PREFIX, tags=["Health"])
app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["Auth"])

@app.get("/")
def root():
    return {"message": f"{settings.PROJECT_NAME} API is running!"}