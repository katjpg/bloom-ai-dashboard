import random
import logging
import os
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

from agents.moderation import ChatMessage, ModerationState
from agents.sentiment.state import ChatAnalysis
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
        if not api_key or api_key != ROBLOX_API_KEY:
            raise HTTPException(status_code=401, detail="Unauthorized")


# Pydantic models for request/response
class AnalyzeRequest(BaseModel):
    message: str
    message_id: Optional[str] = None
    player_id: Optional[int] = None
    player_name: Optional[str] = None


class FlagRequest(BaseModel):
    message_id: str
    reason: Optional[str] = "User flagged"


# Response models
class ModerationResponse(BaseModel):
    moderation_state: ModerationState


# In-memory storage for flagged messages and moderation results
flagged_messages = {}
moderation_results = {}  # Store moderation results by message_id


@router.post("/moderate", response_model=ModerationResponse)
def moderate_message(request: ChatMessage):
    """Moderation endpoint with database updates"""
    # Generate random values if not provided
    player_id = request.player_id if request.player_id is not None else random.randint(1, 100)
    player_name = request.player_name if request.player_name is not None else f"Player{random.randint(1, 999)}"
    
    # Create complete ChatMessage with generated values
    chat_message = ChatMessage(
        message=request.message,
        message_id=request.message_id,
        player_id=player_id,
        player_name=player_name
    )
    
    # Run moderation (this will be run in threadpool)
    import asyncio
    moderation_state = asyncio.run(chat_service.moderate_message(chat_message))
    
    # Store moderation results in both database and memory
    if moderation_state.recommended_action:
        # Build reason
        reason_parts = []
        if moderation_state.pii_result and moderation_state.pii_result.pii_presence:
            pii_type = moderation_state.pii_result.pii_type.value if moderation_state.pii_result.pii_type else "Unknown"
            reason_parts.append(f"Detected {pii_type}")
        if moderation_state.content_result and moderation_state.content_result.main_category.value != "OK":
            reason_parts.append(f"Harmful content: {moderation_state.content_result.main_category.value}")
        if not reason_parts:
            reason_parts.append(moderation_state.recommended_action.reason)
        
        comprehensive_reason = "; ".join(reason_parts)
        
        # Update database
        update_data = {
            "moderation_action": moderation_state.recommended_action.action.value,
            "moderation_reason": comprehensive_reason
        }
        supabase.table('messages').update(update_data).eq('message_id', request.message_id).execute()
        
        # ALSO store in memory for live feed
        moderation_results[request.message_id] = {
            "moderation_action": moderation_state.recommended_action.action.value,
            "moderation_reason": comprehensive_reason
        }
        logger.info(f"Stored moderation result in database and memory for {request.message_id}: {moderation_state.recommended_action.action.value}")
    
    return ModerationResponse(moderation_state=moderation_state)


@router.post("/analyze", response_model=ChatAnalysis)
def analyze_sentiment_and_create_message(
    request: AnalyzeRequest,
    _: None = Depends(verify_api_key)
):
    """Analyze endpoint that creates new messages and optionally runs moderation"""
    # Generate random values if not provided
    player_id = request.player_id if request.player_id is not None else random.randint(1, 100)
    player_name = request.player_name if request.player_name is not None else f"Player{random.randint(1, 999)}"
    message_id = request.message_id if request.message_id is not None else f"msg_{random.randint(100000, 999999)}"
    
    # Convert request to ChatMessage format
    chat_message = ChatMessage(
        message=request.message,
        message_id=message_id,
        player_id=player_id,
        player_name=player_name
    )
    
    # Run sentiment analysis
    import asyncio
    sentiment_result = asyncio.run(sentiment_service.analyze_message_sentiment(chat_message))
    
    # Also run moderation in parallel (for auto-mod testing)
    try:
        moderation_result = asyncio.run(chat_service.moderate_message(chat_message))
        logger.info(f"Moderation result for {message_id}: {moderation_result.recommended_action}")
        
        # Store moderation results in both database and memory if action recommended
        if moderation_result.recommended_action:
            reason_parts = []
            if moderation_result.pii_result and moderation_result.pii_result.pii_presence:
                pii_type = moderation_result.pii_result.pii_type.value if moderation_result.pii_result.pii_type else "Unknown"
                reason_parts.append(f"Detected {pii_type}")
            if moderation_result.content_result and moderation_result.content_result.main_category.value != "OK":
                reason_parts.append(f"Harmful content: {moderation_result.content_result.main_category.value}")
            if not reason_parts:
                reason_parts.append(moderation_result.recommended_action.reason)
            
            comprehensive_reason = "; ".join(reason_parts)
            
            # Update database
            update_data = {
                "moderation_action": moderation_result.recommended_action.action.value,
                "moderation_reason": comprehensive_reason
            }
            supabase.table('messages').update(update_data).eq('message_id', message_id).execute()
            
            # ALSO store in memory for live feed
            moderation_results[message_id] = {
                "moderation_action": moderation_result.recommended_action.action.value,
                "moderation_reason": comprehensive_reason
            }
            logger.info(f"Stored moderation result in database and memory for {message_id}: {moderation_result.recommended_action.action.value}")
    
    except Exception as e:
        logger.error(f"Moderation failed for {message_id}: {e}")
        # Continue with sentiment analysis even if moderation fails
    
    # Store player and message data
    player_data = {
        "player_id": player_id,
        "player_name": player_name,
        "last_seen": datetime.now(timezone.utc).isoformat()
    }
    supabase.table('players').upsert(player_data).execute()
    
    message_data = {
        "message_id": message_id,
        "player_id": player_id,
        "message": request.message,
        "sentiment_score": sentiment_result.chat_analysis.sentiment_score or 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Insert or update message
    try:
        supabase.table('messages').insert(message_data).execute()
    except:
        # Update if exists - include updated timestamp so it appears as "new" in live feed
        update_data = {
            "sentiment_score": sentiment_result.chat_analysis.sentiment_score or 0,
            "created_at": datetime.now(timezone.utc).isoformat()  # Update timestamp
        }
        supabase.table('messages').update(update_data).eq('message_id', message_id).execute()
    
    return sentiment_result.chat_analysis


@router.post("/sentiment", response_model=ChatAnalysis)
def analyze_sentiment(request: AnalyzeRequest):
    """Sentiment analysis endpoint"""
    # Generate random values if not provided
    player_id = request.player_id if request.player_id is not None else random.randint(1, 100)
    player_name = request.player_name if request.player_name is not None else f"Player{random.randint(1, 999)}"
    message_id = request.message_id if request.message_id is not None else f"msg_{random.randint(100000, 999999)}"
    
    # Convert request to ChatMessage format for sentiment analysis
    sentiment_message = ChatMessage(
        message=request.message,
        message_id=message_id,
        player_id=player_id,
        player_name=player_name
    )
    
    # Analyze sentiment
    import asyncio
    sentiment_result = asyncio.run(sentiment_service.analyze_message_sentiment(sentiment_message))
    
    # Update existing message with sentiment data and refresh timestamp
    update_data = {
        "sentiment_score": sentiment_result.chat_analysis.sentiment_score or 0,
        "created_at": datetime.now(timezone.utc).isoformat()  # Update timestamp for live feed
    }
    supabase.table('messages').update(update_data).eq('message_id', message_id).execute()
    
    return sentiment_result.chat_analysis


@router.get("/users/{user_id}/score")
def get_user_score(user_id: int):
    """Get user score"""
    return sentiment_service.get_user_score(user_id)


# In-memory storage for flagged messages
flagged_messages = {}

@router.post("/flag")
def flag_message(request: FlagRequest):
    """Flag a message for moderation review (in-memory storage)"""
    # Get the original message from database
    response = supabase.table('messages').select('*').eq('message_id', request.message_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message_data = response.data[0]
    
    # Store flagged message in memory
    flagged_messages[request.message_id] = {
        **message_data,
        "flagged": True,
        "flagged_at": datetime.now(timezone.utc).isoformat(),
        "flag_reason": request.reason
    }
    
    return {"success": True, "message": "Message flagged successfully"}


@router.get("/flagged")
def get_flagged_messages(limit: int = 50):
    """Get all flagged messages for moderation queue (from in-memory storage)"""
    # Return flagged messages from memory, sorted by flagged_at (newest first)
    flagged_list = list(flagged_messages.values())
    flagged_list.sort(key=lambda x: x.get('flagged_at', ''), reverse=True)
    return flagged_list[:limit]


@router.get("/leaderboard")
def get_leaderboard(limit: int = 10):
    """Get leaderboard"""
    return {"leaderboard": sentiment_service.get_leaderboard(limit)}


@router.get("/stats")
def get_stats():
    """Get system statistics"""
    return sentiment_service.get_stats()


@router.get("/health")
def health_check():
    """Health check"""
    return {"status": "healthy", "timestamp": datetime.now()}
