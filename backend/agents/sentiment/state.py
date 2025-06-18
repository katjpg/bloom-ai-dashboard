from enum import Enum
from pydantic import BaseModel
from typing import Optional

from models.chat import ChatMessage


# ---------- Enum Definitions ----------
class CommunityAction(str, Enum):
    # Positive Actions
    ENCOURAGEMENT = "ENCOURAGEMENT"          # Supporting teammates, cheering others on
    HELPING = "HELPING"                      # Teaching, sharing resources, mentoring
    CELEBRATING = "CELEBRATING"              # Recognizing achievements, complimenting creations
    TEAM_BUILDING = "TEAM_BUILDING"          # Building friendships, inclusive behavior
    
    # Negative Actions
    GRIEFING = "GRIEFING"                    # Intentionally ruining gameplay/creations
    TOXICITY = "TOXICITY"                    # Trolling, rage behavior, aggressive communication
    EXCLUSION = "EXCLUSION"                  # Deliberately excluding or gatekeeping
    INAPPROPRIATE = "INAPPROPRIATE"          # Scamming, harassment, rule violations
    SPAM = "SPAM"                           # Repetitive/disruptive messaging



# ---------- Pydantic Models ----------


class CommunityIntent(BaseModel):
    intent: Optional[CommunityAction] = None
    reason: Optional[str] = None


class ChatAnalysis(BaseModel):
    chat: ChatMessage
    sentiment_score: Optional[int] = None
    community_intent: Optional[CommunityIntent] = None
    error: Optional[str] = None




class RewardSystem(BaseModel):
    points_awarded: int = 0
    reason: str = ""


class SentimentAnalysisState(BaseModel):
    chat_analysis: ChatAnalysis
    reward_system: Optional[RewardSystem] = None
