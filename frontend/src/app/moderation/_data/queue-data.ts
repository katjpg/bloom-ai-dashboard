import { PriorityLevel, ContentType } from "@/lib/colors-mod"

export interface QueueItem {
  id: string
  type: "message" | "user" | "experience"
  priority: PriorityLevel
  title: string
  description: string
  reason: string
  reportedBy: string
  timestamp: string
  experienceId: number
  experienceName: string
  status: "pending" | "in_review" | "resolved"
  playerName?: string
  playerId?: string
  messageContent?: string
  messageId?: string
  violationTypes?: ContentType[]
  reportCount?: number
}

export const mockQueueItems: QueueItem[] = [
  {
    id: "queue_001",
    type: "message",
    priority: PriorityLevel.CRITICAL,
    title: "Violent Threat Detected",
    description: "User threatening physical harm to another player",
    reason: "Contains explicit threats of violence and harm to other players",
    reportedBy: "AutoMod AI",
    timestamp: "2024-01-21T14:30:00Z",
    experienceId: 1,
    experienceName: "Roblox Simulator",
    status: "pending",
    playerName: "xXDarkLord99Xx",
    playerId: "player_123",
    messageContent: "I'm going to [REDACTED] you if you don't give me your items",
    messageId: "msg_001",
    violationTypes: [ContentType.V, ContentType.H],
    reportCount: 0
  },
  {
    id: "queue_002", 
    type: "user",
    priority: PriorityLevel.HIGH,
    title: "Harassment Report",
    description: "Multiple users reporting harassment from player 'ToxicGamer99'",
    reason: "Repeated harassment, following players across servers, toxic behavior",
    reportedBy: "Community Reports",
    timestamp: "2024-01-21T14:25:00Z",
    experienceId: 2,
    experienceName: "Adventure Quest",
    status: "pending",
    playerName: "ToxicGamer99",
    playerId: "player_456",
    reportCount: 5,
    violationTypes: [ContentType.HR, ContentType.H]
  },
  {
    id: "queue_003",
    type: "message",
    priority: PriorityLevel.MODERATE,
    title: "Spam Detection",
    description: "Repeated identical messages in chat",
    reason: "Spamming the same message 15 times within 2 minutes",
    reportedBy: "AutoMod AI",
    timestamp: "2024-01-21T14:20:00Z",
    experienceId: 3,
    experienceName: "Tower Defense Pro",
    status: "in_review",
    playerName: "SpamBot2000",
    playerId: "player_789",
    messageContent: "JOIN MY GAME FOR FREE ROBUX!!!",
    messageId: "msg_003",
    violationTypes: [ContentType.H],
    reportCount: 0
  },
  {
    id: "queue_004",
    type: "experience",
    priority: PriorityLevel.HIGH,
    title: "Inappropriate Content",
    description: "Experience reported for adult content",
    reason: "Experience contains inappropriate imagery and suggestive content not suitable for platform",
    reportedBy: "Community Reports",
    timestamp: "2024-01-21T14:15:00Z",
    experienceId: 4,
    experienceName: "Suspicious Game",
    status: "pending",
    reportCount: 12,
    violationTypes: [ContentType.S3, ContentType.HR]
  },
  {
    id: "queue_005",
    type: "message",
    priority: PriorityLevel.MODERATE,
    title: "Mild Language",
    description: "Borderline inappropriate language detected",
    reason: "Use of mild profanity and inappropriate language",
    reportedBy: "AutoMod AI",
    timestamp: "2024-01-21T14:10:00Z",
    experienceId: 1,
    experienceName: "Roblox Simulator",
    status: "resolved",
    playerName: "EdgeyTeen42",
    playerId: "player_101",
    messageContent: "This game is so [FILTERED] boring",
    messageId: "msg_005",
    violationTypes: [ContentType.H],
    reportCount: 0
  },
  {
    id: "queue_006",
    type: "message",
    priority: PriorityLevel.HIGH,
    title: "Personal Information",
    description: "User sharing personal contact information",
    reason: "Attempting to share phone number and social media handles",
    reportedBy: "AutoMod AI",
    timestamp: "2024-01-21T14:05:00Z",
    experienceId: 2,
    experienceName: "Adventure Quest",
    status: "pending",
    playerName: "FriendlyKid123",
    playerId: "player_102",
    messageContent: "Add me on [REDACTED] my username is [REDACTED]",
    messageId: "msg_006",
    violationTypes: [],
    reportCount: 0
  }
]