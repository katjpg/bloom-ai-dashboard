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

// Mock leaderboard data for different time periods (Roblox-style usernames)
export const mockLeaderboardData: Record<TimePeriod, LeaderboardPlayer[]> = {
  today: [
    { id: 1, username: "FriendlyBuilder2011", score: 48, positiveActions: 12, trend: "up", recentChange: 6, rank: 1, experienceId: 1, experienceName: "Bloom" },
    { id: 2, username: "MasterBuilder999", score: 42, positiveActions: 11, trend: "up", recentChange: 4, rank: 2, experienceId: 2, experienceName: "Creative Studios" },
    { id: 3, username: "LearningExplorer", score: 38, positiveActions: 9, trend: "up", recentChange: 3, rank: 3, experienceId: 1, experienceName: "Bloom" },
    { id: 4, username: "KindHelper2013", score: 34, positiveActions: 8, trend: "up", recentChange: 5, rank: 4, experienceId: 1, experienceName: "Bloom" },
    { id: 5, username: "YoungArtist123", score: 30, positiveActions: 7, trend: "stable", recentChange: 0, rank: 5, experienceId: 1, experienceName: "Bloom" },
    { id: 6, username: "CreativeKid2013", score: 28, positiveActions: 6, trend: "up", recentChange: 2, rank: 6, experienceId: 2, experienceName: "Creative Studios" },
    { id: 7, username: "QuestMaster2014", score: 24, positiveActions: 5, trend: "down", recentChange: -1, rank: 7, experienceId: 3, experienceName: "Adventure Academy" },
    { id: 8, username: "MathWizardKid", score: 22, positiveActions: 4, trend: "up", recentChange: 1, rank: 8, experienceId: 1, experienceName: "Bloom" },
  ],
  week: [
    { id: 1, username: "FriendlyBuilder2011", score: 286, positiveActions: 72, trend: "up", recentChange: 28, rank: 1, experienceId: 1, experienceName: "Bloom" },
    { id: 2, username: "MasterBuilder999", score: 248, positiveActions: 63, trend: "up", recentChange: 22, rank: 2, experienceId: 2, experienceName: "Creative Studios" },
    { id: 3, username: "LearningExplorer", score: 212, positiveActions: 54, trend: "up", recentChange: 18, rank: 3, experienceId: 1, experienceName: "Bloom" },
    { id: 4, username: "KindHelper2013", score: 194, positiveActions: 48, trend: "up", recentChange: 15, rank: 4, experienceId: 1, experienceName: "Bloom" },
    { id: 5, username: "CreativeKid2013", score: 176, positiveActions: 42, trend: "up", recentChange: 12, rank: 5, experienceId: 2, experienceName: "Creative Studios" },
    { id: 6, username: "YoungArtist123", score: 158, positiveActions: 38, trend: "stable", recentChange: 2, rank: 6, experienceId: 1, experienceName: "Bloom" },
    { id: 7, username: "QuestMaster2014", score: 142, positiveActions: 34, trend: "down", recentChange: -6, rank: 7, experienceId: 3, experienceName: "Adventure Academy" },
    { id: 8, username: "MathWizardKid", score: 128, positiveActions: 30, trend: "up", recentChange: 8, rank: 8, experienceId: 1, experienceName: "Bloom" },
  ],
  month: [
    { id: 1, username: "FriendlyBuilder2011", score: 1124, positiveActions: 287, trend: "up", recentChange: 98, rank: 1, experienceId: 1, experienceName: "Bloom" },
    { id: 2, username: "MasterBuilder999", score: 976, positiveActions: 243, trend: "up", recentChange: 76, rank: 2, experienceId: 2, experienceName: "Creative Studios" },
    { id: 3, username: "LearningExplorer", score: 834, positiveActions: 208, trend: "up", recentChange: 67, rank: 3, experienceId: 1, experienceName: "Bloom" },
    { id: 4, username: "KindHelper2013", score: 748, positiveActions: 186, trend: "up", recentChange: 54, rank: 4, experienceId: 1, experienceName: "Bloom" },
    { id: 5, username: "CreativeKid2013", score: 692, positiveActions: 172, trend: "up", recentChange: 43, rank: 5, experienceId: 2, experienceName: "Creative Studios" },
    { id: 6, username: "YoungArtist123", score: 634, positiveActions: 158, trend: "stable", recentChange: 8, rank: 6, experienceId: 1, experienceName: "Bloom" },
    { id: 7, username: "QuestMaster2014", score: 586, positiveActions: 145, trend: "down", recentChange: -18, rank: 7, experienceId: 3, experienceName: "Adventure Academy" },
    { id: 8, username: "MathWizardKid", score: 524, positiveActions: 132, trend: "up", recentChange: 32, rank: 8, experienceId: 1, experienceName: "Bloom" },
  ],
  alltime: [
    { id: 1, username: "FriendlyBuilder2011", score: 3248, positiveActions: 824, trend: "up", recentChange: 156, rank: 1, experienceId: 1, experienceName: "Bloom" },
    { id: 2, username: "MasterBuilder999", score: 2896, positiveActions: 734, trend: "up", recentChange: 134, rank: 2, experienceId: 2, experienceName: "Creative Studios" },
    { id: 3, username: "LearningExplorer", score: 2564, positiveActions: 642, trend: "up", recentChange: 98, rank: 3, experienceId: 1, experienceName: "Bloom" },
    { id: 4, username: "KindHelper2013", score: 2234, positiveActions: 558, trend: "up", recentChange: 87, rank: 4, experienceId: 1, experienceName: "Bloom" },
    { id: 5, username: "CreativeKid2013", score: 1986, positiveActions: 496, trend: "up", recentChange: 76, rank: 5, experienceId: 2, experienceName: "Creative Studios" },
    { id: 6, username: "YoungArtist123", score: 1782, positiveActions: 445, trend: "stable", recentChange: 12, rank: 6, experienceId: 1, experienceName: "Bloom" },
    { id: 7, username: "QuestMaster2014", score: 1634, positiveActions: 408, trend: "up", recentChange: 45, rank: 7, experienceId: 3, experienceName: "Adventure Academy" },
    { id: 8, username: "MathWizardKid", score: 1456, positiveActions: 364, trend: "up", recentChange: 67, rank: 8, experienceId: 1, experienceName: "Bloom" },
  ]
}

export const mockLeaderboardStats = {
  today: {
    activeContributors: 24,
    positiveActions: 67,
    positivityRate: 95.8
  },
  week: {
    activeContributors: 52,
    positiveActions: 381,
    positivityRate: 94.2
  },
  month: {
    activeContributors: 89,
    positiveActions: 1681,
    positivityRate: 92.6
  },
  alltime: {
    activeContributors: 187,
    positiveActions: 4680,
    positivityRate: 91.2
  }
}