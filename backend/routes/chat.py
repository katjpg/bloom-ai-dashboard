from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from agents.moderation import ChatMessage, ModerationState
from agents.sentiment.state import ChatAnalysis, CommunityIntent
from services.chat import ChatService
from services.sentiment import SentimentService

router = APIRouter(prefix="/api/v1", tags=["chat"])
chat_service = ChatService()
sentiment_service = SentimentService()


# Pydantic models for request/response
class AnalyzeRequest(BaseModel):
    message: str
    message_id: str
    player_id: Optional[int] = None
    player_name: Optional[str] = None


# Response models
class ModerationResponse(BaseModel):
    moderation_state: ModerationState


@router.post("/moderate", response_model=ModerationResponse)
async def moderate_message(request: ChatMessage):
    """Moderation endpoint - only returns moderation state"""
    try:
        moderation_state = await chat_service.moderate_message(request)
        return ModerationResponse(moderation_state=moderation_state)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Moderation error: {str(e)}")


@router.post("/sentiment", response_model=ChatAnalysis)
async def analyze_sentiment(request: AnalyzeRequest):
    """Sentiment analysis endpoint"""
    try:
        # Convert request to ChatMessage format for sentiment analysis
        sentiment_message = ChatMessage(
            message=request.message,
            message_id=request.message_id,
            player_id=request.player_id,
            player_name=request.player_name
        )
        
        # Analyze sentiment
        sentiment_result = await sentiment_service.analyze_message_sentiment(sentiment_message)
        
        return sentiment_result.chat_analysis
        
    except Exception as e:
        return ChatAnalysis(
            chat=ChatMessage(
                message=request.message,
                message_id=request.message_id,
                player_id=request.player_id,
                player_name=request.player_name
            ),
            sentiment_score=0,
            community_intent=None,
            error=str(e)
        )


@router.get("/users/{user_id}/score")
async def get_user_score(user_id: int):
    """Get user score"""
    try:
        return sentiment_service.get_user_score(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    """Get leaderboard"""
    try:
        return {"leaderboard": sentiment_service.get_leaderboard(limit)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/stats")
async def get_stats():
    """Get system statistics"""
    try:
        return sentiment_service.get_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/health")
async def health_check():
    """Health check"""
    return {"status": "healthy", "timestamp": datetime.now()}
