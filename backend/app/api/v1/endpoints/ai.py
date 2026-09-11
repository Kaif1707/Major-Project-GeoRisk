from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.response import StandardResponse
from app.schemas.ai import ChatRequest, ChatResponse
from app.services.ai_service import AIService

router = APIRouter()


@router.post("/chat", response_model=StandardResponse[ChatResponse])
async def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db)):
    """Submit natural language risk question to the GeoRisk RAG AI Assistant."""
    result = AIService.process_chat_query(db, request.prompt)
    res = ChatResponse(
        reply=result["reply"],
        confidence=result["confidence"],
        sources=result["sources"]
    )

    return StandardResponse(
        status="success",
        message="AI response generated successfully",
        data=res
    )
