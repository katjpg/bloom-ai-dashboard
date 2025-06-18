import os
import logging
import requests
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error("Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_KEY environment variables.")
    raise ValueError("Missing Supabase configuration")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Roblox API configuration
ROBLOX_THUMBNAILS_API_URL = "https://thumbnails.roblox.com/v1/users/avatar-headshot"

# Router setup
router = APIRouter(prefix="/api", tags=["data"])


@router.get("/players")
async def get_players():
    """Fetch all players from the database"""
    try:
        response = supabase.table('players').select('*').execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching players: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch players")


@router.get("/messages")
async def get_messages(
    player_id: Optional[str] = Query(None),
    limit: int = Query(100)
):
    """
    Fetch messages from the database with optional filtering
    
    Args:
        player_id: Optional player ID to filter messages
        limit: Maximum number of messages to return (default: 100)
    """
    try:
        query = supabase.table('messages').select('*').order('created_at', desc=True).limit(limit)
        
        if player_id:
            query = query.eq('player_id', player_id)
        
        response = query.execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching messages: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch messages")


@router.get("/live")
async def get_live_messages(limit: int = Query(20)):
    """
    Fetch live messages using database function
    
    Args:
        limit: Maximum number of live messages to return (default: 20)
    """
    try:
        # Use RPC function exactly as it worked before
        messages_response = supabase.rpc('get_live_messages', {'p_limit': limit}).execute()
        
        return messages_response.data
    except Exception as e:
        logger.error(f"Error fetching live messages: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch live messages: {str(e)}")


@router.get("/roblox-avatar")
async def get_roblox_avatar(userId: Optional[str] = Query(None)):
    """
    Proxies requests to the Roblox Thumbnails API to fetch user avatar headshots.
    Takes 'userId' as a query parameter.
    """
    if not userId:
        logger.info("Roblox avatar proxy: Missing userId parameter")
        raise HTTPException(status_code=400, detail="Missing userId parameter")

    try:
        user_id_int = int(userId)
        if user_id_int <= 0:
            logger.info(f"Roblox avatar proxy: Invalid userId format (non-positive): {userId}")
            raise HTTPException(status_code=400, detail="Invalid userId format")
    except ValueError:
        logger.info(f"Roblox avatar proxy: Invalid userId format (not an integer): {userId}")
        raise HTTPException(status_code=400, detail="Invalid userId format")

    logger.info(f"Roblox avatar proxy: Fetching avatar for user ID: {userId}")

    # Parameters for the Roblox API request
    roblox_params = {
        "userIds": userId,  # Pass the single user ID
        "size": "150x150",  # Desired size
        "format": "Png"     # Desired format
    }

    try:
        # Make the request to the actual Roblox Thumbnails API
        roblox_response = requests.get(ROBLOX_THUMBNAILS_API_URL, params=roblox_params)
        roblox_response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)

        roblox_data = roblox_response.json()
        logger.info(f"Roblox avatar proxy: Received data from Roblox API: {roblox_data}")

        # Parse the response to find the image URL
        # The response structure is { "data": [ { "targetId": ..., "state": ..., "imageUrl": ... } ] }
        image_url = None
        if roblox_data and 'data' in roblox_data and isinstance(roblox_data['data'], list):
            # Find the item matching the requested user ID
            user_data = next((item for item in roblox_data['data'] if str(item.get('targetId')) == userId), None)
            if user_data and 'imageUrl' in user_data:
                image_url = user_data['imageUrl']
                logger.info(f"Roblox avatar proxy: Found imageUrl: {image_url}")
            else:
                logger.info(f"Roblox avatar proxy: imageUrl not found in Roblox response for user ID: {userId}")

        if image_url:
            # Return the image URL to the frontend
            return {"imageUrl": image_url}
        else:
            # Return a 404 if the image URL was not found for the user
            logger.info(f"Roblox avatar proxy: Avatar not found for user ID: {userId}")
            raise HTTPException(status_code=404, detail="Avatar not found")

    except requests.exceptions.RequestException as e:
        # Handle errors during the request to Roblox API
        logger.error(f"Roblox avatar proxy: Error fetching from Roblox API: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch avatar from Roblox")
    except HTTPException:
        # Re-raise HTTPExceptions
        raise
    except Exception as e:
        # Handle any other unexpected errors
        logger.error(f"Roblox avatar proxy: An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred")


@router.get("/top-players")
async def get_top_players(limit: int = Query(10)):
    """
    Get top players by sentiment score using database RPC function
    
    Args:
        limit: Maximum number of top players to return (default: 10)
    """
    try:
        response = supabase.rpc('get_top_players_by_sentiment', {'p_limit': limit}).execute()
        
        # Format the response to ensure we have the required fields
        formatted_data = []
        for player in response.data:
            formatted_data.append({
                "player_id": player["player_id"],
                "player_name": player["player_name"],
                "total_sentiment_score": player["total_sentiment_score"],
                "message_count": player["message_count"]
            })
        
        return formatted_data
    except Exception as e:
        logger.error(f"Error fetching top players: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch top players: {str(e)}")