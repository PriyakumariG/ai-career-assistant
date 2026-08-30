from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    question: str
    conversation_history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    answer: str