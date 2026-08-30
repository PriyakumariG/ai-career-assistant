from pydantic import BaseModel
from datetime import datetime


class AnalysisRequest(BaseModel):
    job_description: str | None = None


class AnalysisOut(BaseModel):
    id: int
    ats_score: int | None = None
    matched_skills: list[str] | None = None
    missing_skills: list[str] | None = None
    suggestions: str | None = None
    experience_match: int | None = None
    keyword_match: int | None = None
    job_description: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True