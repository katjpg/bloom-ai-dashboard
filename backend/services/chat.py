import logging
from agents.moderation import ChatMessage, ModerationState
from .moderation import ModerationService

logger = logging.getLogger(__name__)


class ChatService:
    def __init__(self):
        self.moderation_service = ModerationService()

    async def moderate_message(self, request: ChatMessage) -> ModerationState:
        """Process message through moderation only"""
        return await self.moderation_service.moderate_chat_message(request)
