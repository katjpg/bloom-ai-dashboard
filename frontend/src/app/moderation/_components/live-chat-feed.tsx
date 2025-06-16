"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PriorityLevel, ContentType } from "@/lib/colors-mod"
import { mockChatMessages } from "../_data"
import CardsChat from "./cards-chat"

interface LiveChatFeedProps {
  filters: {
    priorities: PriorityLevel[]
    violations: ContentType[]
  }
  selectedExperienceId: number
}

export default function LiveChatFeed({ filters, selectedExperienceId }: LiveChatFeedProps) {
  const filteredMessages = useMemo(() => {
    return mockChatMessages.filter((message) => {
      // Filter by selected experience first
      const experienceMatch = message.experience_id === selectedExperienceId
      
      // Then apply other filters - show all messages if no filters selected (empty arrays mean "All")
      const priorityMatch = filters.priorities.length === 0 || 
        (message.priority_level && filters.priorities.includes(message.priority_level))
      
      const violationMatch = filters.violations.length === 0 || 
        (message.content_types && message.content_types.some(ct => filters.violations.includes(ct)))
      
      return experienceMatch && priorityMatch && violationMatch
    })
  }, [filters, selectedExperienceId])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-clash text-xl font-medium">
          Live Chat Feed ({filteredMessages.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages match the current filters
            </div>
          ) : (
            filteredMessages.map((message) => (
              <CardsChat key={message.id} message={message} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}