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
  // Adventure Quest (Experience ID: 1) - Fantasy RPG messages
  {
    id: "msg_001",
    player_id: 12847,
    player_name: "GamerKing2024",
    message: "Hey everyone! Ready for the next raid? Let's team up!",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:17:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 1
  },
  {
    id: "msg_002", 
    player_id: 8934,
    player_name: "NoobSlayer99",
    message: "You idiots suck at this dungeon, just quit and leave",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:18:30Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 1,
    priority_level: PriorityLevel.HIGH,
    content_types: [ContentType.HR, ContentType.H]
  },
  {
    id: "msg_003",
    player_id: 15623,
    player_name: "MagicWizard",
    message: "Found a legendary sword! Anyone want to trade for rare gems?",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:19:15Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 1
  },
  {
    id: "msg_004",
    player_id: 7892,
    player_name: "QuestHelper",
    message: "Welcome to Adventure Quest! Check the quest board for daily missions.",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:20:45Z",
    role: UserRole.MODERATOR,
    status: UserStatus.ONLINE,
    experience_id: 1
  },
  {
    id: "msg_005",
    player_id: 5641,
    player_name: "ToxicPlayer2009",
    message: "I'm gonna find you IRL and beat the hell out of you for stealing my loot",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:21:12Z", 
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 1,
    priority_level: PriorityLevel.CRITICAL,
    content_types: [ContentType.H2, ContentType.V]
  },

  // City Builder Pro (Experience ID: 2) - Construction themed messages
  {
    id: "msg_006",
    player_id: 11256,
    player_name: "BuilderMaster",
    message: "Check out my new skyscraper design! Used advanced engineering.",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:22:33Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 2
  },
  {
    id: "msg_007",
    player_id: 9876,
    player_name: "CityPlanner",
    message: "Need help with traffic optimization? Check my tutorial series!",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:23:21Z",
    role: UserRole.PLAYER, 
    status: UserStatus.ONLINE,
    experience_id: 2
  },
  {
    id: "msg_008",
    player_id: 3421,
    player_name: "NewBuilder",
    message: "How do I place roads? The tutorial isn't working for me.",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:24:18Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 2
  },

  // Racing Championship (Experience ID: 3) - Racing themed messages  
  {
    id: "msg_009",
    player_id: 6547,
    player_name: "SpeedDemon",
    message: "Just broke the track record! New time: 1:23.45",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:25:45Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 3
  },
  {
    id: "msg_010",
    player_id: 1234,
    player_name: "RaceChampion",
    message: "GG everyone! That was an amazing race. See you on the next track!",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:26:30Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 3
  },
  {
    id: "msg_011",
    player_id: 8888,
    player_name: "DriftKing",
    message: "Anyone know the best car setup for the mountain track?",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:27:12Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 3
  },
  {
    id: "msg_012",
    player_id: 4567,
    player_name: "RoadRager",
    message: "I'm gonna crash into everyone and wreck their cars! No mercy!",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:28:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 3,
    priority_level: PriorityLevel.HIGH,
    content_types: [ContentType.V, ContentType.HR]
  },

  // Space Explorer (Experience ID: 4) - Sci-fi themed messages
  {
    id: "msg_013",
    player_id: 9999,
    player_name: "SpaceAdmin",
    message: "New planet discovered! Join the exploration mission at coordinates X-47.",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:29:00Z",
    role: UserRole.ADMIN,
    status: UserStatus.ONLINE,
    experience_id: 4
  },
  {
    id: "msg_014",
    player_id: 5555,
    player_name: "AlienHunter",
    message: "Found alien tech! Trading for rare materials.",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:30:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 4
  },
  {
    id: "msg_015",
    player_id: 7777,
    player_name: "CosmicExplorer",
    message: "My spaceship is faster than yours! Race to Mars?",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:31:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 4
  },

  // Pet Paradise (Experience ID: 5) - Pet care themed messages
  {
    id: "msg_016",
    player_id: 2222,
    player_name: "PetLover",
    message: "Look at my new puppy! Isn't he adorable?",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:32:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 5
  },
  {
    id: "msg_017",
    player_id: 3333,
    player_name: "AnimalTrainer",
    message: "Teaching pets new tricks! Join my training academy.",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:33:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 5
  },

  // Survival Island (Experience ID: 6) - Survival themed messages
  {
    id: "msg_018",
    player_id: 4444,
    player_name: "IslandSurvivor",
    message: "Found fresh water source near the volcano! Sharing coordinates.",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:34:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 6
  },
  {
    id: "msg_019",
    player_id: 5555,
    player_name: "ResourceHoarder",
    message: "My credit card is 4532-1234-5678-9012 if you want to buy me premium tools",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:35:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 6,
    priority_level: PriorityLevel.CRITICAL,
    pii_detected: [PIIType.CREDITCARDNUMBER]
  },
  {
    id: "msg_020",
    player_id: 6666,
    player_name: "TribalChief",
    message: "All outsiders are not welcome on this island! Get out!",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:36:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 6,
    priority_level: PriorityLevel.HIGH,
    content_types: [ContentType.H]
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
  // Adventure Quest (Experience ID: 1)
  {
    id: "user_001",
    player_id: 12847,
    player_name: "Beth Flores",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "2 hours ago",
    experience_id: 1
  },
  {
    id: "user_002", 
    player_id: 8934,
    player_name: "Albert Steward",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "1 hour ago",
    experience_id: 1
  },
  {
    id: "user_003",
    player_id: 15623,
    player_name: "Morris Fox",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "45 minutes ago",
    experience_id: 1
  },
  {
    id: "user_004",
    player_id: 7892,
    player_name: "Ricardo Watson",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "30 minutes ago",
    experience_id: 1
  },
  {
    id: "user_005",
    player_id: 5641,
    player_name: "Leslie Howard",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "25 minutes ago",
    experience_id: 1
  },

  // City Builder Pro (Experience ID: 2)
  {
    id: "user_006",
    player_id: 11256,
    player_name: "Jenny Robertson",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "20 minutes ago",
    experience_id: 2
  },
  {
    id: "user_007",
    player_id: 9876,
    player_name: "Esther Murphy",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "15 minutes ago",
    experience_id: 2
  },
  {
    id: "user_008",
    player_id: 3421,
    player_name: "Morris Fox",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "10 minutes ago",
    experience_id: 2
  },

  // Racing Championship (Experience ID: 3)
  {
    id: "user_009",
    player_id: 6547,
    player_name: "Albert Steward",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "5 minutes ago",
    experience_id: 3
  },
  {
    id: "user_010",
    player_id: 1234,
    player_name: "Racing Pro",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "12 minutes ago",
    experience_id: 3
  },

  // Space Explorer (Experience ID: 4)
  {
    id: "user_011",
    player_id: 9999,
    player_name: "Space Captain",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "8 minutes ago",
    experience_id: 4
  },
  {
    id: "user_012",
    player_id: 5555,
    player_name: "Cosmic Pilot",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "6 minutes ago",
    experience_id: 4
  },

  // Pet Paradise (Experience ID: 5)
  {
    id: "user_013",
    player_id: 2222,
    player_name: "Pet Trainer",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "18 minutes ago",
    experience_id: 5
  },
  {
    id: "user_014",
    player_id: 3333,
    player_name: "Animal Friend",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "22 minutes ago",
    experience_id: 5
  },

  // Survival Island (Experience ID: 6)
  {
    id: "user_015",
    player_id: 4444,
    player_name: "Island Scout",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "14 minutes ago",
    experience_id: 6
  },
  {
    id: "user_016",
    player_id: 6666,
    player_name: "Survival Expert",
    avatar_url: "/api/placeholder/40/40",
    status: UserStatus.ONLINE,
    join_time: "28 minutes ago",
    experience_id: 6
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