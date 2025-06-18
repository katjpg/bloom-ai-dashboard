from pydantic_graph import Graph
from typing import Optional

from .state import ChatMessage, SentimentAnalysisState
from .nodes import (
    StartSentimentAnalysis,
    CheckContentLength,
    AnalyzeSentiment,
    AnalyzeCommunityIntent,
    CalculateRewards,
)

# ---------- Graph Definition ----------
sentiment_graph = Graph(
    nodes=[
        StartSentimentAnalysis,
        CheckContentLength,
        AnalyzeSentiment,
        AnalyzeCommunityIntent,
        CalculateRewards,
    ],
    state_type=SentimentAnalysisState,
)


# ---------- Main Function ----------
async def analyze_message_sentiment(
    message: ChatMessage, user_profile = None
) -> SentimentAnalysisState:
    """Analyze message sentiment and community intent (only call after moderation passes)"""
    from .state import ChatAnalysis

    chat_analysis = ChatAnalysis(chat=message)
    state = SentimentAnalysisState(chat_analysis=chat_analysis)

    try:
        await sentiment_graph.run(StartSentimentAnalysis(), state=state)
        return state

    except Exception as e:
        print(f"Sentiment analysis error: {e}")
        return state
