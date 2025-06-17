import { TrendingUp, TrendingDown, MessageSquare, Award, Heart, BarChart3 } from "lucide-react"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
      <Card className="@container/card bg-gradient-to-t from-blue-500/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Total Messages
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.totalMessages.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(trends.totalMessages.trend as TrendDirection) === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {(trends.totalMessages.trend as TrendDirection) === "up" ? "+" : ""}{trends.totalMessages.change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
          <div className="flex gap-2 font-medium leading-relaxed">
            {(trends.totalMessages.trend as TrendDirection) === "up" ? "Growing activity" : "Declining activity"} 
            {(trends.totalMessages.trend as TrendDirection) === "up" ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground leading-relaxed">
            Total community interactions
          </div>
        </CardFooter>
      </Card>

      {/* Points Awarded */}
      <Card className="@container/card bg-gradient-to-t from-emerald-500/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Points Awarded
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.pointsAwarded.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(trends.pointsAwarded.trend as TrendDirection) === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {(trends.pointsAwarded.trend as TrendDirection) === "up" ? "+" : ""}{trends.pointsAwarded.change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
          <div className="flex gap-2 font-medium leading-relaxed">
            {(trends.pointsAwarded.trend as TrendDirection) === "up" ? "Increasing rewards" : "Decreasing rewards"}
            {(trends.pointsAwarded.trend as TrendDirection) === "up" ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground leading-relaxed">
            Total points from positive sentiment
          </div>
        </CardFooter>
      </Card>

      {/* Positive Actions */}
      <Card className="@container/card bg-gradient-to-t from-rose-500/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            Positive Actions
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.positiveActions.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(trends.positiveActions.trend as TrendDirection) === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {(trends.positiveActions.trend as TrendDirection) === "up" ? "+" : ""}{trends.positiveActions.change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
          <div className="flex gap-2 font-medium leading-relaxed">
            {(trends.positiveActions.trend as TrendDirection) === "up" ? "Growing positivity" : "Positivity needs attention"}
            {(trends.positiveActions.trend as TrendDirection) === "up" ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground leading-relaxed">
            Encouragement, help, and support
          </div>
        </CardFooter>
      </Card>

      {/* Average Sentiment */}
      <Card className="@container/card bg-gradient-to-t from-amber-500/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Average Sentiment
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.averageSentiment > 0 ? "+" : ""}{metrics.averageSentiment}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(trends.averageSentiment.trend as TrendDirection) === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {(trends.averageSentiment.trend as TrendDirection) === "up" ? "+" : ""}{trends.averageSentiment.change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
          <div className="flex gap-2 font-medium leading-relaxed">
            {metrics.averageSentiment > 0 ? "Positive community" : metrics.averageSentiment < -10 ? "Negative sentiment" : "Neutral sentiment"}
            {(trends.averageSentiment.trend as TrendDirection) === "up" ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground leading-relaxed">
            Scale from -100 to +100
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}