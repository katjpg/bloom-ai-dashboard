import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockCommunityActionMetrics, mockCommunityActionTrends, TrendDirection } from "../_data"

interface CardsActionsProps {
  selectedExperienceId: number
}

export default function CardsActions({ selectedExperienceId }: CardsActionsProps) {
  // In a real app, this would filter data by selectedExperienceId
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const metrics = mockCommunityActionMetrics
  const trends = mockCommunityActionTrends

  return (
    <div className="grid grid-cols-1 gap-4 @xl/page:grid-cols-2 @5xl/page:grid-cols-4">
      {/* Percent Positive Actions */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription>Positivity Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.positivePercentage.toFixed(1)}%
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

      {/* Total Actions */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription>Total Actions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.totalActions.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(trends.totalActions.trend as TrendDirection) === "up" ? (
                <IconTrendingUp className="h-3 w-3" />
              ) : (
                <IconTrendingDown className="h-3 w-3" />
              )}
              {(trends.totalActions.trend as TrendDirection) === "up" ? "+" : ""}{trends.totalActions.change}%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Active Contributors */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription>Active Contributors</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.activeContributors.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(trends.activeContributors.trend as TrendDirection) === "up" ? (
                <IconTrendingUp className="h-3 w-3" />
              ) : (
                <IconTrendingDown className="h-3 w-3" />
              )}
              {(trends.activeContributors.trend as TrendDirection) === "up" ? "+" : ""}{trends.activeContributors.change}%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Actions Per User */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription>Actions Per User</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.actionsPerUser.toFixed(1)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(trends.actionsPerUser.trend as TrendDirection) === "up" ? (
                <IconTrendingUp className="h-3 w-3" />
              ) : (
                <IconTrendingDown className="h-3 w-3" />
              )}
              {(trends.actionsPerUser.trend as TrendDirection) === "up" ? "+" : ""}{trends.actionsPerUser.change}%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  )
}