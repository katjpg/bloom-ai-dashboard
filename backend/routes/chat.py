import random
import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

from agents.moderation import ChatMessage, ModerationState
from agents.sentiment.state import ChatAnalysis, CommunityIntent
from services.chat import ChatService
from services.sentiment import SentimentService
from routes.data import supabase

router = APIRouter(prefix="/api/v1", tags=["chat"])
chat_service = ChatService()
sentiment_service = SentimentService()
logger = logging.getLogger(__name__)


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
    # Generate random values if not provided
    player_id = request.player_id if request.player_id is not None else random.randint(1, 100)
    player_name = request.player_name if request.player_name is not None else f"Player{random.randint(1, 999)}"
    
    logger.info(f"Processing sentiment: Player ID: {player_id}, Player Name: {player_name}")
    
    try:
        # Convert request to ChatMessage format for sentiment analysis
        sentiment_message = ChatMessage(
            message=request.message,
            message_id=request.message_id,
            player_id=player_id,
            player_name=player_name
        )
        
        # Analyze sentiment
        sentiment_result = await sentiment_service.analyze_message_sentiment(sentiment_message)
        
        # Store data in Supabase
        try:
            # Store player data
            player_data = {
                "player_id": player_id,
                "player_name": player_name,
                "last_seen": datetime.now(timezone.utc).isoformat()
            }
            supabase.table('players').upsert(player_data).execute()
            
            # Store message data
            message_data = {
                "message_id": request.message_id,
                "player_id": player_id,
                "message": request.message,
                "sentiment_score": sentiment_result.chat_analysis.sentiment_score or 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            supabase.table('messages').insert(message_data).execute()
            
            # Update player sentiment score
            supabase.rpc('update_player_sentiment_score').execute()
            logger.info("Data stored in Supabase successfully")
            
        except Exception as db_error:
            logger.error(f"Supabase storage error: {db_error}")
        
        return sentiment_result.chat_analysis
        
    except Exception as e:
        return ChatAnalysis(
            chat=ChatMessage(
                message=request.message,
                message_id=request.message_id,
                player_id=player_id,
                player_name=player_name
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
