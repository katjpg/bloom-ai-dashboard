import logging
from typing import Optional
from agents.moderation import moderate_message, ChatMessage, ModerationState

logger = logging.getLogger(__name__)


class ModerationService:
    @staticmethod
    async def moderate_chat_message(message: ChatMessage) -> ModerationState:
        """Core moderation business logic"""
        try:
            return await moderate_message(message)
        except Exception as e:
            logger.error(f"Moderation service error: {e}")
            raise

    @staticmethod
    def should_run_sentiment_analysis(state: ModerationState) -> bool:
        """Determine if message passed moderation checks"""
        if state.recommended_action is not None:
            return False

        if state.content_result and state.content_result.main_category.value != "OK":
            return False

        if state.pii_result and (
            state.pii_result.pii_presence or state.pii_result.pii_intent
        ):
            return False

        if len(state.message.content) < 20:
            return False

        return True
