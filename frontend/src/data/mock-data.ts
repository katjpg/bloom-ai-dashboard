// Centralized Mock Data for Bloom AI Dashboard
// Single source of truth for all mock data across the application

// Import moderation enums from colors-mod
import { PriorityLevel, ContentType, ActionType, PIIType } from "@/lib/colors-mod"

// ===== MODERATION HISTORY TYPES AND UTILITIES =====

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
  return `hist_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
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
      status: 'active' as const,
      isAutomated: false
    }
  })
}

// ===== SHARED TYPE DEFINITIONS =====

export type TrendDirection = "up" | "down"

export interface TrendData {
  trend: TrendDirection
  change: number
}

export enum UserRole {
  PLAYER = "PLAYER",
  VIP = "VIP", 
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

// ===== EXPERIENCE DATA =====

export interface RobloxExperience {
  id: number
  title: string
  description: string
  isActive: boolean
  safetyScore: number
  lastUpdated: string
  playerCount: number
  thumbnail: string
}

export const mockExperiences: RobloxExperience[] = [
  {
    id: 1,
    title: "Bloom",
    description: "A safe community space for young gamers to learn, create, and make friends. Features educational mini-games and positive social interactions.",
    isActive: true,
    safetyScore: 96.8,
    lastUpdated: "15 minutes ago",
    playerCount: 23,
    thumbnail: "/api/placeholder/400/225"
  },
  {
    id: 2,
    title: "Creative Studios",
    description: "Build amazing creations with friends! Collaborative building tools and creative challenges await.",
    isActive: true,
    safetyScore: 94.2,
    lastUpdated: "32 minutes ago",
    playerCount: 18,
    thumbnail: "/api/placeholder/400/225"
  },
  {
    id: 3,
    title: "Adventure Academy",
    description: "Embark on educational quests and solve puzzles together. Learning meets adventure in this engaging experience.",
    isActive: false,
    safetyScore: 92.1,
    lastUpdated: "2 hours ago",
    playerCount: 8,
    thumbnail: "/api/placeholder/400/225"
  }
]

// ===== DASHBOARD METRICS =====

export interface MockMetrics {
  totalMessages: number
  activeUsers: number
  safetyScore: number
  avgResponseTime: number
}

export interface MockTrends {
  totalMessages: TrendData
  activeUsers: TrendData
  safetyScore: TrendData
  avgResponseTime: TrendData
}

export const mockMetrics: MockMetrics = {
  totalMessages: 847,
  activeUsers: 42,
  safetyScore: 94.2,
  avgResponseTime: 125
}

export const mockTrends: MockTrends = {
  totalMessages: { trend: "up", change: 12.5 },
  activeUsers: { trend: "down", change: -2.1 },
  safetyScore: { trend: "up", change: 1.8 },
  avgResponseTime: { trend: "down", change: -8.3 }
}

export interface MessageVolumeData {
  hour: string
  approved: number
  flagged: number
  violations: number
}

export const mockMessageVolumeData: MessageVolumeData[] = [
  { hour: "00", approved: 8, flagged: 1, violations: 0 },
  { hour: "01", approved: 6, flagged: 0, violations: 0 },
  { hour: "02", approved: 4, flagged: 0, violations: 0 },
  { hour: "03", approved: 5, flagged: 0, violations: 0 },
  { hour: "04", approved: 9, flagged: 1, violations: 0 },
  { hour: "05", approved: 12, flagged: 1, violations: 0 },
  { hour: "06", approved: 16, flagged: 1, violations: 0 },
  { hour: "07", approved: 21, flagged: 2, violations: 1 },
  { hour: "08", approved: 28, flagged: 2, violations: 1 },
  { hour: "09", approved: 35, flagged: 3, violations: 1 },
  { hour: "10", approved: 42, flagged: 3, violations: 1 },
  { hour: "11", approved: 48, flagged: 4, violations: 2 },
  { hour: "12", approved: 52, flagged: 4, violations: 2 },
  { hour: "13", approved: 56, flagged: 5, violations: 2 },
  { hour: "14", approved: 58, flagged: 5, violations: 2 },
  { hour: "15", approved: 61, flagged: 6, violations: 3 },
  { hour: "16", approved: 64, flagged: 6, violations: 3 },
  { hour: "17", approved: 67, flagged: 7, violations: 3 },
  { hour: "18", approved: 58, flagged: 5, violations: 2 },
  { hour: "19", approved: 52, flagged: 4, violations: 2 },
  { hour: "20", approved: 45, flagged: 3, violations: 1 },
  { hour: "21", approved: 38, flagged: 3, violations: 1 },
  { hour: "22", approved: 28, flagged: 2, violations: 1 },
  { hour: "23", approved: 18, flagged: 1, violations: 0 }
]

// ===== LEADERBOARD DATA =====

export interface LeaderboardPlayer {
  id: number
  username: string
  avatar_url?: string
  score: number
  positiveActions: number
  trend: "up" | "down" | "stable"
  recentChange: number
  rank: number
  experienceId: number
  experienceName: string
}

export type TimePeriod = "today" | "week" | "month" | "alltime"

export const mockLeaderboardData: Record<TimePeriod, LeaderboardPlayer[]> = {
  today: [
    { id: 1, username: "remiel430", score: 48, positiveActions: 12, trend: "up", recentChange: 6, rank: 1, experienceId: 1, experienceName: "Bloom" },
    { id: 2, username: "4aimstar", score: 42, positiveActions: 11, trend: "up", recentChange: 4, rank: 2, experienceId: 2, experienceName: "Creative Studios" },
    { id: 3, username: "Nooburai", score: 38, positiveActions: 9, trend: "up", recentChange: 3, rank: 3, experienceId: 1, experienceName: "Bloom" },
    { id: 4, username: "coolkid789", score: 34, positiveActions: 8, trend: "up", recentChange: 5, rank: 4, experienceId: 1, experienceName: "Bloom" },
    { id: 5, username: "buildit_999", score: 30, positiveActions: 7, trend: "stable", recentChange: 0, rank: 5, experienceId: 2, experienceName: "Creative Studios" },
    { id: 6, username: "pixelmaster24", score: 28, positiveActions: 6, trend: "up", recentChange: 2, rank: 6, experienceId: 2, experienceName: "Creative Studios" },
    { id: 7, username: "smartkid123", score: 24, positiveActions: 5, trend: "down", recentChange: -1, rank: 7, experienceId: 3, experienceName: "Adventure Academy" },
    { id: 8, username: "creator456", score: 22, positiveActions: 4, trend: "up", recentChange: 1, rank: 8, experienceId: 1, experienceName: "Bloom" },
  ],
  week: [
    { id: 1, username: "remiel430", score: 286, positiveActions: 72, trend: "up", recentChange: 28, rank: 1, experienceId: 1, experienceName: "Bloom" },
    { id: 2, username: "4aimstar", score: 248, positiveActions: 63, trend: "up", recentChange: 22, rank: 2, experienceId: 2, experienceName: "Creative Studios" },
    { id: 3, username: "Nooburai", score: 212, positiveActions: 54, trend: "up", recentChange: 18, rank: 3, experienceId: 1, experienceName: "Bloom" },
    { id: 4, username: "coolkid789", score: 194, positiveActions: 48, trend: "up", recentChange: 15, rank: 4, experienceId: 1, experienceName: "Bloom" },
    { id: 5, username: "pixelmaster24", score: 176, positiveActions: 42, trend: "up", recentChange: 12, rank: 5, experienceId: 2, experienceName: "Creative Studios" },
    { id: 6, username: "buildit_999", score: 158, positiveActions: 38, trend: "stable", recentChange: 2, rank: 6, experienceId: 2, experienceName: "Creative Studios" },
    { id: 7, username: "smartkid123", score: 142, positiveActions: 34, trend: "down", recentChange: -6, rank: 7, experienceId: 3, experienceName: "Adventure Academy" },
    { id: 8, username: "creator456", score: 128, positiveActions: 30, trend: "up", recentChange: 8, rank: 8, experienceId: 1, experienceName: "Bloom" },
  ],
  month: [
    { id: 1, username: "remiel430", score: 424, positiveActions: 287, trend: "up", recentChange: 98, rank: 1, experienceId: 1, experienceName: "Bloom" },
    { id: 2, username: "4aimstar", score: 376, positiveActions: 243, trend: "up", recentChange: 76, rank: 2, experienceId: 2, experienceName: "Creative Studios" },
    { id: 3, username: "Nooburai", score: 334, positiveActions: 208, trend: "up", recentChange: 67, rank: 3, experienceId: 1, experienceName: "Bloom" },
    { id: 4, username: "coolkid789", score: 298, positiveActions: 186, trend: "up", recentChange: 54, rank: 4, experienceId: 1, experienceName: "Bloom" },
    { id: 5, username: "pixelmaster24", score: 268, positiveActions: 172, trend: "up", recentChange: 43, rank: 5, experienceId: 2, experienceName: "Creative Studios" },
    { id: 6, username: "buildit_999", score: 244, positiveActions: 158, trend: "stable", recentChange: 8, rank: 6, experienceId: 2, experienceName: "Creative Studios" },
    { id: 7, username: "smartkid123", score: 216, positiveActions: 145, trend: "down", recentChange: -18, rank: 7, experienceId: 3, experienceName: "Adventure Academy" },
    { id: 8, username: "creator456", score: 194, positiveActions: 132, trend: "up", recentChange: 32, rank: 8, experienceId: 1, experienceName: "Bloom" },
  ],
  alltime: [
    { id: 1, username: "remiel430", score: 1248, positiveActions: 824, trend: "up", recentChange: 156, rank: 1, experienceId: 1, experienceName: "Bloom" },
    { id: 2, username: "4aimstar", score: 1096, positiveActions: 734, trend: "up", recentChange: 134, rank: 2, experienceId: 2, experienceName: "Creative Studios" },
    { id: 3, username: "Nooburai", score: 964, positiveActions: 642, trend: "up", recentChange: 98, rank: 3, experienceId: 1, experienceName: "Bloom" },
    { id: 4, username: "coolkid789", score: 834, positiveActions: 558, trend: "up", recentChange: 87, rank: 4, experienceId: 1, experienceName: "Bloom" },
    { id: 5, username: "pixelmaster24", score: 736, positiveActions: 496, trend: "up", recentChange: 76, rank: 5, experienceId: 2, experienceName: "Creative Studios" },
    { id: 6, username: "buildit_999", score: 662, positiveActions: 445, trend: "stable", recentChange: 12, rank: 6, experienceId: 2, experienceName: "Creative Studios" },
    { id: 7, username: "smartkid123", score: 594, positiveActions: 408, trend: "up", recentChange: 45, rank: 7, experienceId: 3, experienceName: "Adventure Academy" },
    { id: 8, username: "creator456", score: 526, positiveActions: 364, trend: "up", recentChange: 67, rank: 8, experienceId: 1, experienceName: "Bloom" },
  ]
}

export const mockLeaderboardStats = {
  today: {
    activeContributors: 24,
    positiveActions: 67,
    positivityRate: 95.8
  },
  week: {
    activeContributors: 42,
    positiveActions: 381,
    positivityRate: 94.2
  },
  month: {
    activeContributors: 42,
    positiveActions: 1681,
    positivityRate: 92.6
  },
  alltime: {
    activeContributors: 42,
    positiveActions: 4680,
    positivityRate: 91.2
  }
}

// ===== ANALYTICS DATA =====

export interface AnalyticsMetrics {
  totalMessages: number
  pointsAwarded: number
  positiveActions: number
  averageSentiment: number
}

export interface AnalyticsTrends {
  totalMessages: TrendData
  pointsAwarded: TrendData
  positiveActions: TrendData
  averageSentiment: TrendData
}

export const mockAnalyticsMetrics: AnalyticsMetrics = {
  totalMessages: 847,
  pointsAwarded: 1694,
  positiveActions: 597,
  averageSentiment: 34.7
}

export const mockAnalyticsTrends: AnalyticsTrends = {
  totalMessages: { trend: "up", change: 18.2 },
  pointsAwarded: { trend: "up", change: 24.5 },
  positiveActions: { trend: "up", change: 15.8 },
  averageSentiment: { trend: "up", change: 8.3 }
}

export interface SentimentDistribution {
  positive: number
  neutral: number
  negative: number
}

export const mockSentimentDistribution: SentimentDistribution = {
  positive: 58.3,
  neutral: 31.2,
  negative: 10.5
}

export interface SentimentScale {
  currentScore: number
  previousScore: number
}

export const mockSentimentScale: SentimentScale = {
  currentScore: 34.7,
  previousScore: 26.4
}

// ===== CHAT MESSAGE DATA =====

export interface ChatMessage {
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
  community_actions?: CommunityAction[]
  moderation_actions?: ActionType[]
  safety_score?: number
}

export interface ActiveUser {
  id: string
  player_id: number
  player_name: string
  avatar_url: string
  status: UserStatus
  join_time: string
  experience_id: number
}

// Realistic Roblox usernames for active users
export const mockActiveUsers: ActiveUser[] = [
  { id: "user_001", player_id: 123456, player_name: "remiel430", avatar_url: "/api/placeholder/40/40", status: UserStatus.ONLINE, join_time: "2 minutes ago", experience_id: 1 },
  { id: "user_002", player_id: 234567, player_name: "4aimstar", avatar_url: "/api/placeholder/40/40", status: UserStatus.ONLINE, join_time: "5 minutes ago", experience_id: 1 },
  { id: "user_003", player_id: 345678, player_name: "Nooburai", avatar_url: "/api/placeholder/40/40", status: UserStatus.ONLINE, join_time: "8 minutes ago", experience_id: 1 },
  { id: "user_004", player_id: 456789, player_name: "xxCoolGamer2011xx", avatar_url: "/api/placeholder/40/40", status: UserStatus.ONLINE, join_time: "12 minutes ago", experience_id: 2 },
  { id: "user_005", player_id: 567890, player_name: "BuilderPro999", avatar_url: "/api/placeholder/40/40", status: UserStatus.ONLINE, join_time: "15 minutes ago", experience_id: 2 },
  { id: "user_006", player_id: 678901, player_name: "PixelArtist2014", avatar_url: "/api/placeholder/40/40", status: UserStatus.ONLINE, join_time: "18 minutes ago", experience_id: 2 },
  { id: "user_007", player_id: 789012, player_name: "MathHelper123", avatar_url: "/api/placeholder/40/40", status: UserStatus.OFFLINE, join_time: "25 minutes ago", experience_id: 3 },
  { id: "user_008", player_id: 890123, player_name: "CreativeKid456", avatar_url: "/api/placeholder/40/40", status: UserStatus.ONLINE, join_time: "30 minutes ago", experience_id: 1 },
  { id: "user_009", player_id: 901234, player_name: "GameMaster789", avatar_url: "/api/placeholder/40/40", status: UserStatus.ONLINE, join_time: "35 minutes ago", experience_id: 1 },
  { id: "user_010", player_id: 912345, player_name: "ProGamer2013", avatar_url: "/api/placeholder/40/40", status: UserStatus.ONLINE, join_time: "42 minutes ago", experience_id: 2 }
]

// Sample chat messages with realistic Roblox usernames and gamer language
export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg_001",
    player_id: 123456,
    player_name: "remiel430",
    message: "yo just got that sick victory royale! anyone wanna squad up for another round?",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:17:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 1
  },
  {
    id: "msg_002", 
    player_id: 345678,
    player_name: "Nooburai",
    message: "bruh how do i get better aim in this game?? keep getting rekt lol",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:18:30Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 1
  },
  {
    id: "msg_003",
    player_id: 100001,
    player_name: "BloomModerator",
    message: "hey gamers! welcome to bloom, keep it fun and help each other level up :)",
    avatar_url: "/api/placeholder/40/40", 
    timestamp: "2024-06-15T20:19:15Z",
    role: UserRole.MODERATOR,
    status: UserStatus.ONLINE,
    experience_id: 1
  },
  {
    id: "msg_004",
    player_id: 234567,
    player_name: "4aimstar",
    message: "got u bro! practice in the training arena first, then adjust your sensitivity settings",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:20:00Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 1,
    community_actions: [CommunityAction.HELPFUL_ADVICE],
    safety_score: 98.5
  },
  {
    id: "msg_005",
    player_id: 456789,
    player_name: "coolkid789",
    message: "yooo just hopped into creative mode, bout to build the sickest castle! 🏰",
    avatar_url: "/api/placeholder/40/40",
    timestamp: "2024-06-15T20:21:30Z",
    role: UserRole.PLAYER,
    status: UserStatus.ONLINE,
    experience_id: 2,
    community_actions: [CommunityAction.APPRECIATION],
    safety_score: 95.2
  }
]

// ===== COMMUNITY ACTION METRICS =====

export interface CommunityActionMetrics {
  totalActions: number
  positiveActions: number
  negativeActions: number
  activeContributors: number
  actionsPerUser: number
  positivePercentage: number
}

export interface CommunityActionTrends {
  totalActions: TrendData
  positiveActions: TrendData
  activeContributors: TrendData
  actionsPerUser: TrendData
}

export const mockCommunityActionMetrics: CommunityActionMetrics = {
  totalActions: 715,
  positiveActions: 597,
  negativeActions: 118,
  activeContributors: 42,
  actionsPerUser: 17.0,
  positivePercentage: 83.5
}

export const mockCommunityActionTrends: CommunityActionTrends = {
  totalActions: { trend: "up", change: 12.8 },
  positiveActions: { trend: "up", change: 15.8 },
  activeContributors: { trend: "up", change: 8.4 },
  actionsPerUser: { trend: "up", change: 6.2 }
}

// ===== ADDITIONAL ANALYTICS DATA =====

export interface HourlyActionData {
  hour: string
  positiveActions: number
  negativeActions: number
  totalActions: number
  activeUsers: number
}

export interface DailyActionData {
  day: string
  date: string
  positiveActions: number
  negativeActions: number
  totalActions: number
  activeUsers: number
}

export interface WeeklyActionData {
  week: string
  weekNumber: number
  positiveActions: number
  negativeActions: number
  totalActions: number
  activeUsers: number
}

// Mock hourly action data (scaled down)
export const mockHourlyActionData: HourlyActionData[] = [
  { hour: "00", positiveActions: 28, negativeActions: 2, totalActions: 30, activeUsers: 18 },
  { hour: "01", positiveActions: 22, negativeActions: 1, totalActions: 23, activeUsers: 15 },
  { hour: "02", positiveActions: 18, negativeActions: 1, totalActions: 19, activeUsers: 12 },
  { hour: "03", positiveActions: 16, negativeActions: 1, totalActions: 17, activeUsers: 11 },
  { hour: "04", positiveActions: 20, negativeActions: 1, totalActions: 21, activeUsers: 13 },
  { hour: "05", positiveActions: 25, negativeActions: 2, totalActions: 27, activeUsers: 16 },
  { hour: "06", positiveActions: 32, negativeActions: 3, totalActions: 35, activeUsers: 19 },
  { hour: "07", positiveActions: 41, negativeActions: 3, totalActions: 44, activeUsers: 24 },
  { hour: "08", positiveActions: 52, negativeActions: 4, totalActions: 56, activeUsers: 30 },
  { hour: "09", positiveActions: 61, negativeActions: 5, totalActions: 66, activeUsers: 35 },
  { hour: "10", positiveActions: 68, negativeActions: 5, totalActions: 73, activeUsers: 38 },
  { hour: "11", positiveActions: 75, negativeActions: 6, totalActions: 81, activeUsers: 42 },
  { hour: "12", positiveActions: 84, negativeActions: 7, totalActions: 91, activeUsers: 46 },
  { hour: "13", positiveActions: 89, negativeActions: 7, totalActions: 96, activeUsers: 48 },
  { hour: "14", positiveActions: 93, negativeActions: 8, totalActions: 101, activeUsers: 50 },
  { hour: "15", positiveActions: 97, negativeActions: 8, totalActions: 105, activeUsers: 52 },
  { hour: "16", positiveActions: 91, negativeActions: 7, totalActions: 98, activeUsers: 49 },
  { hour: "17", positiveActions: 85, negativeActions: 7, totalActions: 92, activeUsers: 47 },
  { hour: "18", positiveActions: 78, negativeActions: 6, totalActions: 84, activeUsers: 43 },
  { hour: "19", positiveActions: 71, negativeActions: 6, totalActions: 77, activeUsers: 39 },
  { hour: "20", positiveActions: 62, negativeActions: 5, totalActions: 67, activeUsers: 34 },
  { hour: "21", positiveActions: 50, negativeActions: 4, totalActions: 54, activeUsers: 28 },
  { hour: "22", positiveActions: 40, negativeActions: 3, totalActions: 43, activeUsers: 23 },
  { hour: "23", positiveActions: 33, negativeActions: 3, totalActions: 36, activeUsers: 19 }
]

// Mock daily action data (scaled down)
export const mockDailyActionData: DailyActionData[] = [
  { 
    day: "Mon", 
    date: "2024-01-15", 
    positiveActions: 1234, 
    negativeActions: 98, 
    totalActions: 1332, 
    activeUsers: 187 
  },
  { 
    day: "Tue", 
    date: "2024-01-16", 
    positiveActions: 1389, 
    negativeActions: 89, 
    totalActions: 1478, 
    activeUsers: 192 
  },
  { 
    day: "Wed", 
    date: "2024-01-17", 
    positiveActions: 1423, 
    negativeActions: 76, 
    totalActions: 1499, 
    activeUsers: 201 
  },
  { 
    day: "Thu", 
    date: "2024-01-18", 
    positiveActions: 1456, 
    negativeActions: 64, 
    totalActions: 1520, 
    activeUsers: 214 
  },
  { 
    day: "Fri", 
    date: "2024-01-19", 
    positiveActions: 1534, 
    negativeActions: 58, 
    totalActions: 1592, 
    activeUsers: 228 
  },
  { 
    day: "Sat", 
    date: "2024-01-20", 
    positiveActions: 1489, 
    negativeActions: 67, 
    totalActions: 1556, 
    activeUsers: 216 
  },
  { 
    day: "Sun", 
    date: "2024-01-21", 
    positiveActions: 1367, 
    negativeActions: 82, 
    totalActions: 1449, 
    activeUsers: 198 
  }
]

// Mock weekly action data (scaled down)
export const mockWeeklyActionData: WeeklyActionData[] = [
  { 
    week: "Week 1", 
    weekNumber: 1, 
    positiveActions: 8467, 
    negativeActions: 634, 
    totalActions: 9101, 
    activeUsers: 1456 
  },
  { 
    week: "Week 2", 
    weekNumber: 2, 
    positiveActions: 9156, 
    negativeActions: 567, 
    totalActions: 9723, 
    activeUsers: 1523 
  },
  { 
    week: "Week 3", 
    weekNumber: 3, 
    positiveActions: 9892, 
    negativeActions: 534, 
    totalActions: 10426, 
    activeUsers: 1589 
  },
  { 
    week: "Week 4", 
    weekNumber: 4, 
    positiveActions: 9323, 
    negativeActions: 556, 
    totalActions: 9879, 
    activeUsers: 1556 
  }
]

export interface HourlySentimentData {
  hour: string
  averageSentiment: number
  messageCount: number
  positiveCount: number
  neutralCount: number
  negativeCount: number
}

export interface DailySentimentData {
  day: string
  date: string
  averageSentiment: number
  messageCount: number
  positiveCount: number
  neutralCount: number
  negativeCount: number
}

export interface WeeklySentimentData {
  week: string
  weekNumber: number
  averageSentiment: number
  messageCount: number
  positiveCount: number
  neutralCount: number
  negativeCount: number
}

// Daily sentiment data for 7-day trends (scaled down)
export const mockDailySentimentData: DailySentimentData[] = [
  { 
    day: "Mon", 
    date: "2024-01-15", 
    averageSentiment: 28.5, 
    messageCount: 245, 
    positiveCount: 142, 
    neutralCount: 85, 
    negativeCount: 18 
  },
  { 
    day: "Tue", 
    date: "2024-01-16", 
    averageSentiment: 32.8, 
    messageCount: 256, 
    positiveCount: 154, 
    neutralCount: 89, 
    negativeCount: 13 
  },
  { 
    day: "Wed", 
    date: "2024-01-17", 
    averageSentiment: 36.2, 
    messageCount: 284, 
    positiveCount: 175, 
    neutralCount: 95, 
    negativeCount: 14 
  },
  { 
    day: "Thu", 
    date: "2024-01-18", 
    averageSentiment: 41.7, 
    messageCount: 307, 
    positiveCount: 198, 
    neutralCount: 94, 
    negativeCount: 15 
  },
  { 
    day: "Fri", 
    date: "2024-01-19", 
    averageSentiment: 45.3, 
    messageCount: 339, 
    positiveCount: 224, 
    neutralCount: 99, 
    negativeCount: 16 
  },
  { 
    day: "Sat", 
    date: "2024-01-20", 
    averageSentiment: 38.9, 
    messageCount: 325, 
    positiveCount: 205, 
    neutralCount: 103, 
    negativeCount: 17 
  },
  { 
    day: "Sun", 
    date: "2024-01-21", 
    averageSentiment: 34.7, 
    messageCount: 284, 
    positiveCount: 167, 
    neutralCount: 95, 
    negativeCount: 22 
  }
]

// Weekly sentiment data for monthly trends (scaled down)
export const mockWeeklySentimentData: WeeklySentimentData[] = [
  { 
    week: "Week 1", 
    weekNumber: 1, 
    averageSentiment: 26.4, 
    messageCount: 1854, 
    positiveCount: 967, 
    neutralCount: 654, 
    negativeCount: 233 
  },
  { 
    week: "Week 2", 
    weekNumber: 2, 
    averageSentiment: 31.8, 
    messageCount: 1956, 
    positiveCount: 1189, 
    neutralCount: 567, 
    negativeCount: 200 
  },
  { 
    week: "Week 3", 
    weekNumber: 3, 
    averageSentiment: 38.2, 
    messageCount: 2134, 
    positiveCount: 1389, 
    neutralCount: 589, 
    negativeCount: 156 
  },
  { 
    week: "Week 4", 
    weekNumber: 4, 
    averageSentiment: 34.7, 
    messageCount: 1978, 
    positiveCount: 1234, 
    neutralCount: 567, 
    negativeCount: 177 
  }
]

// Mock hourly sentiment data (scaled down)
export const mockHourlySentimentData: HourlySentimentData[] = [
  { hour: "00", averageSentiment: 28.3, messageCount: 8, positiveCount: 5, neutralCount: 2, negativeCount: 1 },
  { hour: "01", averageSentiment: 31.2, messageCount: 6, positiveCount: 4, neutralCount: 2, negativeCount: 0 },
  { hour: "02", averageSentiment: 25.7, messageCount: 4, positiveCount: 2, neutralCount: 2, negativeCount: 0 },
  { hour: "03", averageSentiment: 29.1, messageCount: 5, positiveCount: 3, neutralCount: 2, negativeCount: 0 },
  { hour: "04", averageSentiment: 33.4, messageCount: 9, positiveCount: 6, neutralCount: 2, negativeCount: 1 },
  { hour: "05", averageSentiment: 35.8, messageCount: 12, positiveCount: 8, neutralCount: 3, negativeCount: 1 },
  { hour: "06", averageSentiment: 38.2, messageCount: 16, positiveCount: 11, neutralCount: 4, negativeCount: 1 },
  { hour: "07", averageSentiment: 41.7, messageCount: 21, positiveCount: 14, neutralCount: 5, negativeCount: 2 },
  { hour: "08", averageSentiment: 45.3, messageCount: 28, positiveCount: 19, neutralCount: 7, negativeCount: 2 },
  { hour: "09", averageSentiment: 42.8, messageCount: 35, positiveCount: 23, neutralCount: 9, negativeCount: 3 },
  { hour: "10", averageSentiment: 39.6, messageCount: 42, positiveCount: 27, neutralCount: 12, negativeCount: 3 },
  { hour: "11", averageSentiment: 37.4, messageCount: 48, positiveCount: 30, neutralCount: 14, negativeCount: 4 },
  { hour: "12", averageSentiment: 35.9, messageCount: 52, positiveCount: 32, neutralCount: 16, negativeCount: 4 },
  { hour: "13", averageSentiment: 33.2, messageCount: 56, positiveCount: 34, neutralCount: 18, negativeCount: 4 },
  { hour: "14", averageSentiment: 31.8, messageCount: 58, positiveCount: 35, neutralCount: 19, negativeCount: 4 },
  { hour: "15", averageSentiment: 29.7, messageCount: 61, positiveCount: 36, neutralCount: 20, negativeCount: 5 },
  { hour: "16", averageSentiment: 32.1, messageCount: 64, positiveCount: 39, neutralCount: 20, negativeCount: 5 },
  { hour: "17", averageSentiment: 34.6, messageCount: 67, positiveCount: 42, neutralCount: 20, negativeCount: 5 },
  { hour: "18", averageSentiment: 36.8, messageCount: 58, positiveCount: 36, neutralCount: 18, negativeCount: 4 },
  { hour: "19", averageSentiment: 38.9, messageCount: 52, positiveCount: 33, neutralCount: 16, negativeCount: 3 },
  { hour: "20", averageSentiment: 35.4, messageCount: 45, positiveCount: 28, neutralCount: 14, negativeCount: 3 },
  { hour: "21", averageSentiment: 33.7, messageCount: 38, positiveCount: 24, neutralCount: 12, negativeCount: 2 },
  { hour: "22", averageSentiment: 31.2, messageCount: 28, positiveCount: 18, neutralCount: 8, negativeCount: 2 },
  { hour: "23", averageSentiment: 29.8, messageCount: 18, positiveCount: 11, neutralCount: 6, negativeCount: 1 }
]

// ===== FILTER OPTIONS =====

export const PRIORITY_FILTER_OPTIONS = [
  { value: "all", label: "All Priorities" },
  { value: PriorityLevel.CRITICAL, label: "Critical" },
  { value: PriorityLevel.HIGH, label: "High" },
  { value: PriorityLevel.MODERATE, label: "Moderate" }
]

export const VIOLATION_FILTER_OPTIONS = [
  { value: "all", label: "All Content" },
  { value: ContentType.S, label: "Sexual Content" },
  { value: ContentType.H, label: "Hate Speech" },
  { value: ContentType.V, label: "Violence" },
  { value: ContentType.HR, label: "Harassment" },
  { value: ContentType.SH, label: "Self-Harm" }
]

// ===== UTILITY FUNCTIONS =====

// Utility functions for sentiment analysis
export const getSentimentColor = (sentiment: number): string => {
  if (sentiment >= 40) return "hsl(142 76% 36%)" // Strong positive - green
  if (sentiment >= 15) return "hsl(142 71% 45%)" // Moderate positive - lighter green
  if (sentiment >= -10) return "hsl(45 96% 53%)" // Neutral - yellow/amber
  if (sentiment >= -30) return "hsl(25 95% 53%)" // Moderate negative - orange
  return "hsl(0 84% 60%)" // Strong negative - red
}

export const getSentimentLabel = (sentiment: number): string => {
  if (sentiment >= 40) return "Very Positive"
  if (sentiment >= 15) return "Positive"
  if (sentiment >= -10) return "Neutral"
  if (sentiment >= -30) return "Negative"
  return "Very Negative"
}

export const getActionTypeColor = (action: CommunityAction): string => {
  const positiveActions = [
    CommunityAction.ENCOURAGEMENT,
    CommunityAction.HELPFUL_ADVICE,
    CommunityAction.WELCOME_NEWCOMER,
    CommunityAction.TEAM_COORDINATION,
    CommunityAction.APPRECIATION,
    CommunityAction.CELEBRATION,
    CommunityAction.KNOWLEDGE_SHARING
  ]
  
  if (positiveActions.includes(action)) {
    return "hsl(142 76% 36%)" // Green
  }
  
  return "hsl(0 84% 60%)" // Red
}

export const getActionLabel = (action: CommunityAction): string => {
  const labels: Record<CommunityAction, string> = {
    [CommunityAction.ENCOURAGEMENT]: "Encouragement",
    [CommunityAction.HELPFUL_ADVICE]: "Helpful Advice", 
    [CommunityAction.WELCOME_NEWCOMER]: "Welcome Newcomer",
    [CommunityAction.TEAM_COORDINATION]: "Team Coordination",
    [CommunityAction.APPRECIATION]: "Appreciation",
    [CommunityAction.CELEBRATION]: "Celebration",
    [CommunityAction.KNOWLEDGE_SHARING]: "Knowledge Sharing",
    [CommunityAction.TROLLING]: "Trolling",
    [CommunityAction.GRIEFING]: "Griefing",
    [CommunityAction.SPAMMING]: "Spamming",
    [CommunityAction.EXCLUSION]: "Exclusion",
    [CommunityAction.BRAGGING]: "Bragging",
    [CommunityAction.ARGUMENT_STARTING]: "Argument Starting",
    [CommunityAction.BULLYING]: "Bullying",
    [CommunityAction.SHOW_OFF]: "Show Off",
    [CommunityAction.PUT_DOWN]: "Put Down"
  }
  
  return labels[action] || action
}

export const isPositiveAction = (action: CommunityAction): boolean => {
  const positiveActions = [
    CommunityAction.ENCOURAGEMENT,
    CommunityAction.HELPFUL_ADVICE,
    CommunityAction.WELCOME_NEWCOMER,
    CommunityAction.TEAM_COORDINATION,
    CommunityAction.APPRECIATION,
    CommunityAction.CELEBRATION,
    CommunityAction.KNOWLEDGE_SHARING
  ]
  
  return positiveActions.includes(action)
}

// ===== MODERATION HISTORY DATA =====

// Mock historical data for initial display - using realistic Roblox usernames and gaming content
export const mockModerationHistory: ModerationHistory[] = [
  {
    id: "hist_001",
    timestamp: "2024-06-16T02:45:00Z",
    action: ActionType.DELETE_MESSAGE,
    moderator: "System",
    moderatorRole: UserRole.MODERATOR,
    playerId: 234567,
    playerName: "4aimstar",
    experienceId: 1,
    experienceName: "Bloom",
    messageIds: ["msg_005"],
    messageContent: "add me on discord, my phone is 555-123-4567",
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
    playerId: 456789,
    playerName: "toxicgamer21",
    experienceId: 3,
    experienceName: "Adventure Academy",
    messageIds: ["msg_011"],
    messageContent: "this game is trash and u all suck at pvp",
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
    playerId: 123456,
    playerName: "remiel430",
    experienceId: 2,
    experienceName: "Creative Studios",
    messageIds: ["msg_008"],
    messageContent: "@buildit_999 connect the redstone to the piston first! i can show u",
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
    playerId: 345678,
    playerName: "Nooburai",
    experienceId: 1,
    experienceName: "Bloom",
    messageIds: ["msg_002"],
    messageContent: "bruh how do i get better aim in this game?? keep getting rekt lol",
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
    playerId: 567890,
    playerName: "pixelmaster24",
    experienceId: 2,
    experienceName: "Creative Studios",
    messageIds: ["msg_006"],
    messageContent: "yooo check out my sick spaceship build! used all the new cosmic blocks",
    affectedMessagesCount: 1,
    reason: "Message approved for display",
    status: 'active',
    isAutomated: false
  }
]