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
