from sqlalchemy.orm import Session
from app.ai.assistant import GeoRiskAIAssistant


class AIService:
    @staticmethod
    def process_chat_query(db: Session, prompt: str) -> dict:
        """Process conversational query using GeoRisk RAG AI Assistant."""
        return GeoRiskAIAssistant.answer_query(db, prompt)
