from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import health, auth, resume, analysis

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health.router, prefix=settings.API_V1_PREFIX, tags=["Health"])
app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["Auth"])
app.include_router(resume.router, prefix=f"{settings.API_V1_PREFIX}/resumes", tags=["Resumes"])
app.include_router(analysis.router, prefix=settings.API_V1_PREFIX, tags=["Analysis"])


@app.get("/")
def root():
    return {"message": f"{settings.PROJECT_NAME} API is running!"}