"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TopLeaders from "./_components/top-leaders"
import { TimePeriod } from "./_data"

export default function LeaderboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("today")

  const handleTabChange = (value: string) => {
    setSelectedPeriod(value as TimePeriod)
  }

  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="font-clash text-3xl font-medium bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Community Leaderboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Celebrating positive contributors and community leaders
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs 
        value={selectedPeriod} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
          <TabsTrigger value="today" className="text-sm">
            Today
          </TabsTrigger>
          <TabsTrigger value="week" className="text-sm">
            This Week
          </TabsTrigger>
          <TabsTrigger value="month" className="text-sm">
            This Month
          </TabsTrigger>
          <TabsTrigger value="alltime" className="text-sm">
            All Time
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-8">
          <TopLeaders timePeriod="today" />
        </TabsContent>

        <TabsContent value="week" className="mt-8">
          <TopLeaders timePeriod="week" />
        </TabsContent>

        <TabsContent value="month" className="mt-8">
          <TopLeaders timePeriod="month" />
        </TabsContent>

        <TabsContent value="alltime" className="mt-8">
          <TopLeaders timePeriod="alltime" />
        </TabsContent>
      </Tabs>
    </div>
  )
}