from pydantic import BaseModel


class InterviewQuestionsRequest(BaseModel):
    job_description: str | None = None


class InterviewQuestion(BaseModel):
    question: str
    tip: str
    category: str


class InterviewQuestionsResponse(BaseModel):
    questions: list[InterviewQuestion]