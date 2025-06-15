import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockMetrics, mockTrends, TrendDirection } from "../_data"

export function CardsKPI() {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/page:grid-cols-2 @5xl/page:grid-cols-4">
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription>Total Messages</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {mockMetrics.totalMessages.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(mockTrends.totalMessages.trend as TrendDirection) === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {(mockTrends.totalMessages.trend as TrendDirection) === "up" ? "+" : ""}{mockTrends.totalMessages.change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm pt-4">
          <div className="flex gap-2 font-medium leading-relaxed">
            {(mockTrends.totalMessages.trend as TrendDirection) === "up" ? "Growing engagement" : "Declining activity"} 
            {(mockTrends.totalMessages.trend as TrendDirection) === "up" ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground leading-relaxed">
            Community interaction volume
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription>Active Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {mockMetrics.activeUsers.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(mockTrends.activeUsers.trend as TrendDirection) === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {(mockTrends.activeUsers.trend as TrendDirection) === "up" ? "+" : ""}{mockTrends.activeUsers.change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm pt-4">
          <div className="flex gap-2 font-medium leading-relaxed">
            {(mockTrends.activeUsers.trend as TrendDirection) === "up" ? "Strong user retention" : "User retention needs attention"}
            {(mockTrends.activeUsers.trend as TrendDirection) === "up" ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground leading-relaxed">
            Engagement exceeds targets
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription>Safety Score</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {mockMetrics.safetyScore}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(mockTrends.safetyScore.trend as TrendDirection) === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {(mockTrends.safetyScore.trend as TrendDirection) === "up" ? "+" : ""}{mockTrends.safetyScore.change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm pt-4">
          <div className="flex gap-2 font-medium leading-relaxed">
            {(mockTrends.safetyScore.trend as TrendDirection) === "up" ? "Improving safety metrics" : "Safety attention needed"}
            {(mockTrends.safetyScore.trend as TrendDirection) === "up" ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground leading-relaxed">
            Community health indicator
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
        <CardHeader>
          <CardDescription>Avg Response Time</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {mockMetrics.avgResponseTime}ms
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {(mockTrends.avgResponseTime.trend as TrendDirection) === "down" ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <TrendingUp className="h-3 w-3" />
              )}
              {(mockTrends.avgResponseTime.trend as TrendDirection) === "down" ? "" : "+"}{mockTrends.avgResponseTime.change}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm pt-4">
          <div className="flex gap-2 font-medium leading-relaxed">
            {(mockTrends.avgResponseTime.trend as TrendDirection) === "down" ? "Faster processing" : "Performance needs optimization"}
            {(mockTrends.avgResponseTime.trend as TrendDirection) === "down" ? (
              <TrendingDown className="size-4" />
            ) : (
              <TrendingUp className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground leading-relaxed">
            System performance metric
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
