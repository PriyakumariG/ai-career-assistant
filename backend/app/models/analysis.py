from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    ats_score = Column(Integer, nullable=True)
    missing_skills = Column(JSON, nullable=True)
    suggestions = Column(Text, nullable=True)
    job_description = Column(Text, nullable=True)
    matched_skills = Column(JSON, nullable=True)
    experience_match = Column(Integer, nullable=True)
    keyword_match = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    resume = relationship("Resume", back_populates="analyses")