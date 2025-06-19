"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconRefresh } from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useTopPlayers } from "@/hooks/useTopPlayers"
import TopLeaders from "./_components/top-leaders"

export default function LeaderboardPage() {
  const [limit, setLimit] = useState(10)
  
  // Use the new hook to get real API data
  const { data: topPlayers, loading, error, lastUpdated, refetch } = useTopPlayers(limit)

  // Calculate statistics from real API data
  const totalMessages = topPlayers.reduce((sum, player) => sum + player.message_count, 0)
  const avgScore = topPlayers.length > 0 
    ? Math.round(topPlayers.reduce((sum, player) => sum + player.total_sentiment_score, 0) / topPlayers.length) 
    : 0
  const highestScore = topPlayers.length > 0 ? topPlayers[0].total_sentiment_score : 0

  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="font-clash text-3xl font-medium bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Live Sentiment Leaderboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time rankings based on positive sentiment scores
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <div className="text-xs text-muted-foreground text-right">
              Last updated:<br />
              {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <IconRefresh className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards - Real API Data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Total Players</CardDescription>
            <CardTitle>
              {loading ? <Skeleton className="h-7 w-20" /> : topPlayers.length}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Total Messages</CardDescription>
            <CardTitle>
              {loading ? <Skeleton className="h-7 w-20" /> : totalMessages.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Highest Score</CardDescription>
            <CardTitle>
              {loading ? <Skeleton className="h-7 w-20" /> : highestScore.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Average Score</CardDescription>
            <CardTitle>
              {loading ? <Skeleton className="h-7 w-20" /> : avgScore.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Leaderboard Component */}
      <TopLeaders 
        players={topPlayers} 
        loading={loading}
        onLimitChange={setLimit}
        currentLimit={limit}
      />
    </div>
  )
}