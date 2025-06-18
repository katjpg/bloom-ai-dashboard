"""
FastAPI dependencies for chat routes
Provides reusable validation, authentication, and data processing logic
"""

import os
import random
from typing import Dict, Any, Optional
from fastapi import HTTPException, Request, Depends
from datetime import datetime, timezone

from routes.data import supabase


# API Key configuration
ROBLOX_API_KEY = os.getenv("ROBLOX_API_KEY")


async def verify_api_key(request: Request) -> None:
    """Verify API key authentication"""
    if not ROBLOX_API_KEY:
        return  # Skip auth if no key configured
    
    api_key = request.headers.get('X-API-Key')
    if not api_key or api_key != ROBLOX_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")


def generate_player_defaults(player_id: Optional[int], player_name: Optional[str]) -> Dict[str, Any]:
    """Generate default player ID and name if not provided"""
    return {
        "player_id": player_id if player_id is not None else random.randint(1, 100),
        "player_name": player_name if player_name is not None else f"Player{random.randint(1, 999)}"
    }


def valid_message_id(message_id: str) -> str:
    """Validate message ID format and return it"""
    if not message_id or not message_id.strip():
        raise HTTPException(status_code=422, detail="Message ID is required")
    return message_id


def get_message_by_id(message_id: str = Depends(valid_message_id)) -> Dict[str, Any]:
    """Get message from database by ID"""
    response = supabase.table('messages').select('*').eq('message_id', message_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return response.data[0]


def create_timestamp() -> str:
    """Create ISO timestamp with UTC timezone"""
    return datetime.now(timezone.utc).isoformat()