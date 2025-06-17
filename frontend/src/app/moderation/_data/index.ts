// Import moderation enums and types
import { PriorityLevel, ContentType, ActionType, PIIType } from "@/lib/colors-mod"
import { mockExperiences } from "../../(dashboard)/_data"

// Import and re-export UserRole from mod-history-data to avoid circular dependency
import { UserRole } from "./mod-history-data"
export { UserRole }

export enum UserStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE"
}

export enum CommunityAction {
  // Positive Actions
  ENCOURAGEMENT = "ENCOURAGEMENT",
  HELPFUL_ADVICE = "HELPFUL_ADVICE",
  WELCOME_NEWCOMER = "WELCOME_NEWCOMER",
  TEAM_COORDINATION = "TEAM_COORDINATION",
  APPRECIATION = "APPRECIATION",
  CELEBRATION = "CELEBRATION",
  KNOWLEDGE_SHARING = "KNOWLEDGE_SHARING",
  // Negative Actions
  TROLLING = "TROLLING",
  GRIEFING = "GRIEFING", 
  SPAMMING = "SPAMMING",
  EXCLUSION = "EXCLUSION",
  BRAGGING = "BRAGGING",
  ARGUMENT_STARTING = "ARGUMENT_STARTING",
  BULLYING = "BULLYING",
  SHOW_OFF = "SHOW_OFF",
  PUT_DOWN = "PUT_DOWN"
}

// Chat message interface
export interface ChatMessage {
  id: string
  player_id: number
  player_name: string
  message: string
  avatar_url: string
  timestamp: string
  role: UserRole
  status: UserStatus
  experience_id: number // Associate message with specific experience
  // Moderation analysis
  priority_level?: PriorityLevel
  content_types?: ContentType[]
  pii_detected?: PIIType[]
  community_actions?: CommunityAction[]
  moderation_actions?: ActionType[]
  safety_score?: number
}

// Active user interface for mod-info
export interface ActiveUser {
  id: string
  player_id: number
  player_name: string
  avatar_url: string
  status: UserStatus
  join_time: string
  experience_id: number
}

// Mock chat data with realistic gaming scenarios by experience
export const mockChatMessages: ChatMessage[] = [
  // Bloom (Experience ID: 1) - Educational and positive community messages
  {
    id: "msg_001",
    player_id: 89234,
    player_name: "FriendlyBuilder2011",
    message: "Hi everyone! Just finished the math puzzle. Anyone want to work on the next one together?",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:17:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 1
  },
  {
    id: "msg_002", 
    player_id: 67891,
    player_name: "LearningExplorer",
    message: "Can someone help me with the science experiment? I'm stuck on step 3",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:18:30Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 1
  },
  {
    id: "msg_003",
    player_id: 45678,
    player_name: "BloomModerator",
    message: "Welcome to Bloom! Remember to be kind and help each other learn. Have fun!",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:19:15Z",
    role: UserRole.MODERATOR,
    status: UserStatus.ONLINE,
    experience_id: 1
  },
  {
    id: "msg_004",
    player_id: 23456,
    player_name: "YoungArtist123",
    message: "Look at my rainbow castle! Took me 30 minutes to build with the blocks",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:20:45Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 1
  },
  {
    id: "msg_005",
    player_id: 12345,
    player_name: "SafeKid2012",
    message: "My phone number is 555-123-4567 if anyone wants to be friends outside the game",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:21:12Z", 
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 1,
    priority_level: PriorityLevel.CRITICAL,
    pii_detected: [PIIType.TELEPHONENUM]
  },

  // Creative Studios (Experience ID: 2) - Building and creation messages
  {
    id: "msg_006",
    player_id: 34567,
    player_name: "MasterBuilder999",
    message: "Check out my spaceship design! Used all the new rainbow blocks",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:22:33Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 2
  },
  {
    id: "msg_007",
    player_id: 56789,
    player_name: "CreativeKid2013",
    message: "Does anyone know how to make the spinning wheel work? Need help!",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:23:21Z",
    role: UserRole.PLAYER, 
    status: UserStatus.ONLINE,
    experience_id: 2
  },
  {
    id: "msg_008",
    player_id: 78901,
    player_name: "HelpfulFriend",
    message: "@CreativeKid2013 You need to connect the gear first! I can show you",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:24:18Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 2
  },

  // Adventure Academy (Experience ID: 3) - Educational quest messages  
  {
    id: "msg_009",
    player_id: 90123,
    player_name: "QuestMaster2014",
    message: "Just solved the ancient pyramid puzzle! The history facts were so cool",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:25:45Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 3
  },
  {
    id: "msg_010",
    player_id: 11234,
    player_name: "SmartExplorer",
    message: "The volcano quest taught me about geology! Science is awesome",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:26:30Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 3
  },
  {
    id: "msg_011",
    player_id: 13579,
    player_name: "TroubleMaker2010",
    message: "This game is so dumb and stupid. I hate learning stuff",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:27:12Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 3,
    priority_level: PriorityLevel.MODERATE,
    content_types: [ContentType.HR]
  }
]

// Filter options for the moderation panel
export const PRIORITY_FILTER_OPTIONS = [
  { value: PriorityLevel.MODERATE, label: "Moderate" },
  { value: PriorityLevel.HIGH, label: "High" },
  { value: PriorityLevel.CRITICAL, label: "Critical" }
]

export const VIOLATION_FILTER_OPTIONS = [
  { value: ContentType.S, label: "Sexual Content" },
  { value: ContentType.H, label: "Hate Speech" },
  { value: ContentType.V, label: "Violence" },
  { value: ContentType.HR, label: "Harassment" },
  { value: ContentType.SH, label: "Self Harm" },
  { value: ContentType.S3, label: "CSAM Content" },
  { value: ContentType.H2, label: "Hate + Threats" },
  { value: ContentType.V2, label: "Graphic Violence" }
]

// Mock active users data by experience
export const mockActiveUsers: ActiveUser[] = [
  // Bloom (Experience ID: 1) - 89 players
  {
    id: "user_001",
    player_id: 89234,
    player_name: "FriendlyBuilder2011",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "45 minutes ago",
    experience_id: 1
  },
  {
    id: "user_002", 
    player_id: 67891,
    player_name: "LearningExplorer",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "32 minutes ago",
    experience_id: 1
  },
  {
    id: "user_003",
    player_id: 45678,
    player_name: "BloomModerator",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "2 hours ago",
    experience_id: 1
  },
  {
    id: "user_004",
    player_id: 23456,
    player_name: "YoungArtist123",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "18 minutes ago",
    experience_id: 1
  },
  {
    id: "user_005",
    player_id: 12345,
    player_name: "SafeKid2012",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "12 minutes ago",
    experience_id: 1
  },
  {
    id: "user_006",
    player_id: 98765,
    player_name: "CuriousLearner",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "8 minutes ago",
    experience_id: 1
  },
  {
    id: "user_007",
    player_id: 87654,
    player_name: "KindHelper2013",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "25 minutes ago",
    experience_id: 1
  },
  {
    id: "user_008",
    player_id: 76543,
    player_name: "MathWizardKid",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "15 minutes ago",
    experience_id: 1
  },

  // Creative Studios (Experience ID: 2) - 67 players
  {
    id: "user_009",
    player_id: 34567,
    player_name: "MasterBuilder999",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "28 minutes ago",
    experience_id: 2
  },
  {
    id: "user_010",
    player_id: 56789,
    player_name: "CreativeKid2013",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "22 minutes ago",
    experience_id: 2
  },
  {
    id: "user_011",
    player_id: 78901,
    player_name: "HelpfulFriend",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "19 minutes ago",
    experience_id: 2
  },
  {
    id: "user_012",
    player_id: 23890,
    player_name: "BlockMaster2012",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "35 minutes ago",
    experience_id: 2
  },
  {
    id: "user_013",
    player_id: 45612,
    player_name: "ArtisticBuilder",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "41 minutes ago",
    experience_id: 2
  },

  // Adventure Academy (Experience ID: 3) - 31 players
  {
    id: "user_014",
    player_id: 90123,
    player_name: "QuestMaster2014",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "52 minutes ago",
    experience_id: 3
  },
  {
    id: "user_015",
    player_id: 11234,
    player_name: "SmartExplorer",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "38 minutes ago",
    experience_id: 3
  },
  {
    id: "user_016",
    player_id: 13579,
    player_name: "TroubleMaker2010",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "26 minutes ago",
    experience_id: 3
  }
]

// Export experiences for moderation
export { mockExperiences }

// Export moderation history types and data
export type { ModerationHistory } from "./mod-history-data"
import { 
  mockModerationHistory as _mockModerationHistory, 
  generateHistoryEntry, 
  mapActionType, 
  generateActionReason,
  getHighestPriority,
  generateId
} from "./mod-history-data"

export { 
  generateHistoryEntry, 
  mapActionType, 
  generateActionReason,
  getHighestPriority,
  generateId
}

export const mockModerationHistory = _mockModerationHistory
// Alias for backward compatibility
export const moderationHistory = _mockModerationHistory

// Export queue data
export { mockQueueItems } from "./queue-data"
export type { QueueItem } from "./queue-data"