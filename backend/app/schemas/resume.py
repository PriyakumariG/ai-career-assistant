from pydantic import BaseModel
from datetime import datetime


class ResumeOut(BaseModel):
    id: int
    file_name: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


class ResumeDetail(ResumeOut):
    extracted_text: str | None = None