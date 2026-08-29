import json
from google import genai
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

ANALYSIS_PROMPT = """You are an expert ATS (Applicant Tracking System) and career coach.
Analyze the resume below{job_context}.

Return ONLY valid JSON with this exact structure, no markdown formatting, no extra text:
{{
  "ats_score": <integer 0-100>,
  "missing_skills": [<list of strings>],
  "suggestions": "<2-4 sentences of specific, actionable feedback>"
}}

Resume text:
\"\"\"
{resume_text}
\"\"\"
{job_description_block}
"""


def analyze_resume(resume_text: str, job_description: str | None = None) -> dict:
    if job_description:
        job_context = " against the job description provided below"
        job_description_block = f'\nJob description:\n"""\n{job_description}\n"""\n'
    else:
        job_context = " for general ATS compatibility and quality"
        job_description_block = ""

    prompt = ANALYSIS_PROMPT.format(
        job_context=job_context,
        resume_text=resume_text,
        job_description_block=job_description_block,
    )

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={"response_mime_type": "application/json"},
    )

    result = json.loads(response.text)

    return {
        "ats_score": result.get("ats_score"),
        "missing_skills": result.get("missing_skills", []),
        "suggestions": result.get("suggestions", ""),
    }


COVER_LETTER_PROMPT = """You are an expert career coach and professional writer.
Write a compelling, personalized cover letter based on the resume below{job_context}.

Guidelines:
- Keep it to 3-4 short paragraphs
- Sound genuine and specific, not generic or robotic
- Reference real details from the resume (actual projects, skills, experience)
- If a job description is provided, tailor the letter directly to it
- Do not use placeholder brackets like [Company Name] — write it as ready-to-use prose, addressing it generally (e.g. "Dear Hiring Manager")

Return ONLY valid JSON with this exact structure, no markdown formatting, no extra text:
{{
  "cover_letter": "<the full cover letter text, with paragraphs separated by \\n\\n>"
}}

Resume text:
\"\"\"
{resume_text}
\"\"\"
{job_description_block}
"""


def generate_cover_letter(resume_text: str, job_description: str | None = None) -> str:
    if job_description:
        job_context = ", tailored to the job description provided below"
        job_description_block = f'\nJob description:\n"""\n{job_description}\n"""\n'
    else:
        job_context = ""
        job_description_block = ""

    prompt = COVER_LETTER_PROMPT.format(
        job_context=job_context,
        resume_text=resume_text,
        job_description_block=job_description_block,
    )

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={"response_mime_type": "application/json"},
    )

    result = json.loads(response.text)
    return result.get("cover_letter", "")

INTERVIEW_QUESTIONS_PROMPT = """You are an experienced technical interviewer and career coach.
Based on the resume below{job_context}, generate likely interview questions this candidate should prepare for.

Guidelines:
- Generate 6-8 questions total
- Mix of question types: behavioral, technical/skills-based, and resume-specific (asking about actual projects/experience mentioned)
- For each question, include a short tip on how to approach answering it
- Base technical questions on the actual skills/technologies mentioned in the resume (and job description, if provided)

Return ONLY valid JSON with this exact structure, no markdown formatting, no extra text:
{{
  "questions": [
    {{"question": "<the interview question>", "tip": "<1-2 sentence tip on answering it well>", "category": "<one of: Behavioral, Technical, Resume-Specific>"}}
  ]
}}

Resume text:
\"\"\"
{resume_text}
\"\"\"
{job_description_block}
"""


def generate_interview_questions(resume_text: str, job_description: str | None = None) -> list[dict]:
    if job_description:
        job_context = " and the job description provided below"
        job_description_block = f'\nJob description:\n"""\n{job_description}\n"""\n'
    else:
        job_context = ""
        job_description_block = ""

    prompt = INTERVIEW_QUESTIONS_PROMPT.format(
        job_context=job_context,
        resume_text=resume_text,
        job_description_block=job_description_block,
    )

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={"response_mime_type": "application/json"},
    )

    result = json.loads(response.text)
    return result.get("questions", [])