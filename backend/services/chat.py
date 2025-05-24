import logging
from datetime import datetime
from typing import Optional

from agents.moderation import ChatMessage, ModerationState
from agents.sentiment import SentimentAnalysisState
from .moderation import ModerationService
from .sentiment import SentimentService

logger = logging.getLogger(__name__)


class ChatService:
    def __init__(self):
        self.moderation_service = ModerationService()
        self.sentiment_service = SentimentService()

    async def process_message(self, message: ChatMessage) -> dict:
        """Main business logic: moderate message and optionally analyze sentiment"""
        # Step 1: Moderation
        moderation_state = await self.moderation_service.moderate_chat_message(message)

        response = {
            "moderation_state": moderation_state,
            "sentiment_analysis": None,
            "user_score_updated": False,
            "new_score": None,
        }

        # Step 2: Sentiment analysis (if message passed moderation)
        if self.moderation_service.should_run_sentiment_analysis(moderation_state):
            try:
                sentiment_result = (
                    await self.sentiment_service.analyze_message_sentiment(message)
                )

                response.update(
                    {
                        "sentiment_analysis": sentiment_result,
                        "user_score_updated": True,
                        "new_score": self.sentiment_service.user_scores[
                            message.user_id
                        ],
                    }
                )

            except Exception as e:
                logger.error(f"Sentiment analysis failed: {e}")

        return response

    def get_user_score(self, user_id: int) -> dict:
        """Get user score"""
        return self.sentiment_service.get_user_score(user_id)

    def get_leaderboard(self, limit: int = 10) -> dict:
        """Get leaderboard"""
        return {"leaderboard": self.sentiment_service.get_leaderboard(limit)}

    def get_stats(self) -> dict:
        """Get system stats"""
        return self.sentiment_service.get_stats()
