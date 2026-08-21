from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import health, auth, resume

app = FastAPI(title=settings.PROJECT_NAME)


app.include_router(health.router, prefix=settings.API_V1_PREFIX, tags=["Health"])
app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["Auth"])
app.include_router(resume.router, prefix=f"{settings.API_V1_PREFIX}/resumes", tags=["Resumes"])


@app.get("/")
def root():
    return {"message": f"{settings.PROJECT_NAME} API is running!"}