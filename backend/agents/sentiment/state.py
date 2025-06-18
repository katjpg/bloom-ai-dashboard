from enum import Enum
from pydantic import BaseModel
from typing import Optional

from models.chat import ChatMessage


# ---------- Enum Definitions ----------
class CommunityAction(str, Enum):
    # Positive Actions
    ENCOURAGEMENT = "ENCOURAGEMENT"
    HELPFUL_ADVICE = "HELPFUL_ADVICE"
    WELCOME_NEWCOMER = "WELCOME_NEWCOMER"
    TEAM_COORDINATION = "TEAM_COORDINATION"
    APPRECIATION = "APPRECIATION"
    CELEBRATION = "CELEBRATION"
    KNOWLEDGE_SHARING = "KNOWLEDGE_SHARING"
    # Negative Actions
    TROLLING = "TROLLING"
    GRIEFING = "GRIEFING"
    SPAMMING = "SPAMMING"
    EXCLUSION = "EXCLUSION"
    BRAGGING = "BRAGGING"
    ARGUMENT_STARTING = "ARGUMENT_STARTING"
    BULLYING = "BULLYING"
    SHOW_OFF = "SHOW_OFF"
    PUT_DOWN = "PUT_DOWN"


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
