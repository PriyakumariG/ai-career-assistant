import json
from google import genai
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

ANALYSIS_PROMPT = """You are an expert ATS (Applicant Tracking System) and career coach.
Analyze the resume below{job_context}.

Return ONLY valid JSON with this exact structure, no markdown formatting, no extra text:
{{
  "ats_score": <integer 0-100>,
  "matched_skills": [<list of skills from the resume that are relevant/strong>],
  "missing_skills": [<list of strings>],
  "suggestions": "<2-4 sentences of specific, actionable feedback>",
  "experience_match": <integer 0-100, or null if no job description was provided>,
  "keyword_match": <integer 0-100, or null if no job description was provided>
}}

Notes:
- "matched_skills" should list skills genuinely present and demonstrated in the resume.
- "experience_match" should reflect how well the years/type of experience align with what the job description asks for (only meaningful when a job description is provided).
- "keyword_match" should reflect what percentage of the job description's key terms/technologies appear in the resume (only meaningful when a job description is provided).
- If no job description is provided, set "experience_match" and "keyword_match" to null.

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
        "matched_skills": result.get("matched_skills", []),
        "missing_skills": result.get("missing_skills", []),
        "suggestions": result.get("suggestions", ""),
        "experience_match": result.get("experience_match"),
        "keyword_match": result.get("keyword_match"),
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

ROADMAP_PROMPT = """You are an expert technical mentor helping a job seeker close skill gaps.
Based on the resume below and this list of missing/target skills, create a structured learning roadmap.

Missing skills to address: {missing_skills}
{job_context}

Guidelines:
- Organize into 3-5 phases (e.g., "Weeks 1-2: Foundations")
- Each phase should focus on 1-3 related skills, not scatter everything at once
- For each phase, give 2-3 concrete, actionable learning steps (specific topics, types of practice projects — not just "learn X")
- Keep the total roadmap realistic for someone job-hunting alongside this prep (assume ~5-10 hours/week available)
- Do not recommend specific paid courses or named platforms/products; describe the type of resource instead (e.g., "an official documentation walkthrough" or "a hands-on project building X")

Return ONLY valid JSON with this exact structure, no markdown formatting, no extra text:
{{
  "roadmap": [
    {{"phase": "<phase title, e.g. 'Weeks 1-2: Version Control Foundations'>", "skills": [<list of skill strings this phase covers>], "steps": [<list of 2-3 actionable step strings>]}}
  ]
}}

Resume text:
\"\"\"
{resume_text}
\"\"\"
"""


def generate_learning_roadmap(
    resume_text: str, missing_skills: list[str], job_description: str | None = None
) -> list[dict]:
    job_context = (
        f"\nTarget job context: {job_description}\n" if job_description else ""
    )

    prompt = ROADMAP_PROMPT.format(
        missing_skills=", ".join(missing_skills) if missing_skills else "general skill gaps for this resume",
        job_context=job_context,
        resume_text=resume_text,
    )

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={"response_mime_type": "application/json"},
    )

    result = json.loads(response.text)
    return result.get("roadmap", [])

CHAT_SYSTEM_PROMPT = """You are a helpful career assistant answering questions about a specific resume.
Base every answer strictly on the resume content provided below — do not invent experience, skills, or projects that aren't mentioned.
If asked something the resume doesn't provide enough information to answer, say so honestly rather than guessing.
Keep answers concise and conversational (2-4 sentences unless more detail is genuinely needed).

Resume text:
\"\"\"
{resume_text}
\"\"\"
"""


def chat_about_resume(resume_text: str, conversation_history: list[dict], question: str) -> str:
    system_prompt = CHAT_SYSTEM_PROMPT.format(resume_text=resume_text)

    history_text = "\n".join(
        f"{'User' if msg['role'] == 'user' else 'Assistant'}: {msg['content']}"
        for msg in conversation_history
    )

    full_prompt = f"{system_prompt}\n\nConversation so far:\n{history_text}\n\nUser: {question}\nAssistant:"

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=full_prompt,
    )

    return response.text.strip()