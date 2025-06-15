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
  totalMessages: 12847,
  activeUsers: 1205,
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
  { hour: "00", approved: 186, flagged: 12, violations: 3 },
  { hour: "01", approved: 165, flagged: 8, violations: 2 },
  { hour: "02", approved: 142, flagged: 6, violations: 1 },
  { hour: "03", approved: 158, flagged: 9, violations: 2 },
  { hour: "04", approved: 201, flagged: 15, violations: 4 },
  { hour: "05", approved: 234, flagged: 18, violations: 5 },
  { hour: "06", approved: 287, flagged: 22, violations: 6 },
  { hour: "07", approved: 312, flagged: 25, violations: 7 },
  { hour: "08", approved: 398, flagged: 31, violations: 8 },
  { hour: "09", approved: 445, flagged: 35, violations: 9 },
  { hour: "10", approved: 482, flagged: 38, violations: 10 },
  { hour: "11", approved: 521, flagged: 41, violations: 11 },
  { hour: "12", approved: 567, flagged: 45, violations: 12 },
  { hour: "13", approved: 598, flagged: 47, violations: 13 },
  { hour: "14", approved: 634, flagged: 50, violations: 14 },
  { hour: "15", approved: 678, flagged: 53, violations: 15 },
  { hour: "16", approved: 712, flagged: 56, violations: 16 },
  { hour: "17", approved: 743, flagged: 58, violations: 17 },
  { hour: "18", approved: 698, flagged: 55, violations: 15 },
  { hour: "19", approved: 654, flagged: 51, violations: 14 },
  { hour: "20", approved: 587, flagged: 46, violations: 12 },
  { hour: "21", approved: 523, flagged: 41, violations: 11 },
  { hour: "22", approved: 456, flagged: 36, violations: 9 },
  { hour: "23", approved: 312, flagged: 24, violations: 6 }
]

export const mockExperiences: RobloxExperience[] = [
  {
    id: 1,
    title: "Adventure Quest",
    description: "Epic fantasy adventure with quests, dungeons, and magical creatures. Join thousands of players in this immersive RPG experience.",
    isActive: true,
    safetyScore: 94.8,
    lastUpdated: "2 hours ago",
    playerCount: 12847,
    thumbnail: "/api/placeholder/400/225"
  },
  {
    id: 2,
    title: "City Builder Pro",
    description: "Build and manage your dream city with advanced construction tools and economic simulation features.",
    isActive: false,
    safetyScore: 91.2,
    lastUpdated: "1 day ago",
    playerCount: 8934,
    thumbnail: "/api/placeholder/400/225"
  },
  {
    id: 3,
    title: "Racing Championship",
    description: "High-speed racing with customizable cars, multiple tracks, and competitive tournaments.",
    isActive: true,
    safetyScore: 96.1,
    lastUpdated: "30 minutes ago",
    playerCount: 15623,
    thumbnail: "/api/placeholder/400/225"
  },
  {
    id: 4,
    title: "Space Explorer",
    description: "Explore the cosmos, discover new planets, and build your own space station in this sci-fi adventure.",
    isActive: true,
    safetyScore: 93.7,
    lastUpdated: "1 hour ago",
    playerCount: 7892,
    thumbnail: "/api/placeholder/400/225"
  },
  {
    id: 5,
    title: "Pet Paradise",
    description: "Adopt, care for, and train virtual pets in a colorful world full of fun activities and mini-games.",
    isActive: false,
    safetyScore: 98.3,
    lastUpdated: "3 days ago",
    playerCount: 5641,
    thumbnail: "/api/placeholder/400/225"
  },
  {
    id: 6,
    title: "Survival Island",
    description: "Test your survival skills on a mysterious island with crafting, building, and exploration elements.",
    isActive: true,
    safetyScore: 89.6,
    lastUpdated: "45 minutes ago",
    playerCount: 11256,
    thumbnail: "/api/placeholder/400/225"
  }
]
