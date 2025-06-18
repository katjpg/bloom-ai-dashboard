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
    count: 215,
    percentage: 42.8,
    trend: "up",
    change: 12.4
  },
  {
    action: CommunityAction.HELPING,
    count: 158,
    percentage: 31.5,
    trend: "up",
    change: 8.7
  },
  {
    action: CommunityAction.TEAM_BUILDING,
    count: 129,
    percentage: 25.7,
    trend: "up",
    change: 22.1
  }
]

// Negative community actions data (scaled down)
export const mockNegativeCommunityActions: CommunityActionData[] = [
  {
    action: CommunityAction.SPAM,
    count: 42,
    percentage: 35.6,
    trend: "down",
    change: -15.2
  },
  {
    action: CommunityAction.TOXICITY,
    count: 28,
    percentage: 23.7,
    trend: "up",
    change: 8.4
  },
  {
    action: CommunityAction.GRIEFING,
    count: 16,
    percentage: 13.6,
    trend: "down",
    change: -6.7
  },
  {
    action: CommunityAction.EXCLUSION,
    count: 12,
    percentage: 10.2,
    trend: "down",
    change: -22.1
  },
  {
    action: CommunityAction.INAPPROPRIATE,
    count: 8,
    percentage: 6.8,
    trend: "down",
    change: -12.8
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