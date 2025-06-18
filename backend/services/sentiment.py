import logging
from collections import defaultdict

from agents.sentiment import (
    analyze_message_sentiment,
    ChatMessage,
    SentimentAnalysisState,
)

logger = logging.getLogger(__name__)


class SentimentService:
    def __init__(self):
        self.user_scores: dict[int, int] = defaultdict(int)
        self.usernames: dict[int, str] = {}

    async def analyze_message_sentiment(
        self, message: ChatMessage
    ) -> SentimentAnalysisState:
        """Analyze sentiment and update user scores"""
        try:
            sentiment_result = await analyze_message_sentiment(message, None)

            if sentiment_result.reward_system:
                user_id = message.player_id or 0
                self.user_scores[user_id] += sentiment_result.reward_system.points_awarded
                
                # Store username for leaderboard
                if message.player_name:
                    self.usernames[user_id] = message.player_name

                logger.info(
                    f"Updated score for user {user_id}: {self.user_scores[user_id]} "
                    f"(+{sentiment_result.reward_system.points_awarded})"
                )

            return sentiment_result

        except Exception as e:
            logger.error(f"Sentiment service error: {e}")
            raise

    def get_user_score(self, user_id: int) -> dict:
        """Get user score information"""
        return {
            "user_id": user_id,
            "username": self.usernames.get(user_id, f"user_{user_id}"),
            "current_score": self.user_scores[user_id],
        }

    def get_leaderboard(self, limit: int = 10) -> list:
        """Get top scoring users"""
        sorted_scores = sorted(
            self.user_scores.items(), key=lambda x: x[1], reverse=True
        )

        board = []
        for user_id, score in sorted_scores[:limit]:
            board.append(
                {
                    "user_id": user_id,
                    "username": self.usernames.get(user_id, f"user_{user_id}"),
                    "score": score,
                }
            )

        return board

    def get_stats(self) -> dict:
        """Get system statistics"""
        return {
            "total_users": len(self.user_scores),
            "total_points": sum(self.user_scores.values()),
            "average_score": (
                sum(self.user_scores.values()) / len(self.user_scores)
                if self.user_scores
                else 0
            ),
            "highest_score": max(self.user_scores.values()) if self.user_scores else 0,
        }
