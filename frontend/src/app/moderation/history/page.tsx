"use client"

import { useState, useMemo } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ModHistory from "../_components/mod-history"
import { mockExperiences } from "../_data"
import { useModerationHistory } from "@/contexts/moderation-history-context"
import { useAutoModeration } from "@/contexts/auto-moderation-context"

export default function HistoryPage() {
  const [selectedExperienceId, setSelectedExperienceId] = useState<number>(0)
  const { history: manualHistory } = useModerationHistory()
  const { moderationHistory: autoHistory } = useAutoModeration()

  // Merge manual and auto-moderation history, sorted by timestamp
  const combinedHistory = useMemo(() => {
    const combined = [...manualHistory, ...autoHistory]
    return combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [manualHistory, autoHistory])

  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 @2xl/page:flex-row @2xl/page:items-end @2xl/page:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-clash text-3xl font-medium">
            Moderation History
          </h1>
          <p className="text-muted-foreground">
            View and manage past moderation actions
          </p>
        </div>
        
        {/* Experience Filter */}
        <div className="flex flex-col gap-3 @lg/page:flex-row @lg/page:gap-4">
          <Select value={selectedExperienceId.toString()} onValueChange={(value) => setSelectedExperienceId(Number(value))}>
            <SelectTrigger className="w-full @lg/page:w-[250px]">
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
        </div>
      </div>

      {/* History Table */}
      <ModHistory 
        history={combinedHistory} 
        selectedExperienceId={selectedExperienceId === 0 ? undefined : selectedExperienceId} 
      />
    </div>
  )
}