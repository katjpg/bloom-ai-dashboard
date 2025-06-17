export interface LeaderboardPlayer {
  id: number
  username: string
  avatar_url?: string
  score: number
  positiveActions: number
  trend: "up" | "down" | "stable"
  recentChange: number
  rank: number
}

export type TimePeriod = "today" | "week" | "month" | "alltime"

// Mock leaderboard data for different time periods (Roblox-style usernames)
export const mockLeaderboardData: Record<TimePeriod, LeaderboardPlayer[]> = {
  today: [
    { id: 1, username: "CoolBuilderPro23", score: 234, positiveActions: 47, trend: "up", recentChange: 15, rank: 1 },
    { id: 2, username: "MegaCreator999", score: 198, positiveActions: 42, trend: "up", recentChange: 8, rank: 2 },
    { id: 3, username: "SuperGamer_XD", score: 167, positiveActions: 38, trend: "down", recentChange: -3, rank: 3 },
    { id: 4, username: "EpicPlayer2024", score: 145, positiveActions: 31, trend: "up", recentChange: 12, rank: 4 },
    { id: 5, username: "RobloxMaster456", score: 132, positiveActions: 28, trend: "up", recentChange: 6, rank: 5 },
    { id: 6, username: "GameDevHero", score: 118, positiveActions: 25, trend: "stable", recentChange: 0, rank: 6 },
    { id: 7, username: "BuilderKing2023", score: 105, positiveActions: 22, trend: "up", recentChange: 4, rank: 7 },
    { id: 8, username: "AwesomePlayer88", score: 92, positiveActions: 19, trend: "down", recentChange: -2, rank: 8 },
  ],
  week: [
    { id: 1, username: "MegaCreator999", score: 1243, positiveActions: 287, trend: "up", recentChange: 45, rank: 1 },
    { id: 2, username: "CoolBuilderPro23", score: 1156, positiveActions: 251, trend: "up", recentChange: 38, rank: 2 },
    { id: 3, username: "EpicPlayer2024", score: 987, positiveActions: 198, trend: "up", recentChange: 67, rank: 3 },
    { id: 4, username: "SuperGamer_XD", score: 876, positiveActions: 167, trend: "down", recentChange: -12, rank: 4 },
    { id: 5, username: "BuilderKing2023", score: 743, positiveActions: 145, trend: "up", recentChange: 29, rank: 5 },
    { id: 6, username: "RobloxMaster456", score: 689, positiveActions: 132, trend: "up", recentChange: 23, rank: 6 },
    { id: 7, username: "GameDevHero", score: 634, positiveActions: 118, trend: "stable", recentChange: 2, rank: 7 },
    { id: 8, username: "AwesomePlayer88", score: 567, positiveActions: 105, trend: "down", recentChange: -8, rank: 8 },
  ],
  month: [
    { id: 1, username: "CoolBuilderPro23", score: 4567, positiveActions: 1234, trend: "up", recentChange: 156, rank: 1 },
    { id: 2, username: "MegaCreator999", score: 4123, positiveActions: 1087, trend: "up", recentChange: 143, rank: 2 },
    { id: 3, username: "EpicPlayer2024", score: 3456, positiveActions: 876, trend: "up", recentChange: 234, rank: 3 },
    { id: 4, username: "BuilderKing2023", score: 2987, positiveActions: 743, trend: "up", recentChange: 187, rank: 4 },
    { id: 5, username: "SuperGamer_XD", score: 2765, positiveActions: 689, trend: "down", recentChange: -45, rank: 5 },
    { id: 6, username: "RobloxMaster456", score: 2543, positiveActions: 634, trend: "up", recentChange: 98, rank: 6 },
    { id: 7, username: "GameDevHero", score: 2234, positiveActions: 567, trend: "stable", recentChange: 12, rank: 7 },
    { id: 8, username: "AwesomePlayer88", score: 1987, positiveActions: 498, trend: "down", recentChange: -23, rank: 8 },
  ],
  alltime: [
    { id: 1, username: "CoolBuilderPro23", score: 15673, positiveActions: 4234, trend: "up", recentChange: 234, rank: 1 },
    { id: 2, username: "MegaCreator999", score: 14298, positiveActions: 3876, trend: "up", recentChange: 189, rank: 2 },
    { id: 3, username: "SuperGamer_XD", score: 12456, positiveActions: 3234, trend: "up", recentChange: 167, rank: 3 },
    { id: 4, username: "EpicPlayer2024", score: 11234, positiveActions: 2987, trend: "up", recentChange: 298, rank: 4 },
    { id: 5, username: "BuilderKing2023", score: 9876, positiveActions: 2543, trend: "up", recentChange: 234, rank: 5 },
    { id: 6, username: "RobloxMaster456", score: 8765, positiveActions: 2234, trend: "up", recentChange: 145, rank: 6 },
    { id: 7, username: "GameDevHero", score: 7654, positiveActions: 1987, trend: "stable", recentChange: 23, rank: 7 },
    { id: 8, username: "AwesomePlayer88", score: 6543, positiveActions: 1743, trend: "up", recentChange: 67, rank: 8 },
  ]
}

export const mockLeaderboardStats = {
  today: {
    activeContributors: 89,
    positiveActions: 324,
    positivityRate: 94.2
  },
  week: {
    activeContributors: 247,
    positiveActions: 1847,
    positivityRate: 91.8
  },
  month: {
    activeContributors: 456,
    positiveActions: 7234,
    positivityRate: 89.3
  },
  alltime: {
    activeContributors: 1234,
    positiveActions: 24567,
    positivityRate: 87.6
  }
}