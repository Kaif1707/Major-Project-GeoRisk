from typing import Optional, List
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    prompt: str = Field(..., min_length=2, description="User question or risk query")


class ChatResponse(BaseModel):
    reply: str
    confidence: float
    sources: List[str] = []
