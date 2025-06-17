// Moderation-specific data exports
// Re-exports from centralized mock data with moderation-specific additions

export {
  // Types
  type ChatMessage,
  type ActiveUser,
  UserRole,
  UserStatus,
  CommunityAction,
  
  // Experience data
  type RobloxExperience,
  mockExperiences,
  
  // Mock data
  mockActiveUsers,
  mockChatMessages,
  
  // Filter options
  PRIORITY_FILTER_OPTIONS,
  VIOLATION_FILTER_OPTIONS,
  
  // Moderation history data and utilities
  type ModerationHistory,
  mockModerationHistory,
  generateHistoryEntry,
  mapActionType,
  generateActionReason,
  getHighestPriority,
  generateId
} from "@/data/mock-data"

// Import moderation enums and types from colors-mod
export { PriorityLevel, ContentType, ActionType, PIIType } from "@/lib/colors-mod"