// Import moderation enums and types
import { PriorityLevel, ContentType, ActionType, PIIType } from "@/lib/colors-mod"

// Backend enums from sentiment analysis state
export enum UserRole {
  PLAYER = "PLAYER",
  MODERATOR = "MODERATOR", 
  ADMIN = "ADMIN"
}

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
  // Moderation analysis
  priority_level?: PriorityLevel
  content_types?: ContentType[]
  pii_detected?: PIIType[]
  community_actions?: CommunityAction[]
  moderation_actions?: ActionType[]
  safety_score?: number
}

// Mock chat data with realistic gaming scenarios
export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg_001",
    player_id: 12847,
    player_name: "GamerKing2024",
    message: "Hey everyone! Ready for the next raid? Let's team up!",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:17:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE
  },
  {
    id: "msg_002", 
    player_id: 8934,
    player_name: "NoobSlayer99",
    message: "You idiots suck at this game, just uninstall and leave",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:18:30Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    priority_level: PriorityLevel.HIGH,
    content_types: [ContentType.HR, ContentType.H]
  },
  {
    id: "msg_003",
    player_id: 15623,
    player_name: "SpeedRacer_Pro",
    message: "My credit card is 4532-1234-5678-9012 if anyone wants to buy me premium",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:19:15Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    priority_level: PriorityLevel.CRITICAL,
    pii_detected: [PIIType.CREDITCARDNUMBER]
  },
  {
    id: "msg_004",
    player_id: 7892,
    player_name: "HelperBot",
    message: "Welcome to the server! Check out our beginner guide in #help",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:20:45Z",
    role: UserRole.MODERATOR,
    status: UserStatus.ONLINE
  },
  {
    id: "msg_005",
    player_id: 5641,
    player_name: "ToxicPlayer2009",
    message: "I'm gonna find you IRL and beat the hell out of you for that kill",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:21:12Z", 
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    priority_level: PriorityLevel.CRITICAL,
    content_types: [ContentType.H2, ContentType.V]
  },
  {
    id: "msg_006",
    player_id: 11256,
    player_name: "BuilderMaster",
    message: "Great job on that castle build! Here's a tip for better towers...",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:22:33Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE
  },
  {
    id: "msg_007",
    player_id: 9876,
    player_name: "SpamBot_123",
    message: "FREE ROBUX HERE!!! CLICK LINK FOR 1000 FREE ROBUX NOW!!!",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:23:21Z",
    role: UserRole.PLAYER, 
    status: UserStatus.ONLINE,
    priority_level: PriorityLevel.MODERATE
  },
  {
    id: "msg_008",
    player_id: 3421,
    player_name: "NewPlayer2024",
    message: "Hi! I'm new here, how do I start playing?",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:24:18Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE
  },
  {
    id: "msg_009",
    player_id: 6547,
    player_name: "InappropriateUser",
    message: "Check out these hot pics of girls on this site... so sexy",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:25:45Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    priority_level: PriorityLevel.HIGH,
    content_types: [ContentType.S]
  },
  {
    id: "msg_010",
    player_id: 1234,
    player_name: "ChampionPlayer",
    message: "GG everyone! That was an amazing match. See you all tomorrow!",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:26:30Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE
  },
  {
    id: "msg_011",
    player_id: 8888,
    player_name: "PersonalInfoSharer",
    message: "My email is john.doe@gmail.com, add me on Discord!",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:27:12Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    priority_level: PriorityLevel.MODERATE,
    pii_detected: [PIIType.EMAIL]
  },
  {
    id: "msg_012",
    player_id: 4567,
    player_name: "ViolentGamer",
    message: "I'm gonna slaughter everyone with my shotgun and watch the blood splatter!",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:28:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    priority_level: PriorityLevel.HIGH,
    content_types: [ContentType.V2, ContentType.V]
  },
  {
    id: "msg_013",
    player_id: 9999,
    player_name: "AdminSupport",
    message: "Server maintenance will begin in 10 minutes. Please save your progress.",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:29:00Z",
    role: UserRole.ADMIN,
    status: UserStatus.ONLINE
  },
  {
    id: "msg_014",
    player_id: 5555,
    player_name: "BullyKid",
    message: "You're such a loser, nobody likes you here. Go kill yourself noob.",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:30:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    priority_level: PriorityLevel.CRITICAL,
    content_types: [ContentType.SH, ContentType.HR]
  },
  {
    id: "msg_015",
    player_id: 7777,
    player_name: "RacistGamer",
    message: "All players from that country are cheaters and shouldn't be allowed here",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:31:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
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