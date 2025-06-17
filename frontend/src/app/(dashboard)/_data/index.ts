// Type definitions
export type TrendDirection = "up" | "down"

export interface TrendData {
  trend: TrendDirection
  change: number
}

export interface MockTrends {
  totalMessages: TrendData
  activeUsers: TrendData
  safetyScore: TrendData
  avgResponseTime: TrendData
}

export interface MockMetrics {
  totalMessages: number
  activeUsers: number
  safetyScore: number
  avgResponseTime: number
}

export interface MessageVolumeData {
  hour: string
  approved: number
  flagged: number
  violations: number
}

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

// Mock data
export const mockMetrics: MockMetrics = {
  totalMessages: 2847,
  activeUsers: 187,
  safetyScore: 94.2,
  avgResponseTime: 125
}

export const mockTrends: MockTrends = {
  totalMessages: { trend: "up", change: 12.5 },
  activeUsers: { trend: "down", change: -2.1 },
  safetyScore: { trend: "up", change: 1.8 },
  avgResponseTime: { trend: "down", change: -8.3 }
}

export const mockMessageVolumeData: MessageVolumeData[] = [
  { hour: "00", approved: 28, flagged: 2, violations: 1 },
  { hour: "01", approved: 24, flagged: 1, violations: 0 },
  { hour: "02", approved: 19, flagged: 1, violations: 0 },
  { hour: "03", approved: 22, flagged: 1, violations: 0 },
  { hour: "04", approved: 31, flagged: 2, violations: 1 },
  { hour: "05", approved: 38, flagged: 3, violations: 1 },
  { hour: "06", approved: 45, flagged: 3, violations: 1 },
  { hour: "07", approved: 52, flagged: 4, violations: 1 },
  { hour: "08", approved: 67, flagged: 5, violations: 2 },
  { hour: "09", approved: 74, flagged: 6, violations: 2 },
  { hour: "10", approved: 83, flagged: 6, violations: 2 },
  { hour: "11", approved: 89, flagged: 7, violations: 2 },
  { hour: "12", approved: 95, flagged: 7, violations: 3 },
  { hour: "13", approved: 102, flagged: 8, violations: 3 },
  { hour: "14", approved: 108, flagged: 8, violations: 3 },
  { hour: "15", approved: 115, flagged: 9, violations: 3 },
  { hour: "16", approved: 121, flagged: 9, violations: 4 },
  { hour: "17", approved: 127, flagged: 10, violations: 4 },
  { hour: "18", approved: 118, flagged: 9, violations: 3 },
  { hour: "19", approved: 111, flagged: 8, violations: 3 },
  { hour: "20", approved: 98, flagged: 7, violations: 2 },
  { hour: "21", approved: 87, flagged: 6, violations: 2 },
  { hour: "22", approved: 76, flagged: 5, violations: 2 },
  { hour: "23", approved: 52, flagged: 4, violations: 1 }
]

export const mockExperiences: RobloxExperience[] = [
  {
    id: 1,
    title: "Bloom",
    description: "A safe community space for young gamers to learn, create, and make friends. Features educational mini-games and positive social interactions.",
    isActive: true,
    safetyScore: 96.8,
    lastUpdated: "15 minutes ago",
    playerCount: 89,
    thumbnail: "/api/placeholder/400/225"
  },
  {
    id: 2,
    title: "Creative Studios",
    description: "Build amazing creations with friends! Collaborative building tools and creative challenges await.",
    isActive: true,
    safetyScore: 94.2,
    lastUpdated: "32 minutes ago",
    playerCount: 67,
    thumbnail: "/api/placeholder/400/225"
  },
  {
    id: 3,
    title: "Adventure Academy",
    description: "Embark on educational quests and solve puzzles together. Learning meets adventure in this engaging experience.",
    isActive: false,
    safetyScore: 92.1,
    lastUpdated: "2 hours ago",
    playerCount: 31,
    thumbnail: "/api/placeholder/400/225"
  }
]
