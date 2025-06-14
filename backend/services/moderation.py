import logging
from typing import Optional
from agents.moderation import moderate_message, ChatMessage, ModerationState, ActionType

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
        """Determine if message should proceed to sentiment analysis"""
        # Block sentiment analysis for severe actions (not WARNING)
        if state.recommended_action is not None:
            if state.recommended_action.action != ActionType.WARNING:
                return False

        # Block if PII is present or intended
        if state.pii_result and (
            state.pii_result.pii_presence or state.pii_result.pii_intent
        ):
            return False

        # Block very short messages (spam prevention)
        if len(state.message.content) < 5:
            return False

        return True
