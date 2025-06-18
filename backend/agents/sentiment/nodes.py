from dataclasses import dataclass
from pydantic_ai import Agent
from pydantic_graph import BaseNode, GraphRunContext, End
from typing import Union
import requests
import asyncio
import os
from dotenv import load_dotenv

from .state import (
    SentimentAnalysisState,
    CommunityIntent,
    RewardSystem,
    CommunityAction,
)

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

# ---------- Configuration Constants ----------
# API Endpoints
SENTIMENT_API_URL = "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment"

# AI Models
GEMINI_MODEL = "google-gla:gemini-2.0-flash"

# API Configuration
API_TIMEOUT = 30
MIN_CONTENT_LENGTH = 0 # changed to 0 

# Sentiment Configuration
POSITIVE_SENTIMENT_THRESHOLD = 30

# Default Responses
DEFAULT_SENTIMENT_RESPONSE = [[{"label": "LABEL_1", "score": 1.0}]]

# Sentiment Labels
NEGATIVE_LABEL = "LABEL_0"
NEUTRAL_LABEL = "LABEL_1"
POSITIVE_LABEL = "LABEL_2"

# Agent Prompts
COMMUNITY_INTENT_PROMPT = """
Analyze gaming messages for community intent in Roblox experiences.

POSITIVE actions to detect (actions that HELP/BENEFIT others):
- ENCOURAGEMENT: Giving support, motivating others, providing positive reinforcement
- HELPING: Offering assistance, teaching, providing advice or resources TO others
- CELEBRATING: Recognizing others' achievements, complimenting others' creations
- TEAM_BUILDING: Welcoming newcomers, including others, building friendships

NEGATIVE actions to detect:
- GRIEFING: Intentionally ruining gameplay, destroying creations, sabotaging others
- TOXICITY: Trolling, rage behavior, insults, aggressive communication, put-downs
- EXCLUSION: Deliberately excluding others, gatekeeping, unwelcoming behavior
- INAPPROPRIATE: Scamming attempts, harassment, rule violations, concerning requests
- SPAM: Repetitive messages, chat flooding, disruptive off-topic content

Important distinctions:
- ASKING for help is NOT "HELPING" - only OFFERING help counts as positive
- SEEKING encouragement is NOT "ENCOURAGEMENT" - only GIVING encouragement counts
- Questions, requests, or seeking assistance are neutral (return null)

Instructions:
- Focus on what the sender is GIVING to the community, not what they're seeking
- If no clear community intent detected, return: intent=null, reason=null

Response format: intent=[ACTION], reason=[explanation]
"""


# Reward Points
POSITIVE_SENTIMENT_POINTS = 2      # For sentiment >= 30
POSITIVE_ACTION_POINTS = 10        # For positive community actions  
NEGATIVE_ACTION_POINTS = -10       # For negative community actions


# ---------- Core Functions ----------


async def analyze_sentiment(text: str):
    """Get sentiment scores from HuggingFace API"""

    def sync_query():
        try:
            response = requests.post(
                SENTIMENT_API_URL,
                headers={"Authorization": f"Bearer {HF_TOKEN}"},
                json={"inputs": text},
                timeout=API_TIMEOUT,
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Sentiment API error: {e}")
            return DEFAULT_SENTIMENT_RESPONSE

    return await asyncio.get_event_loop().run_in_executor(None, sync_query)


def calculate_sentiment_score(api_response):
    """
    Calculate sentiment score using approved formula with confidence dampening.
    
    Formula: (positive - negative) * (1 - neutral) * 100
    
    This approach:
    - Uses confidence dampening through (1 - neutral) factor
    - Reduces extreme scores when model is uncertain (high neutral)
    - Provides -100 to +100 range with good granularity
    - Example: "Hello!" → positive=0.8, negative=0.1, neutral=0.1 → (0.8-0.1)*0.9*100 = 63
    
    Args:
        api_response: HuggingFace API response with sentiment probabilities
        
    Returns:
        int: Sentiment score from -100 to +100
    """
    sentiment_data = (
        api_response[0] if isinstance(api_response, list) and api_response else []
    )

    scores = {}
    for item in sentiment_data:
        label = item.get("label", "")
        score = item.get("score", 0)

        if label == NEGATIVE_LABEL:
            scores["negative"] = score
        elif label == NEUTRAL_LABEL:
            scores["neutral"] = score
        elif label == POSITIVE_LABEL:
            scores["positive"] = score

    positive = scores.get("positive", 0)
    negative = scores.get("negative", 0)
    neutral = scores.get("neutral", 0)

    # High neutral dampens sentiment strength
    sentiment_difference = positive - negative
    confidence_factor = 1 - neutral

    return int(round(sentiment_difference * confidence_factor * 100))


# ---------- AI Agent ----------
CommunityIntentAgent = Agent(
    GEMINI_MODEL, system_prompt=COMMUNITY_INTENT_PROMPT, output_type=CommunityIntent
)


# ---------- Forward Declarations ----------
class CheckContentLength(BaseNode[SentimentAnalysisState]):
    pass


class AnalyzeSentiment(BaseNode[SentimentAnalysisState]):
    pass


class AnalyzeCommunityIntent(BaseNode[SentimentAnalysisState]):
    pass


class CalculateRewards(BaseNode[SentimentAnalysisState]):
    pass


# ---------- Node Implementations ----------
@dataclass
class StartSentimentAnalysis(BaseNode[SentimentAnalysisState]):
    async def run(self, ctx: GraphRunContext) -> CheckContentLength:
        return CheckContentLength()


@dataclass
class CheckContentLength(BaseNode[SentimentAnalysisState]):
    async def run(
        self, ctx: GraphRunContext
    ) -> Union[AnalyzeSentiment, AnalyzeCommunityIntent]:
        content_length = len(ctx.state.chat_analysis.chat.message)

        if content_length >= MIN_CONTENT_LENGTH:
            return AnalyzeSentiment()
        else:
            ctx.state.chat_analysis.sentiment_score = 0
            return AnalyzeCommunityIntent()


@dataclass
class AnalyzeSentiment(BaseNode[SentimentAnalysisState]):
    async def run(self, ctx: GraphRunContext) -> AnalyzeCommunityIntent:
        api_response = await analyze_sentiment(ctx.state.chat_analysis.chat.message)
        sentiment_score = calculate_sentiment_score(api_response)
        ctx.state.chat_analysis.sentiment_score = sentiment_score
        return AnalyzeCommunityIntent()


@dataclass
class AnalyzeCommunityIntent(BaseNode[SentimentAnalysisState]):
    async def run(self, ctx: GraphRunContext) -> CalculateRewards:
        try:
            result = await CommunityIntentAgent.run(
                ctx.state.chat_analysis.chat.message
            )
            intent_result = result.output if hasattr(result, "output") else result

            # Ensure reason is None when intent is None
            if intent_result.intent is None:
                intent_result.reason = None

            ctx.state.chat_analysis.community_intent = intent_result

        except Exception as e:
            print(f"Community intent error: {e}")
            ctx.state.chat_analysis.community_intent = CommunityIntent(
                intent=None, reason=None
            )

        return CalculateRewards()


@dataclass
class CalculateRewards(BaseNode[SentimentAnalysisState]):
    async def run(self, ctx: GraphRunContext) -> End:
        points = 0
        reasons = []

        # Sentiment points
        sentiment_score = ctx.state.chat_analysis.sentiment_score or 0
        if sentiment_score > POSITIVE_SENTIMENT_THRESHOLD:
            points += POSITIVE_SENTIMENT_POINTS
            reasons.append("Positive sentiment")

        # Community intent points
        intent = ctx.state.chat_analysis.community_intent
        if intent and intent.intent:
            positive_actions = {
                CommunityAction.ENCOURAGEMENT,
                CommunityAction.HELPFUL_ADVICE,
                CommunityAction.WELCOME_NEWCOMER,
                CommunityAction.TEAM_COORDINATION,
                CommunityAction.APPRECIATION,
                CommunityAction.CELEBRATION,
                CommunityAction.KNOWLEDGE_SHARING,
            }

            if intent.intent in positive_actions:
                points += POSITIVE_ACTION_POINTS
                reasons.append(f"Positive action: {intent.intent.value}")
            else:  # Negative actions
                points += NEGATIVE_ACTION_POINTS
                reasons.append(f"Negative action: {intent.intent.value}")

        ctx.state.reward_system = RewardSystem(
            points_awarded=points,
            reason="; ".join(reasons) if reasons else "No points awarded",
        )

        return End(f"Analysis complete: {points} points")
