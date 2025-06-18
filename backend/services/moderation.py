import logging
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
