import { ActionType, PriorityLevel, ContentType, PIIType } from "@/lib/colors-mod"
import { mockExperiences } from "../../(dashboard)/_data"

// Define ChatMessage interface to avoid circular dependency
interface ChatMessage {
  id: string
  player_id: number
  player_name: string
  message: string
  avatar_url: string
  timestamp: string
  role: UserRole
  status: UserStatus
  experience_id: number
  priority_level?: PriorityLevel
  content_types?: ContentType[]
  pii_detected?: PIIType[]
  community_actions?: any[]
  moderation_actions?: ActionType[]
  safety_score?: number
}

enum UserStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE"
}

// Import UserRole directly to avoid circular dependency
export enum UserRole {
  PLAYER = "PLAYER",
  MODERATOR = "MODERATOR", 
  ADMIN = "ADMIN"
}

export interface ModerationHistory {
  id: string                           // Unique action ID
  timestamp: string                    // When action was taken (ISO string)
  action: ActionType                   // Action performed
  moderator: string                    // Who performed it ("System" for automated)
  moderatorRole: UserRole              // MODERATOR | ADMIN
  
  // Target Information
  playerId: number                     // Target player ID
  playerName: string                   // Target player name
  experienceId: number                 // Which experience
  experienceName: string               // Experience display name
  
  // Message Context (when applicable)
  messageIds: string[]                 // Selected message IDs
  messageContent?: string              // First/primary message content (truncated)
  affectedMessagesCount: number        // Total messages affected
  
  // Original Violation Data
  originalPriority?: PriorityLevel     // From selected messages
  originalContentTypes?: ContentType[] // Aggregated violations
  originalPII?: PIIType[]              // Aggregated PII detections
  
  // Action Details
  reason: string                       // Generated or manual reason
  duration?: string                    // For timeouts: "15 minutes", "1 hour", etc.
  status: 'active' | 'expired' | 'reversed' // Current status
  isAutomated: boolean                 // System vs manual action
  
  // Audit Trail
  reversedBy?: string                  // Who reversed it
  reversedAt?: string                  // When it was reversed
  reversalReason?: string              // Why it was reversed
}

// Helper function to map mod-actions types to ActionType enum
export function mapActionType(action: string): ActionType {
  switch (action) {
    case 'approve': return ActionType.APPROVE
    case 'delete': return ActionType.DELETE_MESSAGE
    case 'edit': return ActionType.DELETE_MESSAGE // Edit is treated as delete + replace
    case 'warn': return ActionType.WARNING
    case 'timeout': return ActionType.MUTE
    case 'escalate': return ActionType.WARNING // Escalation starts as warning
    case 'ban': return ActionType.BAN
    default: return ActionType.WARNING
  }
}

// Generate smart reason based on action and violations
export function generateActionReason(
  action: string, 
  contentTypes: ContentType[] = [], 
  piiTypes: PIIType[] = []
): string {
  const violations = [...contentTypes, ...piiTypes.map(p => `PII:${p}`)]
  
  if (violations.length === 0) {
    switch (action) {
      case 'approve': return 'Message approved for display'
      case 'delete': return 'Message removed'
      case 'edit': return 'Message content filtered'
      case 'warn': return 'Warning issued to player'
      case 'timeout': return 'Temporary chat restriction applied'
      case 'escalate': return 'Escalated for senior review'
      case 'ban': return 'Account banned'
      default: return 'Moderation action taken'
    }
  }
  
  const violationText = violations.slice(0, 2).join(', ') + (violations.length > 2 ? ` +${violations.length - 2} more` : '')
  
  switch (action) {
    case 'approve': return `Approved despite detection: ${violationText}`
    case 'delete': return `Removed for: ${violationText}`
    case 'edit': return `Filtered content: ${violationText}`
    case 'warn': return `Warning for: ${violationText}`
    case 'timeout': return `Timeout for: ${violationText}`
    case 'escalate': return `Escalated for: ${violationText}`
    case 'ban': return `Banned for: ${violationText}`
    default: return `Action taken for: ${violationText}`
  }
}

// Get highest priority from messages
export function getHighestPriority(messages: ChatMessage[]): PriorityLevel | undefined {
  const priorities = messages.map(m => m.priority_level).filter(Boolean) as PriorityLevel[]
  if (priorities.includes(PriorityLevel.CRITICAL)) return PriorityLevel.CRITICAL
  if (priorities.includes(PriorityLevel.HIGH)) return PriorityLevel.HIGH
  if (priorities.includes(PriorityLevel.MODERATE)) return PriorityLevel.MODERATE
  return undefined
}

// Generate unique ID
export function generateId(): string {
  return `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Create history entries from action context - one entry per unique user
export function generateHistoryEntry(params: {
  action: string
  options?: any
  selectedMessages: ChatMessage[]
  moderator: string
  experience: { id: number; title: string }
}): ModerationHistory[] {
  const { action, options, selectedMessages, moderator, experience } = params
  
  if (selectedMessages.length === 0) {
    throw new Error('No messages selected for history entry')
  }
  
  // Group messages by unique user
  const messagesByUser = selectedMessages.reduce((acc, message) => {
    const userId = message.player_id
    if (!acc[userId]) {
      acc[userId] = []
    }
    acc[userId].push(message)
    return acc
  }, {} as Record<number, ChatMessage[]>)
  
  // Create separate history entry for each user
  return Object.values(messagesByUser).map(userMessages => {
    const firstMessage = userMessages[0]
    
    // Aggregate violation data for this user's messages
    const userContentTypes = userMessages.flatMap(m => m.content_types || [])
    const userPII = userMessages.flatMap(m => m.pii_detected || [])
    const userHighestPriority = getHighestPriority(userMessages)
    
    // Generate smart reason based on this user's violations
    const reason = generateActionReason(action, userContentTypes, userPII)
    
    return {
      id: generateId(),
      timestamp: new Date().toISOString(),
      action: mapActionType(action),
      moderator,
      moderatorRole: UserRole.MODERATOR,
      
      playerId: firstMessage.player_id,
      playerName: firstMessage.player_name,
      experienceId: experience.id,
      experienceName: experience.title,
      
      messageIds: userMessages.map(m => m.id),
      messageContent: firstMessage.message,
      affectedMessagesCount: userMessages.length,
      
      originalPriority: userHighestPriority,
      originalContentTypes: [...new Set(userContentTypes)],
      originalPII: [...new Set(userPII)],
      
      reason,
      duration: options?.duration,
      status: 'active',
      isAutomated: false
    }
  })
}

// Mock historical data for initial display
export const mockModerationHistory: ModerationHistory[] = [
  {
    id: "hist_001",
    timestamp: "2024-06-16T02:45:00Z",
    action: ActionType.DELETE_MESSAGE,
    moderator: "System",
    moderatorRole: UserRole.MODERATOR,
    playerId: 12345,
    playerName: "SafeKid2012",
    experienceId: 1,
    experienceName: "Bloom",
    messageIds: ["msg_005"],
    messageContent: "My phone number is 555-123-4567 if anyone wants to be friends outside the game",
    affectedMessagesCount: 1,
    originalPriority: PriorityLevel.CRITICAL,
    originalPII: [PIIType.TELEPHONENUM],
    reason: "Removed for: PII:TELEPHONENUM",
    status: 'active',
    isAutomated: true
  },
  {
    id: "hist_002",
    timestamp: "2024-06-16T02:30:00Z",
    action: ActionType.WARNING,
    moderator: "BloomModerator",
    moderatorRole: UserRole.MODERATOR,
    playerId: 13579,
    playerName: "TroubleMaker2010",
    experienceId: 3,
    experienceName: "Adventure Academy",
    messageIds: ["msg_011"],
    messageContent: "This game is so dumb and stupid. I hate learning stuff",
    affectedMessagesCount: 1,
    originalPriority: PriorityLevel.MODERATE,
    originalContentTypes: [ContentType.HR],
    reason: "Warning for: Harassment",
    status: 'active',
    isAutomated: false
  },
  {
    id: "hist_003",
    timestamp: "2024-06-16T02:15:00Z",
    action: ActionType.APPROVE,
    moderator: "CreativeAdmin",
    moderatorRole: UserRole.ADMIN,
    playerId: 78901,
    playerName: "HelpfulFriend",
    experienceId: 2,
    experienceName: "Creative Studios",
    messageIds: ["msg_008"],
    messageContent: "@CreativeKid2013 You need to connect the gear first! I can show you",
    affectedMessagesCount: 1,
    reason: "Message approved for display",
    status: 'active',
    isAutomated: false
  },
  {
    id: "hist_004",
    timestamp: "2024-06-16T01:45:00Z",
    action: ActionType.APPROVE,
    moderator: "BloomModerator",
    moderatorRole: UserRole.MODERATOR,
    playerId: 67891,
    playerName: "LearningExplorer",
    experienceId: 1,
    experienceName: "Bloom",
    messageIds: ["msg_002"],
    messageContent: "Can someone help me with the science experiment? I'm stuck on step 3",
    affectedMessagesCount: 1,
    reason: "Message approved for display",
    status: 'active',
    isAutomated: false
  },
  {
    id: "hist_005",
    timestamp: "2024-06-16T01:20:00Z",
    action: ActionType.APPROVE,
    moderator: "CreativeMod",
    moderatorRole: UserRole.MODERATOR,
    playerId: 34567,
    playerName: "MasterBuilder999",
    experienceId: 2,
    experienceName: "Creative Studios",
    messageIds: ["msg_006"],
    messageContent: "Check out my spaceship design! Used all the new rainbow blocks",
    affectedMessagesCount: 1,
    reason: "Message approved for display",
    status: 'active',
    isAutomated: false
  }
]