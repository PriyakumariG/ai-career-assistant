from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.routes.auth import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisRequest, AnalysisOut
from app.services.ai_analyzer import analyze_resume

router = APIRouter()


@router.post("/resumes/{resume_id}/analyze", response_model=AnalysisOut, status_code=201)
def analyze(
    resume_id: int,
    request: AnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id, Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if not resume.extracted_text:
        raise HTTPException(status_code=400, detail="Resume has no extracted text to analyze")

    try:
        result = analyze_resume(resume.extracted_text, request.job_description)
    except Exception:
        raise HTTPException(status_code=502, detail="AI analysis failed, please try again")

    analysis = Analysis(
        resume_id=resume.id,
        ats_score=result["ats_score"],
        missing_skills=result["missing_skills"],
        suggestions=result["suggestions"],
        job_description=request.job_description,
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis