// Analytics-specific data exports
// Re-exports from centralized mock data with analytics-specific additions

import { CommunityAction, type TrendDirection } from "@/data/mock-data"

export {
  // Shared types
  type TrendDirection,
  type TrendData,
  CommunityAction,
  
  // Experience data
  type RobloxExperience,
  mockExperiences,
  
  // Analytics-specific types and data
  type AnalyticsMetrics,
  type AnalyticsTrends,
  type SentimentDistribution,
  type SentimentScale,
  type CommunityActionMetrics,
  type CommunityActionTrends,
  type HourlyActionData,
  type DailyActionData,
  type WeeklyActionData,
  type HourlySentimentData,
  type DailySentimentData,
  type WeeklySentimentData,
  
  mockAnalyticsMetrics,
  mockAnalyticsTrends,
  mockSentimentDistribution,
  mockSentimentScale,
  mockCommunityActionMetrics,
  mockCommunityActionTrends,
  mockHourlyActionData,
  mockDailyActionData,
  mockWeeklyActionData,
  mockHourlySentimentData,
  mockDailySentimentData,
  mockWeeklySentimentData
} from "@/data/mock-data"

// Analytics-specific interfaces and data that extend the base
export interface CommunityActionData {
  action: CommunityAction
  count: number
  percentage: number
  trend: TrendDirection
  change: number
}


// Time period types
export type TimePeriod = "1d" | "7d" | "1m"

// Positive community actions data (scaled down)
export const mockPositiveCommunityActions: CommunityActionData[] = [
  {
    action: CommunityAction.ENCOURAGEMENT,
    count: 185,
    percentage: 31.0,
    trend: "up",
    change: 12.4
  },
  {
    action: CommunityAction.HELPFUL_ADVICE,
    count: 128,
    percentage: 21.4,
    trend: "up",
    change: 8.7
  },
  {
    action: CommunityAction.TEAM_COORDINATION,
    count: 107,
    percentage: 17.9,
    trend: "up",
    change: 15.2
  },
  {
    action: CommunityAction.WELCOME_NEWCOMER,
    count: 89,
    percentage: 14.9,
    trend: "up",
    change: 22.1
  },
  {
    action: CommunityAction.APPRECIATION,
    count: 56,
    percentage: 9.4,
    trend: "up",
    change: 6.3
  },
  {
    action: CommunityAction.KNOWLEDGE_SHARING,
    count: 22,
    percentage: 3.7,
    trend: "down",
    change: -2.1
  },
  {
    action: CommunityAction.CELEBRATION,
    count: 10,
    percentage: 1.7,
    trend: "up",
    change: 18.5
  }
]

// Negative community actions data (scaled down)
export const mockNegativeCommunityActions: CommunityActionData[] = [
  {
    action: CommunityAction.SPAMMING,
    count: 42,
    percentage: 35.6,
    trend: "down",
    change: -15.2
  },
  {
    action: CommunityAction.ARGUMENT_STARTING,
    count: 28,
    percentage: 23.7,
    trend: "up",
    change: 8.4
  },
  {
    action: CommunityAction.BRAGGING,
    count: 16,
    percentage: 13.6,
    trend: "down",
    change: -6.7
  },
  {
    action: CommunityAction.TROLLING,
    count: 12,
    percentage: 10.2,
    trend: "down",
    change: -22.1
  },
  {
    action: CommunityAction.EXCLUSION,
    count: 8,
    percentage: 6.8,
    trend: "down",
    change: -12.8
  },
  {
    action: CommunityAction.SHOW_OFF,
    count: 6,
    percentage: 5.1,
    trend: "up",
    change: 4.3
  },
  {
    action: CommunityAction.PUT_DOWN,
    count: 3,
    percentage: 2.5,
    trend: "down",
    change: -18.9
  },
  {
    action: CommunityAction.GRIEFING,
    count: 2,
    percentage: 1.7,
    trend: "down",
    change: -33.3
  },
  {
    action: CommunityAction.BULLYING,
    count: 1,
    percentage: 0.8,
    trend: "down",
    change: -46.2
  }
]

// Combined community actions for backward compatibility
export const mockCommunityActions = mockPositiveCommunityActions


// Re-export utility functions from central file
export {
  getSentimentColor,
  getSentimentLabel,
  getActionTypeColor,
  getActionLabel,
  isPositiveAction
} from "@/data/mock-data"