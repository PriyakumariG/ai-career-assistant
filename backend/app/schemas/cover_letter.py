from pydantic import BaseModel


class CoverLetterRequest(BaseModel):
    job_description: str | None = None


class CoverLetterResponse(BaseModel):
    cover_letter: str