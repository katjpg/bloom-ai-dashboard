"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CardsSentiment from "./_components/cards-sentiment"
import SentimentDistribution from "./_components/sentiment-distribution"
import SentimentTrends from "./_components/sentiment-trends"
import { mockExperiences } from "./_data"

export default function AnalyticsPage() {
  const [selectedExperienceId, setSelectedExperienceId] = useState<number>(1)

  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      {/* Header Section */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-clash text-3xl font-medium">
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Monitor sentiment trends and community engagement metrics
          </p>
        </div>
        <Select value={selectedExperienceId.toString()} onValueChange={(value) => setSelectedExperienceId(Number(value))}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mockExperiences.map((experience) => (
              <SelectItem key={experience.id} value={experience.id.toString()}>
                {experience.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="overview" className="gap-6">
        <TabsList className="w-full @3xl/page:w-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="community-actions">Community Actions</TabsTrigger>
          <TabsTrigger value="message-details">Message Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-6">
          {/* Overview Content */}
          <div className="space-y-6">
            {/* Sentiment Metrics Cards */}
            <CardsSentiment selectedExperienceId={selectedExperienceId} />
            
            {/* Sentiment Distribution */}
            <SentimentDistribution selectedExperienceId={selectedExperienceId} />
          </div>
        </TabsContent>

        <TabsContent value="trends" className="flex flex-col gap-6">
          {/* Sentiment Trends Chart */}
          <SentimentTrends selectedExperienceId={selectedExperienceId} />
        </TabsContent>

        <TabsContent value="community-actions" className="flex flex-col gap-6">
          {/* Placeholder for Community Actions tab */}
          <div className="flex items-center justify-center h-96 bg-muted/30 rounded-lg border border-border/40">
            <div className="text-center space-y-2">
              <h3 className="font-clash text-xl font-medium text-muted-foreground">Community Actions</h3>
              <p className="text-sm text-muted-foreground">Coming soon - breakdown of positive/negative actions</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="message-details" className="flex flex-col gap-6">
          {/* Placeholder for Message Details tab */}
          <div className="flex items-center justify-center h-96 bg-muted/30 rounded-lg border border-border/40">
            <div className="text-center space-y-2">
              <h3 className="font-clash text-xl font-medium text-muted-foreground">Message Details</h3>
              <p className="text-sm text-muted-foreground">Coming soon - detailed message analysis</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}