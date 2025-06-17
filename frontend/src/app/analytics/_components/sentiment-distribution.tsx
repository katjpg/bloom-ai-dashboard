import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockSentimentDistribution, mockSentimentScale } from "../_data"

interface SentimentDistributionProps {
  selectedExperienceId: number
}

export default function SentimentDistribution({ selectedExperienceId }: SentimentDistributionProps) {
  // this would filter data by selectedExperienceId
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const distribution = mockSentimentDistribution
  const scale = mockSentimentScale

  // Calculate position for the sentiment indicator (0-100 scale for positioning)
  const indicatorPosition = ((scale.currentScore + 100) / 200) * 100

  return (
    <div className="grid grid-cols-1 gap-6 @3xl/page:grid-cols-2">
      {/* Sentiment Scale */}
      <Card className="@container/card shadow-xs">
        <CardHeader>
          <CardTitle className="font-clash text-lg font-medium">Sentiment Scale</CardTitle>
          <CardDescription>
            Current average sentiment: <span className="font-semibold">{scale.currentScore > 0 ? "+" : ""}{scale.currentScore}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gradient Bar with Indicator */}
          <div className="relative">
            {/* Gradient Background */}
            <div className="h-8 w-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 relative overflow-hidden">
              {/* Indicator Line */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white border-2 border-gray-800 dark:border-white shadow-lg transition-all duration-300"
                style={{ left: `calc(${indicatorPosition}% - 2px)` }}
              />
            </div>
            
            {/* Scale Labels */}
            <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium">
              <span>-100</span>
              <span>-50</span>
              <span>0</span>
              <span>+50</span>
              <span>+100</span>
            </div>

            {/* Scale Description */}
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Very Negative</span>
              <span>Neutral</span>
              <span>Very Positive</span>
            </div>
          </div>

          {/* Trend Comparison */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="text-sm">
              <span className="text-muted-foreground">Previous period: </span>
              <span className="font-semibold">{scale.previousScore > 0 ? "+" : ""}{scale.previousScore}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Change: </span>
              <span className={`font-semibold ${scale.currentScore > scale.previousScore ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {scale.currentScore > scale.previousScore ? "+" : ""}{(scale.currentScore - scale.previousScore).toFixed(1)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Bars */}
      <Card className="@container/card shadow-xs">
        <CardHeader>
          <CardTitle className="font-clash text-lg font-medium">Sentiment Distribution</CardTitle>
          <CardDescription>
            Breakdown of message sentiment categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Positive */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Positive</span>
              <span className="text-sm font-semibold tabular-nums">{distribution.positive}%</span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${distribution.positive}%` }}
              />
            </div>
          </div>

          {/* Neutral */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Neutral</span>
              <span className="text-sm font-semibold tabular-nums">{distribution.neutral}%</span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${distribution.neutral}%` }}
              />
            </div>
          </div>

          {/* Negative */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-700 dark:text-red-400">Negative</span>
              <span className="text-sm font-semibold tabular-nums">{distribution.negative}%</span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${distribution.negative}%` }}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="pt-2 border-t border-border/40">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total messages analyzed</span>
              <span className="font-semibold">100%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}