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
    title: "PII Sharing Detected",
    description: "Young player attempting to share phone number",
    reason: "Contains personal phone number information",
    reportedBy: "AutoMod AI",
    timestamp: "2024-01-21T14:30:00Z",
    experienceId: 1,
    experienceName: "Bloom",
    status: "pending",
    playerName: "SafeKid2012",
    playerId: "player_123",
    messageContent: "My phone number is 555-123-4567 if anyone wants to be friends",
    messageId: "msg_005",
    violationTypes: [ContentType.S3],
    reportCount: 0
  },
  {
    id: "queue_002", 
    type: "user",
    priority: PriorityLevel.MODERATE,
    title: "Negative Attitude Report",
    description: "Player expressing negative attitude toward learning activities",
    reason: "Consistently negative comments about educational content, discouraging others",
    reportedBy: "Community Reports",
    timestamp: "2024-01-21T14:25:00Z",
    experienceId: 3,
    experienceName: "Adventure Academy",
    status: "pending",
    playerName: "TroubleMaker2010",
    playerId: "player_456",
    reportCount: 2,
    violationTypes: [ContentType.HR]
  },
  {
    id: "queue_003",
    type: "message",
    priority: PriorityLevel.MODERATE,
    title: "Inappropriate Help Request",
    description: "Player asking for help in building inappropriate structures",
    reason: "Requesting guidance on creating content that may not be suitable for educational environment",
    reportedBy: "Moderator Review",
    timestamp: "2024-01-21T14:20:00Z",
    experienceId: 2,
    experienceName: "Creative Studios",
    status: "in_review",
    playerName: "CreativeKid2013",
    playerId: "player_789",
    messageContent: "Can someone help me build a scary monster house?",
    messageId: "msg_007",
    violationTypes: [ContentType.HR],
    reportCount: 0
  },
  {
    id: "queue_004",
    type: "experience",
    priority: PriorityLevel.MODERATE,
    title: "Technical Issue Report",
    description: "Experience reported for technical difficulties",
    reason: "Multiple reports of game features not working properly, affecting user experience",
    reportedBy: "Community Reports",
    timestamp: "2024-01-21T14:15:00Z",
    experienceId: 3,
    experienceName: "Adventure Academy",
    status: "pending",
    reportCount: 3,
    violationTypes: []
  },
  {
    id: "queue_005",
    type: "message",
    priority: PriorityLevel.MODERATE,
    title: "Encouraging Resolution",
    description: "Positive community interaction successfully resolved",
    reason: "Player initially frustrated but received help from community, resolved positively",
    reportedBy: "System Review",
    timestamp: "2024-01-21T14:10:00Z",
    experienceId: 1,
    experienceName: "Bloom",
    status: "resolved",
    playerName: "LearningExplorer",
    playerId: "player_101",
    messageContent: "Thanks everyone for helping me with the science experiment!",
    messageId: "msg_002",
    violationTypes: [],
    reportCount: 0
  },
  {
    id: "queue_006",
    type: "message",
    priority: PriorityLevel.MODERATE,
    title: "Building Guidance Needed",
    description: "Player needs guidance on appropriate building practices",
    reason: "New player needs education on community building guidelines",
    reportedBy: "Moderator Review",
    timestamp: "2024-01-21T14:05:00Z",
    experienceId: 2,
    experienceName: "Creative Studios",
    status: "resolved",
    playerName: "HelpfulFriend",
    playerId: "player_102",
    messageContent: "I can show you how to build that properly!",
    messageId: "msg_008",
    violationTypes: [],
    reportCount: 0
  }
]