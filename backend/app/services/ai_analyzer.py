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