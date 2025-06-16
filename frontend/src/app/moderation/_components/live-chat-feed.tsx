"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { PriorityLevel, ContentType } from "@/lib/colors-mod"
import { mockChatMessages, PRIORITY_FILTER_OPTIONS, VIOLATION_FILTER_OPTIONS, ChatMessage } from "../_data"
import { Search, Filter, X } from "lucide-react"
import CardsChat from "./cards-chat"

interface LiveChatFeedProps {
  selectedExperienceId: number
  onPlayerSelect?: (message: ChatMessage) => void
}

export default function LiveChatFeed({ selectedExperienceId, onPlayerSelect }: LiveChatFeedProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPriorities, setSelectedPriorities] = useState<PriorityLevel[]>([])
  const [selectedViolations, setSelectedViolations] = useState<ContentType[]>([])

  const filteredMessages = useMemo(() => {
    return mockChatMessages.filter((message) => {
      // Filter by selected experience first
      const experienceMatch = message.experience_id === selectedExperienceId
      
      // Search filter
      const searchMatch = searchTerm === "" || 
        message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.player_name.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Priority filter - show all messages if no filters selected (empty arrays mean "All")
      const priorityMatch = selectedPriorities.length === 0 || 
        (message.priority_level && selectedPriorities.includes(message.priority_level))
      
      // Violation filter
      const violationMatch = selectedViolations.length === 0 || 
        (message.content_types && message.content_types.some(ct => selectedViolations.includes(ct)))
      
      return experienceMatch && searchMatch && priorityMatch && violationMatch
    })
  }, [selectedExperienceId, searchTerm, selectedPriorities, selectedViolations])

  const handlePriorityChange = (priority: PriorityLevel, checked: boolean) => {
    setSelectedPriorities(prev => 
      checked ? [...prev, priority] : prev.filter(p => p !== priority)
    )
  }

  const handleViolationChange = (violation: ContentType, checked: boolean) => {
    setSelectedViolations(prev => 
      checked ? [...prev, violation] : prev.filter(v => v !== violation)
    )
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedPriorities([])
    setSelectedViolations([])
  }

  const hasActiveFilters = searchTerm !== "" || selectedPriorities.length > 0 || selectedViolations.length > 0

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <CardTitle className="font-clash text-xl font-medium">
          Live Chat Feed ({filteredMessages.length})
        </CardTitle>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search messages or players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filter Dropdowns */}
          <div className="flex gap-2">
            {/* Priority Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Priority
                  {selectedPriorities.length > 0 && (
                    <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
                      {selectedPriorities.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {PRIORITY_FILTER_OPTIONS.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={selectedPriorities.includes(option.value)}
                    onCheckedChange={(checked) => handlePriorityChange(option.value, !!checked)}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Violation Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Violations
                  {selectedViolations.length > 0 && (
                    <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
                      {selectedViolations.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {VIOLATION_FILTER_OPTIONS.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={selectedViolations.includes(option.value)}
                    onCheckedChange={(checked) => handleViolationChange(option.value, !!checked)}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="gap-1">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {hasActiveFilters ? "No messages match the current filters" : "No messages found"}
            </div>
          ) : (
            filteredMessages.map((message) => (
              <CardsChat key={message.id} message={message} onPlayerSelect={onPlayerSelect} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}