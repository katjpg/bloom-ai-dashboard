from pydantic import BaseModel
from typing import Optional

class ChatMessage(BaseModel):
    message: str
    message_id: str
    player_id: Optional[int] = None
    player_name: Optional[str] = None
