"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  IconCircleCheck,
  IconRefresh
} from "@tabler/icons-react"
import { 
  PriorityLevel
} from "@/lib/colors-mod"
import { mockExperiences } from "../_data"
import { useQueue } from "@/hooks/useQueue"
import CardsQueue from "../_components/cards-queue"

export default function QueuePage() {
  const [selectedExperienceId, setSelectedExperienceId] = useState<number>(0) // 0 for "All"
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const { queueItems, loading, error, fetchQueueItems } = useQueue()

  // Filter queue items
  const filteredItems = queueItems.filter(item => {
    const experienceMatch = selectedExperienceId === 0 || item.experienceId === selectedExperienceId
    const priorityMatch = selectedPriority === "all" || item.priority === selectedPriority
    return experienceMatch && priorityMatch
  })

  const handleReview = (itemId: string) => {
    console.log(`Reviewing item ${itemId}`)
    // Here you would navigate to the detailed review page or open a modal
  }

  const handleResolve = (itemId: string) => {
    console.log(`Resolving item ${itemId}`)
    // Here you would mark the item as resolved
  }

  const handleDismiss = (itemId: string) => {
    console.log(`Dismissing item ${itemId}`)
    // Here you would dismiss the item
  }


  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 @2xl/page:flex-row @2xl/page:items-end @2xl/page:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-clash text-3xl font-medium">
            Moderation Queue
          </h1>
          <p className="text-muted-foreground">
            Review and manage flagged content and user reports
          </p>
        </div>
        
        {/* Filters - Responsive layout */}
        <div className="flex flex-col gap-3 @lg/page:flex-row @lg/page:gap-4">
          <Select value={selectedExperienceId.toString()} onValueChange={(value) => setSelectedExperienceId(Number(value))}>
            <SelectTrigger className="w-full @lg/page:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Experiences</SelectItem>
              {mockExperiences.map((experience) => (
                <SelectItem key={experience.id} value={experience.id.toString()}>
                  {experience.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-full @lg/page:w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value={PriorityLevel.CRITICAL}>Critical</SelectItem>
              <SelectItem value={PriorityLevel.HIGH}>High</SelectItem>
              <SelectItem value={PriorityLevel.MODERATE}>Moderate</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={fetchQueueItems} 
            disabled={loading}
            size="sm"
            className="gap-1"
          >
            <IconRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>


      {/* Queue Items */}
      <div className="space-y-4">
        {error && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <h3 className="font-clash text-lg font-medium text-destructive">Error Loading Queue</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={fetchQueueItems} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!error && loading && queueItems.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <IconRefresh className="h-12 w-12 mx-auto text-muted-foreground animate-spin" />
                <h3 className="font-clash text-lg font-medium">Loading Queue</h3>
                <p className="text-sm text-muted-foreground">
                  Fetching flagged messages...
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!error && !loading && filteredItems.length === 0 && queueItems.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <IconCircleCheck className="h-12 w-12 mx-auto text-green-500" />
                <h3 className="font-clash text-lg font-medium">Queue is Empty</h3>
                <p className="text-sm text-muted-foreground">
                  No flagged messages found. Flag some messages to see them here.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!error && !loading && filteredItems.length === 0 && queueItems.length > 0 && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <IconCircleCheck className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="font-clash text-lg font-medium">No Matches</h3>
                <p className="text-sm text-muted-foreground">
                  No items match your current filters
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!error && filteredItems.length > 0 && (
          filteredItems.map((item) => (
            <CardsQueue 
              key={item.id}
              item={item}
              onReview={handleReview}
              onResolve={handleResolve}
              mode="view"
            />
          ))
        )}
      </div>
    </div>
  )
}