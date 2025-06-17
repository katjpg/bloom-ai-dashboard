// Import shared types and data
import { TrendDirection, TrendData, mockExperiences } from "../../(dashboard)/_data"
import { CommunityAction } from "../../moderation/_data"

// Re-export for consistency
export { mockExperiences }
export type { TrendDirection, TrendData }

// Analytics-specific interfaces
export interface AnalyticsMetrics {
  totalMessages: number
  pointsAwarded: number
  positiveActions: number
  averageSentiment: number // Scale from -100 to 100
}

export interface AnalyticsTrends {
  totalMessages: TrendData
  pointsAwarded: TrendData
  positiveActions: TrendData
  averageSentiment: TrendData
}

export interface SentimentDistribution {
  positive: number // Percentage (0-100)
  neutral: number // Percentage (0-100)
  negative: number // Percentage (0-100)
}

export interface SentimentScale {
  currentScore: number // Current average sentiment (-100 to 100)
  previousScore: number // Previous period score for comparison
}

export interface CommunityActionData {
  action: CommunityAction
  count: number
  percentage: number
  trend: TrendDirection
  change: number
}

// Mock analytics data
export const mockAnalyticsMetrics: AnalyticsMetrics = {
  totalMessages: 15847,
  pointsAwarded: 31694, // Roughly 2x totalMessages (positive sentiment average)
  positiveActions: 8923, // About 56% of total messages
  averageSentiment: 34.7 // Positive sentiment community
}

export const mockAnalyticsTrends: AnalyticsTrends = {
  totalMessages: { trend: "up", change: 18.2 },
  pointsAwarded: { trend: "up", change: 24.5 },
  positiveActions: { trend: "up", change: 15.8 },
  averageSentiment: { trend: "up", change: 8.3 }
}

export const mockSentimentDistribution: SentimentDistribution = {
  positive: 58.3, // Majority positive
  neutral: 31.2,  // Neutral middle ground
  negative: 10.5  // Small negative portion
}

export const mockSentimentScale: SentimentScale = {
  currentScore: 34.7,  // Matches averageSentiment
  previousScore: 26.4  // Shows improvement over time
}

export const mockCommunityActions: CommunityActionData[] = [
  {
    action: CommunityAction.ENCOURAGEMENT,
    count: 2847,
    percentage: 31.9,
    trend: "up",
    change: 12.4
  },
  {
    action: CommunityAction.HELPFUL_ADVICE,
    count: 1923,
    percentage: 21.5,
    trend: "up",
    change: 8.7
  },
  {
    action: CommunityAction.TEAM_COORDINATION,
    count: 1654,
    percentage: 18.5,
    trend: "up",
    change: 15.2
  },
  {
    action: CommunityAction.WELCOME_NEWCOMER,
    count: 1289,
    percentage: 14.4,
    trend: "up",
    change: 22.1
  },
  {
    action: CommunityAction.APPRECIATION,
    count: 867,
    percentage: 9.7,
    trend: "up",
    change: 6.3
  },
  {
    action: CommunityAction.KNOWLEDGE_SHARING,
    count: 343,
    percentage: 3.8,
    trend: "down",
    change: -2.1
  }
]

// Time period types
export type TimePeriod = "1d" | "7d" | "1m"

// Time-based sentiment data interfaces
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

export const mockHourlySentimentData: HourlySentimentData[] = [
  { hour: "00", averageSentiment: 28.3, messageCount: 186, positiveCount: 98, neutralCount: 67, negativeCount: 21 },
  { hour: "01", averageSentiment: 31.2, messageCount: 165, positiveCount: 89, neutralCount: 58, negativeCount: 18 },
  { hour: "02", averageSentiment: 25.7, messageCount: 142, positiveCount: 73, neutralCount: 54, negativeCount: 15 },
  { hour: "03", averageSentiment: 29.1, messageCount: 158, positiveCount: 84, neutralCount: 56, negativeCount: 18 },
  { hour: "04", averageSentiment: 33.4, messageCount: 201, positiveCount: 112, neutralCount: 67, negativeCount: 22 },
  { hour: "05", averageSentiment: 35.8, messageCount: 234, positiveCount: 132, neutralCount: 78, negativeCount: 24 },
  { hour: "06", averageSentiment: 38.2, messageCount: 287, positiveCount: 167, neutralCount: 89, negativeCount: 31 },
  { hour: "07", averageSentiment: 41.7, messageCount: 312, positiveCount: 189, neutralCount: 95, negativeCount: 28 },
  { hour: "08", averageSentiment: 45.3, messageCount: 398, positiveCount: 245, neutralCount: 118, negativeCount: 35 },
  { hour: "09", averageSentiment: 42.8, messageCount: 445, positiveCount: 267, neutralCount: 134, negativeCount: 44 },
  { hour: "10", averageSentiment: 39.6, messageCount: 482, positiveCount: 278, neutralCount: 152, negativeCount: 52 },
  { hour: "11", averageSentiment: 37.4, messageCount: 521, positiveCount: 289, neutralCount: 172, negativeCount: 60 },
  { hour: "12", averageSentiment: 35.9, messageCount: 567, positiveCount: 312, neutralCount: 186, negativeCount: 69 },
  { hour: "13", averageSentiment: 33.2, messageCount: 598, positiveCount: 324, neutralCount: 201, negativeCount: 73 },
  { hour: "14", averageSentiment: 31.8, messageCount: 634, positiveCount: 342, neutralCount: 213, negativeCount: 79 },
  { hour: "15", averageSentiment: 29.7, messageCount: 678, positiveCount: 356, neutralCount: 234, negativeCount: 88 },
  { hour: "16", averageSentiment: 32.1, messageCount: 712, positiveCount: 378, neutralCount: 245, negativeCount: 89 },
  { hour: "17", averageSentiment: 34.6, messageCount: 743, positiveCount: 401, neutralCount: 258, negativeCount: 84 },
  { hour: "18", averageSentiment: 36.8, messageCount: 698, positiveCount: 389, neutralCount: 234, negativeCount: 75 },
  { hour: "19", averageSentiment: 38.9, messageCount: 654, positiveCount: 367, neutralCount: 211, negativeCount: 76 },
  { hour: "20", averageSentiment: 35.4, messageCount: 587, positiveCount: 323, neutralCount: 192, negativeCount: 72 },
  { hour: "21", averageSentiment: 33.7, messageCount: 523, positiveCount: 287, neutralCount: 171, negativeCount: 65 },
  { hour: "22", averageSentiment: 31.2, messageCount: 456, positiveCount: 248, neutralCount: 148, negativeCount: 60 },
  { hour: "23", averageSentiment: 29.8, messageCount: 312, positiveCount: 169, neutralCount: 105, negativeCount: 38 }
]

// Daily sentiment data for 7-day trends
export const mockDailySentimentData: DailySentimentData[] = [
  { 
    day: "Mon", 
    date: "2024-01-15", 
    averageSentiment: 28.5, 
    messageCount: 8245, 
    positiveCount: 4723, 
    neutralCount: 2854, 
    negativeCount: 668 
  },
  { 
    day: "Tue", 
    date: "2024-01-16", 
    averageSentiment: 32.8, 
    messageCount: 9156, 
    positiveCount: 5487, 
    neutralCount: 2945, 
    negativeCount: 724 
  },
  { 
    day: "Wed", 
    date: "2024-01-17", 
    averageSentiment: 36.2, 
    messageCount: 9842, 
    positiveCount: 6125, 
    neutralCount: 3023, 
    negativeCount: 694 
  },
  { 
    day: "Thu", 
    date: "2024-01-18", 
    averageSentiment: 41.7, 
    messageCount: 10567, 
    positiveCount: 6985, 
    neutralCount: 2934, 
    negativeCount: 648 
  },
  { 
    day: "Fri", 
    date: "2024-01-19", 
    averageSentiment: 45.3, 
    messageCount: 12389, 
    positiveCount: 8247, 
    neutralCount: 3456, 
    negativeCount: 686 
  },
  { 
    day: "Sat", 
    date: "2024-01-20", 
    averageSentiment: 38.9, 
    messageCount: 11245, 
    positiveCount: 7156, 
    neutralCount: 3287, 
    negativeCount: 802 
  },
  { 
    day: "Sun", 
    date: "2024-01-21", 
    averageSentiment: 34.7, 
    messageCount: 9834, 
    positiveCount: 5967, 
    neutralCount: 3145, 
    negativeCount: 722 
  }
]

// Weekly sentiment data for monthly trends
export const mockWeeklySentimentData: WeeklySentimentData[] = [
  { 
    week: "Week 1", 
    weekNumber: 1, 
    averageSentiment: 26.4, 
    messageCount: 68543, 
    positiveCount: 38467, 
    neutralCount: 23456, 
    negativeCount: 6620 
  },
  { 
    week: "Week 2", 
    weekNumber: 2, 
    averageSentiment: 31.8, 
    messageCount: 72156, 
    positiveCount: 43892, 
    neutralCount: 22567, 
    negativeCount: 5697 
  },
  { 
    week: "Week 3", 
    weekNumber: 3, 
    averageSentiment: 38.2, 
    messageCount: 75834, 
    positiveCount: 48923, 
    neutralCount: 21345, 
    negativeCount: 5566 
  },
  { 
    week: "Week 4", 
    weekNumber: 4, 
    averageSentiment: 34.7, 
    messageCount: 71278, 
    positiveCount: 45123, 
    neutralCount: 20987, 
    negativeCount: 5168 
  }
]

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