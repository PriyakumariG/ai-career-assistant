import os
from pypdf import PdfReader
from docx import Document


def extract_text_from_file(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        return _extract_from_pdf(file_path)
    elif ext == ".docx":
        return _extract_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")


def _extract_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text_parts = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(text_parts).strip()


def _extract_from_docx(file_path: str) -> str:
    doc = Document(file_path)
    text_parts = [paragraph.text for paragraph in doc.paragraphs]
    return "\n".join(text_parts).strip()