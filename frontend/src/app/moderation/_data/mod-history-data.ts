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

// Create history entry from action context
export function generateHistoryEntry(params: {
  action: string
  options?: any
  selectedMessages: ChatMessage[]
  moderator: string
  experience: { id: number; title: string }
}): ModerationHistory {
  const { action, options, selectedMessages, moderator, experience } = params
  
  if (selectedMessages.length === 0) {
    throw new Error('No messages selected for history entry')
  }
  
  // Aggregate violation data
  const allContentTypes = selectedMessages.flatMap(m => m.content_types || [])
  const allPII = selectedMessages.flatMap(m => m.pii_detected || [])
  const highestPriority = getHighestPriority(selectedMessages)
  
  // Generate smart reason
  const reason = generateActionReason(action, allContentTypes, allPII)
  
  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    action: mapActionType(action),
    moderator,
    moderatorRole: UserRole.MODERATOR, // Default, could be enhanced
    
    playerId: selectedMessages[0].player_id,
    playerName: selectedMessages[0].player_name,
    experienceId: experience.id,
    experienceName: experience.title,
    
    messageIds: selectedMessages.map(m => m.id),
    messageContent: selectedMessages[0].message,
    affectedMessagesCount: selectedMessages.length,
    
    originalPriority: highestPriority,
    originalContentTypes: [...new Set(allContentTypes)],
    originalPII: [...new Set(allPII)],
    
    reason,
    duration: options?.duration,
    status: 'active',
    isAutomated: false
  }
}

// Mock historical data for initial display
export const mockModerationHistory: ModerationHistory[] = [
  {
    id: "hist_001",
    timestamp: "2024-06-16T02:45:00Z",
    action: ActionType.BAN,
    moderator: "ModeratorAdmin",
    moderatorRole: UserRole.ADMIN,
    playerId: 5641,
    playerName: "ToxicPlayer2009",
    experienceId: 1,
    experienceName: "Adventure Quest",
    messageIds: ["msg_005"],
    messageContent: "I'm gonna find you IRL and beat the hell out of you for stealing my loot",
    affectedMessagesCount: 1,
    originalPriority: PriorityLevel.CRITICAL,
    originalContentTypes: [ContentType.H2, ContentType.V],
    reason: "Banned for: Hate + Threats, Violence",
    status: 'active',
    isAutomated: false
  },
  {
    id: "hist_002",
    timestamp: "2024-06-16T02:30:00Z",
    action: ActionType.DELETE_MESSAGE,
    moderator: "System",
    moderatorRole: UserRole.MODERATOR,
    playerId: 5555,
    playerName: "ResourceHoarder",
    experienceId: 6,
    experienceName: "Survival Island",
    messageIds: ["msg_019"],
    messageContent: "My credit card is 4532-1234-5678-9012 if you want to buy me premium tools",
    affectedMessagesCount: 1,
    originalPriority: PriorityLevel.CRITICAL,
    originalPII: [PIIType.CREDITCARDNUMBER],
    reason: "Removed for: PII:CREDITCARDNUMBER",
    status: 'active',
    isAutomated: true
  },
  {
    id: "hist_003",
    timestamp: "2024-06-16T02:15:00Z",
    action: ActionType.MUTE,
    moderator: "ChatModerator",
    moderatorRole: UserRole.MODERATOR,
    playerId: 8934,
    playerName: "NoobSlayer99",
    experienceId: 1,
    experienceName: "Adventure Quest",
    messageIds: ["msg_002"],
    messageContent: "You idiots suck at this dungeon, just quit and leave",
    affectedMessagesCount: 1,
    originalPriority: PriorityLevel.HIGH,
    originalContentTypes: [ContentType.HR, ContentType.H],
    reason: "Timeout for: Harassment, Hate Speech",
    duration: "1 hour",
    status: 'active',
    isAutomated: false
  },
  {
    id: "hist_004",
    timestamp: "2024-06-16T01:45:00Z",
    action: ActionType.WARNING,
    moderator: "ChatModerator",
    moderatorRole: UserRole.MODERATOR,
    playerId: 4567,
    playerName: "RoadRager",
    experienceId: 3,
    experienceName: "Racing Championship",
    messageIds: ["msg_012"],
    messageContent: "I'm gonna crash into everyone and wreck their cars! No mercy!",
    affectedMessagesCount: 1,
    originalPriority: PriorityLevel.HIGH,
    originalContentTypes: [ContentType.V, ContentType.HR],
    reason: "Warning for: Violence, Harassment",
    status: 'active',
    isAutomated: false
  },
  {
    id: "hist_005",
    timestamp: "2024-06-16T01:20:00Z",
    action: ActionType.APPROVE,
    moderator: "SeniorMod",
    moderatorRole: UserRole.ADMIN,
    playerId: 12847,
    playerName: "GamerKing2024",
    experienceId: 1,
    experienceName: "Adventure Quest",
    messageIds: ["msg_001"],
    messageContent: "Hey everyone! Ready for the next raid? Let's team up!",
    affectedMessagesCount: 1,
    reason: "Message approved for display",
    status: 'active',
    isAutomated: false
  }
]