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
    description: "Player attempting to share phone number",
    reason: "Contains personal phone number information",
    reportedBy: "AutoMod AI",
    timestamp: "2024-01-21T14:30:00Z",
    experienceId: 1,
    experienceName: "Bloom",
    status: "pending",
    playerName: "4aimstar",
    playerId: "234567",
    messageContent: "add me on discord, my phone is 555-123-4567",
    messageId: "msg_005",
    violationTypes: [ContentType.S3],
    reportCount: 0
  },
  {
    id: "queue_002", 
    type: "user",
    priority: PriorityLevel.MODERATE,
    title: "Toxic Behavior Report",
    description: "Player showing toxic attitude toward other gamers",
    reason: "Consistently negative comments, trash talking teammates and discouraging others",
    reportedBy: "Community Reports",
    timestamp: "2024-01-21T14:25:00Z",
    experienceId: 3,
    experienceName: "Adventure Academy",
    status: "pending",
    playerName: "toxicgamer21",
    playerId: "player_456",
    reportCount: 2,
    violationTypes: [ContentType.HR]
  },
  {
    id: "queue_003",
    type: "message",
    priority: PriorityLevel.MODERATE,
    title: "Inappropriate Build Request",
    description: "Player asking for help with inappropriate content",
    reason: "Requesting guidance on creating content that violates community guidelines",
    reportedBy: "Moderator Review",
    timestamp: "2024-01-21T14:20:00Z",
    experienceId: 2,
    experienceName: "Creative Studios",
    status: "in_review",
    playerName: "buildit_999",
    playerId: "player_789",
    messageContent: "yo can someone help me build a trap base to grief noobs?",
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
    reason: "Multiple reports of lag and connection issues affecting gameplay",
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
    title: "Positive Resolution",
    description: "Helpful community interaction successfully resolved",
    reason: "Player received help from community, issue resolved positively",
    reportedBy: "System Review",
    timestamp: "2024-01-21T14:10:00Z",
    experienceId: 1,
    experienceName: "Bloom",
    status: "resolved",
    playerName: "Nooburai",
    playerId: "345678",
    messageContent: "thx everyone for helping me get better at pvp!",
    messageId: "msg_002",
    violationTypes: [],
    reportCount: 0
  },
  {
    id: "queue_006",
    type: "message",
    priority: PriorityLevel.MODERATE,
    title: "Helpful Community Interaction",
    description: "Player offering positive guidance to others",
    reason: "Example of good community mentorship and helping new players",
    reportedBy: "Moderator Review",
    timestamp: "2024-01-21T14:05:00Z",
    experienceId: 2,
    experienceName: "Creative Studios",
    status: "resolved",
    playerName: "remiel430",
    playerId: "123456",
    messageContent: "i can show u how to build that epic castle design!",
    messageId: "msg_008",
    violationTypes: [],
    reportCount: 0
  }
]