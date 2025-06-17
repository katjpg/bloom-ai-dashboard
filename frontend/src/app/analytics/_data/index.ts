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
  totalMessages: 2847,
  pointsAwarded: 5694, // Roughly 2x totalMessages (positive sentiment average)
  positiveActions: 1597, // About 56% of total messages
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

// Positive community actions data
export const mockPositiveCommunityActions: CommunityActionData[] = [
  {
    action: CommunityAction.ENCOURAGEMENT,
    count: 510,
    percentage: 31.9,
    trend: "up",
    change: 12.4
  },
  {
    action: CommunityAction.HELPFUL_ADVICE,
    count: 343,
    percentage: 21.5,
    trend: "up",
    change: 8.7
  },
  {
    action: CommunityAction.TEAM_COORDINATION,
    count: 295,
    percentage: 18.5,
    trend: "up",
    change: 15.2
  },
  {
    action: CommunityAction.WELCOME_NEWCOMER,
    count: 230,
    percentage: 14.4,
    trend: "up",
    change: 22.1
  },
  {
    action: CommunityAction.APPRECIATION,
    count: 155,
    percentage: 9.7,
    trend: "up",
    change: 6.3
  },
  {
    action: CommunityAction.KNOWLEDGE_SHARING,
    count: 61,
    percentage: 3.8,
    trend: "down",
    change: -2.1
  },
  {
    action: CommunityAction.CELEBRATION,
    count: 48,
    percentage: 3.0,
    trend: "up",
    change: 18.5
  }
]

// Negative community actions data
export const mockNegativeCommunityActions: CommunityActionData[] = [
  {
    action: CommunityAction.SPAMMING,
    count: 42,
    percentage: 35.8,
    trend: "down",
    change: -15.2
  },
  {
    action: CommunityAction.ARGUMENT_STARTING,
    count: 28,
    percentage: 23.9,
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
    percentage: 10.3,
    trend: "down",
    change: -22.1
  },
  {
    action: CommunityAction.EXCLUSION,
    count: 8,
    percentage: 6.9,
    trend: "down",
    change: -12.8
  },
  {
    action: CommunityAction.SHOW_OFF,
    count: 6,
    percentage: 5.2,
    trend: "up",
    change: 4.3
  },
  {
    action: CommunityAction.PUT_DOWN,
    count: 3,
    percentage: 2.8,
    trend: "down",
    change: -18.9
  },
  {
    action: CommunityAction.GRIEFING,
    count: 2,
    percentage: 1.5,
    trend: "down",
    change: -33.3
  },
  {
    action: CommunityAction.BULLYING,
    count: 1,
    percentage: 1.1,
    trend: "down",
    change: -46.2
  }
]

// Combined community actions for backward compatibility
export const mockCommunityActions = mockPositiveCommunityActions

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
  { hour: "00", averageSentiment: 28.3, messageCount: 28, positiveCount: 15, neutralCount: 10, negativeCount: 3 },
  { hour: "01", averageSentiment: 31.2, messageCount: 24, positiveCount: 13, neutralCount: 9, negativeCount: 2 },
  { hour: "02", averageSentiment: 25.7, messageCount: 19, positiveCount: 10, neutralCount: 7, negativeCount: 2 },
  { hour: "03", averageSentiment: 29.1, messageCount: 22, positiveCount: 12, neutralCount: 8, negativeCount: 2 },
  { hour: "04", averageSentiment: 33.4, messageCount: 31, positiveCount: 17, neutralCount: 11, negativeCount: 3 },
  { hour: "05", averageSentiment: 35.8, messageCount: 38, positiveCount: 21, neutralCount: 13, negativeCount: 4 },
  { hour: "06", averageSentiment: 38.2, messageCount: 45, positiveCount: 26, neutralCount: 15, negativeCount: 4 },
  { hour: "07", averageSentiment: 41.7, messageCount: 52, positiveCount: 31, neutralCount: 16, negativeCount: 5 },
  { hour: "08", averageSentiment: 45.3, messageCount: 67, positiveCount: 41, neutralCount: 20, negativeCount: 6 },
  { hour: "09", averageSentiment: 42.8, messageCount: 74, positiveCount: 44, neutralCount: 23, negativeCount: 7 },
  { hour: "10", averageSentiment: 39.6, messageCount: 83, positiveCount: 47, neutralCount: 27, negativeCount: 9 },
  { hour: "11", averageSentiment: 37.4, messageCount: 89, positiveCount: 49, neutralCount: 30, negativeCount: 10 },
  { hour: "12", averageSentiment: 35.9, messageCount: 95, positiveCount: 52, neutralCount: 32, negativeCount: 11 },
  { hour: "13", averageSentiment: 33.2, messageCount: 102, positiveCount: 55, neutralCount: 35, negativeCount: 12 },
  { hour: "14", averageSentiment: 31.8, messageCount: 108, positiveCount: 58, neutralCount: 37, negativeCount: 13 },
  { hour: "15", averageSentiment: 29.7, messageCount: 115, positiveCount: 60, neutralCount: 40, negativeCount: 15 },
  { hour: "16", averageSentiment: 32.1, messageCount: 121, positiveCount: 64, neutralCount: 42, negativeCount: 15 },
  { hour: "17", averageSentiment: 34.6, messageCount: 127, positiveCount: 68, neutralCount: 44, negativeCount: 15 },
  { hour: "18", averageSentiment: 36.8, messageCount: 118, positiveCount: 66, neutralCount: 40, negativeCount: 12 },
  { hour: "19", averageSentiment: 38.9, messageCount: 111, positiveCount: 62, neutralCount: 36, negativeCount: 13 },
  { hour: "20", averageSentiment: 35.4, messageCount: 98, positiveCount: 54, neutralCount: 33, negativeCount: 11 },
  { hour: "21", averageSentiment: 33.7, messageCount: 87, positiveCount: 48, neutralCount: 29, negativeCount: 10 },
  { hour: "22", averageSentiment: 31.2, messageCount: 76, positiveCount: 42, neutralCount: 26, negativeCount: 8 },
  { hour: "23", averageSentiment: 29.8, messageCount: 52, positiveCount: 28, neutralCount: 18, negativeCount: 6 }
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

// Community Action Metrics
export interface CommunityActionMetrics {
  totalActions: number
  positiveActions: number
  negativeActions: number
  activeContributors: number
  actionsPerUser: number
  positivePercentage: number
}

export interface CommunityActionTrends {
  totalActions: TrendData
  positiveActions: TrendData
  activeContributors: TrendData
  actionsPerUser: TrendData
}

// Time-based action data interfaces
export interface HourlyActionData {
  hour: string
  positiveActions: number
  negativeActions: number
  totalActions: number
  activeUsers: number
}

export interface DailyActionData {
  day: string
  date: string
  positiveActions: number
  negativeActions: number
  totalActions: number
  activeUsers: number
}

export interface WeeklyActionData {
  week: string
  weekNumber: number
  positiveActions: number
  negativeActions: number
  totalActions: number
  activeUsers: number
}

// Mock community action metrics
export const mockCommunityActionMetrics: CommunityActionMetrics = {
  totalActions: 1715, // Sum of positive (1597) + negative (118)
  positiveActions: 1597,
  negativeActions: 118,
  activeContributors: 187,
  actionsPerUser: 9.2,
  positivePercentage: 93.1
}

export const mockCommunityActionTrends: CommunityActionTrends = {
  totalActions: { trend: "up", change: 12.8 },
  positiveActions: { trend: "up", change: 15.8 },
  activeContributors: { trend: "up", change: 8.4 },
  actionsPerUser: { trend: "up", change: 6.2 }
}

// Mock hourly action data
export const mockHourlyActionData: HourlyActionData[] = [
  { hour: "00", positiveActions: 124, negativeActions: 8, totalActions: 132, activeUsers: 89 },
  { hour: "01", positiveActions: 98, negativeActions: 6, totalActions: 104, activeUsers: 76 },
  { hour: "02", positiveActions: 87, negativeActions: 5, totalActions: 92, activeUsers: 63 },
  { hour: "03", positiveActions: 76, negativeActions: 4, totalActions: 80, activeUsers: 58 },
  { hour: "04", positiveActions: 89, negativeActions: 7, totalActions: 96, activeUsers: 67 },
  { hour: "05", positiveActions: 112, negativeActions: 9, totalActions: 121, activeUsers: 82 },
  { hour: "06", positiveActions: 145, negativeActions: 12, totalActions: 157, activeUsers: 98 },
  { hour: "07", positiveActions: 189, negativeActions: 15, totalActions: 204, activeUsers: 124 },
  { hour: "08", positiveActions: 234, negativeActions: 18, totalActions: 252, activeUsers: 156 },
  { hour: "09", positiveActions: 278, negativeActions: 21, totalActions: 299, activeUsers: 187 },
  { hour: "10", positiveActions: 312, negativeActions: 24, totalActions: 336, activeUsers: 203 },
  { hour: "11", positiveActions: 345, negativeActions: 27, totalActions: 372, activeUsers: 219 },
  { hour: "12", positiveActions: 389, negativeActions: 31, totalActions: 420, activeUsers: 245 },
  { hour: "13", positiveActions: 412, negativeActions: 33, totalActions: 445, activeUsers: 267 },
  { hour: "14", positiveActions: 434, negativeActions: 35, totalActions: 469, activeUsers: 289 },
  { hour: "15", positiveActions: 456, negativeActions: 37, totalActions: 493, activeUsers: 298 },
  { hour: "16", positiveActions: 423, negativeActions: 34, totalActions: 457, activeUsers: 287 },
  { hour: "17", positiveActions: 398, negativeActions: 32, totalActions: 430, activeUsers: 276 },
  { hour: "18", positiveActions: 367, negativeActions: 29, totalActions: 396, activeUsers: 254 },
  { hour: "19", positiveActions: 334, negativeActions: 26, totalActions: 360, activeUsers: 232 },
  { hour: "20", positiveActions: 289, negativeActions: 23, totalActions: 312, activeUsers: 198 },
  { hour: "21", positiveActions: 234, negativeActions: 19, totalActions: 253, activeUsers: 167 },
  { hour: "22", positiveActions: 189, negativeActions: 15, totalActions: 204, activeUsers: 134 },
  { hour: "23", positiveActions: 156, negativeActions: 12, totalActions: 168, activeUsers: 112 }
]

// Mock daily action data
export const mockDailyActionData: DailyActionData[] = [
  { 
    day: "Mon", 
    date: "2024-01-15", 
    positiveActions: 5234, 
    negativeActions: 423, 
    totalActions: 5657, 
    activeUsers: 1876 
  },
  { 
    day: "Tue", 
    date: "2024-01-16", 
    positiveActions: 5789, 
    negativeActions: 389, 
    totalActions: 6178, 
    activeUsers: 1923 
  },
  { 
    day: "Wed", 
    date: "2024-01-17", 
    positiveActions: 6123, 
    negativeActions: 356, 
    totalActions: 6479, 
    activeUsers: 2001 
  },
  { 
    day: "Thu", 
    date: "2024-01-18", 
    positiveActions: 6456, 
    negativeActions: 334, 
    totalActions: 6790, 
    activeUsers: 2134 
  },
  { 
    day: "Fri", 
    date: "2024-01-19", 
    positiveActions: 7234, 
    negativeActions: 298, 
    totalActions: 7532, 
    activeUsers: 2287 
  },
  { 
    day: "Sat", 
    date: "2024-01-20", 
    positiveActions: 6789, 
    negativeActions: 367, 
    totalActions: 7156, 
    activeUsers: 2156 
  },
  { 
    day: "Sun", 
    date: "2024-01-21", 
    positiveActions: 5967, 
    negativeActions: 412, 
    totalActions: 6379, 
    activeUsers: 1987 
  }
]

// Mock weekly action data
export const mockWeeklyActionData: WeeklyActionData[] = [
  { 
    week: "Week 1", 
    weekNumber: 1, 
    positiveActions: 38467, 
    negativeActions: 2934, 
    totalActions: 41401, 
    activeUsers: 12456 
  },
  { 
    week: "Week 2", 
    weekNumber: 2, 
    positiveActions: 42156, 
    negativeActions: 2567, 
    totalActions: 44723, 
    activeUsers: 13234 
  },
  { 
    week: "Week 3", 
    weekNumber: 3, 
    positiveActions: 45892, 
    negativeActions: 2234, 
    totalActions: 48126, 
    activeUsers: 13789 
  },
  { 
    week: "Week 4", 
    weekNumber: 4, 
    positiveActions: 43123, 
    negativeActions: 2456, 
    totalActions: 45579, 
    activeUsers: 13456 
  }
]

// Utility functions for community actions
export const getActionTypeColor = (action: CommunityAction): string => {
  // Positive actions - green shades
  const positiveActions = [
    CommunityAction.ENCOURAGEMENT,
    CommunityAction.HELPFUL_ADVICE,
    CommunityAction.WELCOME_NEWCOMER,
    CommunityAction.TEAM_COORDINATION,
    CommunityAction.APPRECIATION,
    CommunityAction.CELEBRATION,
    CommunityAction.KNOWLEDGE_SHARING
  ]
  
  if (positiveActions.includes(action)) {
    return "hsl(142 76% 36%)" // Green
  }
  
  // Negative actions - red shades
  return "hsl(0 84% 60%)" // Red
}

export const getActionLabel = (action: CommunityAction): string => {
  const labels: Record<CommunityAction, string> = {
    // Positive Actions
    [CommunityAction.ENCOURAGEMENT]: "Encouragement",
    [CommunityAction.HELPFUL_ADVICE]: "Helpful Advice", 
    [CommunityAction.WELCOME_NEWCOMER]: "Welcome Newcomer",
    [CommunityAction.TEAM_COORDINATION]: "Team Coordination",
    [CommunityAction.APPRECIATION]: "Appreciation",
    [CommunityAction.CELEBRATION]: "Celebration",
    [CommunityAction.KNOWLEDGE_SHARING]: "Knowledge Sharing",
    // Negative Actions
    [CommunityAction.TROLLING]: "Trolling",
    [CommunityAction.GRIEFING]: "Griefing",
    [CommunityAction.SPAMMING]: "Spamming",
    [CommunityAction.EXCLUSION]: "Exclusion",
    [CommunityAction.BRAGGING]: "Bragging",
    [CommunityAction.ARGUMENT_STARTING]: "Argument Starting",
    [CommunityAction.BULLYING]: "Bullying",
    [CommunityAction.SHOW_OFF]: "Show Off",
    [CommunityAction.PUT_DOWN]: "Put Down"
  }
  
  return labels[action] || action
}

export const isPositiveAction = (action: CommunityAction): boolean => {
  const positiveActions = [
    CommunityAction.ENCOURAGEMENT,
    CommunityAction.HELPFUL_ADVICE,
    CommunityAction.WELCOME_NEWCOMER,
    CommunityAction.TEAM_COORDINATION,
    CommunityAction.APPRECIATION,
    CommunityAction.CELEBRATION,
    CommunityAction.KNOWLEDGE_SHARING
  ]
  
  return positiveActions.includes(action)
}