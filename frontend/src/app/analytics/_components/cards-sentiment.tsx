import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockAnalyticsMetrics, mockAnalyticsTrends, TrendDirection } from "../_data"

interface CardsSentimentProps {
  selectedExperienceId: number
}

export default function CardsSentiment({ selectedExperienceId }: CardsSentimentProps) {
  // In a real app, this would filter data by selectedExperienceId
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const metrics = mockAnalyticsMetrics
  const trends = mockAnalyticsTrends

  return (
    <div className="grid grid-cols-1 gap-4 @xl/page:grid-cols-2 @5xl/page:grid-cols-4">
      {/* Total Messages */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription>Total Messages</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.totalMessages.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(trends.totalMessages.trend as TrendDirection) === "up" ? (
                <IconTrendingUp className="h-3 w-3" />
              ) : (
                <IconTrendingDown className="h-3 w-3" />
              )}
              {(trends.totalMessages.trend as TrendDirection) === "up" ? "+" : ""}{trends.totalMessages.change}%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Points Awarded */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription>Points Awarded</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.pointsAwarded.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(trends.pointsAwarded.trend as TrendDirection) === "up" ? (
                <IconTrendingUp className="h-3 w-3" />
              ) : (
                <IconTrendingDown className="h-3 w-3" />
              )}
              {(trends.pointsAwarded.trend as TrendDirection) === "up" ? "+" : ""}{trends.pointsAwarded.change}%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Positive Actions */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription>Positive Actions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.positiveActions.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(trends.positiveActions.trend as TrendDirection) === "up" ? (
                <IconTrendingUp className="h-3 w-3" />
              ) : (
                <IconTrendingDown className="h-3 w-3" />
              )}
              {(trends.positiveActions.trend as TrendDirection) === "up" ? "+" : ""}{trends.positiveActions.change}%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Average Sentiment */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription>Average Sentiment</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.averageSentiment > 0 ? "+" : ""}{metrics.averageSentiment}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(trends.averageSentiment.trend as TrendDirection) === "up" ? (
                <IconTrendingUp className="h-3 w-3" />
              ) : (
                <IconTrendingDown className="h-3 w-3" />
              )}
              {(trends.averageSentiment.trend as TrendDirection) === "up" ? "+" : ""}{trends.averageSentiment.change}%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  )
}