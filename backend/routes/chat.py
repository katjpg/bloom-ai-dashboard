import random
import logging
import os
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

from agents.moderation import ChatMessage, ModerationState
from agents.sentiment.state import ChatAnalysis, CommunityIntent
from services.chat import ChatService
from services.sentiment import SentimentService
from routes.data import supabase

router = APIRouter(prefix="/api", tags=["chat"])
chat_service = ChatService()
sentiment_service = SentimentService()
logger = logging.getLogger(__name__)

# API Key configuration
ROBLOX_API_KEY = os.getenv("ROBLOX_API_KEY")


# API Key verification function
async def verify_api_key(request: Request):
    if ROBLOX_API_KEY:
        api_key = request.headers.get('X-API-Key')
        logger.info(f"API Key authentication: {'Success' if api_key == ROBLOX_API_KEY else 'Failed'}")
        if not api_key or api_key != ROBLOX_API_KEY:
            logger.info("Unauthorized access attempt - invalid API key")
            raise HTTPException(status_code=401, detail="Unauthorized")


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
    """Moderation endpoint with database updates"""
    # Generate random values if not provided
    player_id = request.player_id if request.player_id is not None else random.randint(1, 100)
    player_name = request.player_name if request.player_name is not None else f"Player{random.randint(1, 999)}"
    
    logger.info(f"Processing moderation: Player ID: {player_id}, Player Name: {player_name}")
    
    try:
        # Create complete ChatMessage with generated values
        chat_message = ChatMessage(
            message=request.message,
            message_id=request.message_id,
            player_id=player_id,
            player_name=player_name
        )
        
        # Run moderation
        moderation_state = await chat_service.moderate_message(chat_message)
        
        # Update database with moderation results
        try:
            if moderation_state.recommended_action:
                # Build comprehensive reason including PII details
                reason_parts = []
                
                # Add PII information
                if moderation_state.pii_result:
                    if moderation_state.pii_result.pii_presence:
                        pii_type = moderation_state.pii_result.pii_type.value if moderation_state.pii_result.pii_type else "Unknown"
                        reason_parts.append(f"Detected {pii_type}")
                    if moderation_state.pii_result.pii_intent:
                        reason_parts.append("PII sharing intent detected")
                
                # Add content information
                if moderation_state.content_result and moderation_state.content_result.main_category.value != "OK":
                    reason_parts.append(f"Harmful content: {moderation_state.content_result.main_category.value}")
                
                # Use action reason if no specific details found
                if not reason_parts:
                    reason_parts.append(moderation_state.recommended_action.reason)
                
                comprehensive_reason = "; ".join(reason_parts)
                
                # Update message with moderation results
                update_data = {
                    "moderation_action": moderation_state.recommended_action.action.value,
                    "moderation_reason": comprehensive_reason
                }
                
                result = supabase.table('messages').update(update_data).eq('message_id', request.message_id).execute()
                
                if result.data:
                    logger.info(f"Updated message {request.message_id} with moderation: {moderation_state.recommended_action.action.value}")
                    
                    # Log severe actions
                    from agents.moderation import ActionType
                    if moderation_state.recommended_action.action in [ActionType.DELETE_MESSAGE, ActionType.BAN, ActionType.KICK]:
                        logger.warning(f"Message {request.message_id} flagged for {moderation_state.recommended_action.action.value}: {comprehensive_reason}")
                else:
                    logger.warning(f"Message {request.message_id} not found in database")
            else:
                logger.info(f"No moderation issues found for message {request.message_id}")
                
        except Exception as db_error:
            logger.error(f"Failed to update moderation results in database: {db_error}")
        
        return ModerationResponse(moderation_state=moderation_state)
        
    except Exception as e:
        logger.error(f"Moderation error: {e}")
        raise HTTPException(status_code=500, detail=f"Moderation error: {str(e)}")


@router.post("/analyze", response_model=ChatAnalysis)
async def analyze_sentiment_and_create_message(
    request: AnalyzeRequest,
    _: None = Depends(verify_api_key)
):
    """Analyze endpoint that creates new messages (for frontend compatibility)"""
    # Generate random values if not provided
    player_id = request.player_id if request.player_id is not None else random.randint(1, 100)
    player_name = request.player_name if request.player_name is not None else f"Player{random.randint(1, 999)}"
    
    logger.info(f"Processing analyze: Player ID: {player_id}, Player Name: {player_name}")
    
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
        
        # Create new message in database (for frontend to display)
        try:
            # Store player data
            player_data = {
                "player_id": player_id,
                "player_name": player_name,
                "last_seen": datetime.now(timezone.utc).isoformat()
            }
            supabase.table('players').upsert(player_data).execute()
            
            # Create new message data
            message_data = {
                "message_id": request.message_id,
                "player_id": player_id,
                "message": request.message,
                "sentiment_score": sentiment_result.chat_analysis.sentiment_score or 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            
            # Insert new message (will fail if message_id exists, which is expected)
            try:
                supabase.table('messages').insert(message_data).execute()
                logger.info(f"Created new message {request.message_id} with sentiment score: {sentiment_result.chat_analysis.sentiment_score}")
            except Exception as insert_error:
                # If insert fails due to duplicate, try update instead
                update_data = {
                    "sentiment_score": sentiment_result.chat_analysis.sentiment_score or 0
                }
                result = supabase.table('messages').update(update_data).eq('message_id', request.message_id).execute()
                if result.data:
                    logger.info(f"Updated existing message {request.message_id} with sentiment score")
                else:
                    logger.warning(f"Failed to create or update message {request.message_id}")
                
        except Exception as db_error:
            logger.error(f"Failed to create message in database: {db_error}")
        
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
        
        # Update existing message with sentiment data
        try:
            # Update message with sentiment score
            update_data = {
                "sentiment_score": sentiment_result.chat_analysis.sentiment_score or 0
            }
            
            result = supabase.table('messages').update(update_data).eq('message_id', request.message_id).execute()
            
            if result.data:
                logger.info(f"Updated message {request.message_id} with sentiment score: {sentiment_result.chat_analysis.sentiment_score}")
            else:
                logger.warning(f"Message {request.message_id} not found in database")
                
        except Exception as db_error:
            logger.error(f"Failed to update sentiment in database: {db_error}")
        
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
