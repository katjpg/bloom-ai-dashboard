from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from agents.moderation import ChatMessage, ModerationState
from agents.sentiment import SentimentAnalysisState
from services.chat import ChatService

router = APIRouter(prefix="/api/v1", tags=["chat"])
chat_service = ChatService()


# Response models
class ModerationResponse(BaseModel):
    moderation_state: ModerationState
    sentiment_analysis: Optional[SentimentAnalysisState] = None
    user_score_updated: bool = False
    new_score: Optional[int] = None


@router.post("/moderate", response_model=ModerationResponse)
async def moderate_message(message: ChatMessage):
    """Main moderation endpoint"""
    try:
        result = await chat_service.process_message(message)
        return ModerationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


@router.get("/users/{user_id}/score")
async def get_user_score(user_id: int):
    """Get user score"""
    try:
        return chat_service.get_user_score(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    """Get leaderboard"""
    try:
        return chat_service.get_leaderboard(limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/stats")
async def get_stats():
    """Get system statistics"""
    try:
        return chat_service.get_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/health")
async def health_check():
    """Health check"""
    return {"status": "healthy", "timestamp": datetime.now()}
