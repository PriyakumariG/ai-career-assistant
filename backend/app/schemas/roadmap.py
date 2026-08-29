from pydantic import BaseModel


class RoadmapRequest(BaseModel):
    missing_skills: list[str] = []
    job_description: str | None = None


class RoadmapPhase(BaseModel):
    phase: str
    skills: list[str]
    steps: list[str]


class RoadmapResponse(BaseModel):
    roadmap: list[RoadmapPhase]