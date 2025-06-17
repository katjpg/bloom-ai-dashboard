import { TrendingUp, TrendingDown, Users, Activity, UserCheck, BarChart2 } from "lucide-react"
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
      <Card className="@container/card bg-gradient-to-t from-emerald-500/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Percent Positive Actions
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.positivePercentage.toFixed(1)}%
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
      </Card>

      {/* Total Actions */}
      <Card className="@container/card bg-gradient-to-t from-blue-500/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Total Actions
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.totalActions.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(trends.totalActions.trend as TrendDirection) === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {(trends.totalActions.trend as TrendDirection) === "up" ? "+" : ""}{trends.totalActions.change}%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Active Contributors */}
      <Card className="@container/card bg-gradient-to-t from-violet-500/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            Active Contributors
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.activeContributors.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(trends.activeContributors.trend as TrendDirection) === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {(trends.activeContributors.trend as TrendDirection) === "up" ? "+" : ""}{trends.activeContributors.change}%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Actions Per User */}
      <Card className="@container/card bg-gradient-to-t from-amber-500/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Actions Per User
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.actionsPerUser.toFixed(1)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(trends.actionsPerUser.trend as TrendDirection) === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {(trends.actionsPerUser.trend as TrendDirection) === "up" ? "+" : ""}{trends.actionsPerUser.change}%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  )
}