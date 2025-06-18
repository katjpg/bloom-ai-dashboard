"use client"

import React, { useMemo, useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { PriorityLevel, ContentType } from "@/lib/colors-mod"
import { PRIORITY_FILTER_OPTIONS, VIOLATION_FILTER_OPTIONS, ChatMessage, UserRole, UserStatus } from "../_data"
import { IconSearch, IconFilter, IconX, IconRefresh } from "@tabler/icons-react"
import CardsChat from "./cards-chat"
import { useLiveMessages } from "@/hooks/useLiveMessages"
import { useFlaggedMessagesContext } from "@/contexts/flagged-messages-context"
import { Message } from "@/types/sentiment"

interface LiveChatFeedProps {
  selectedExperienceId: number
  onPlayerSelect?: (message: ChatMessage) => void
  onModeChange?: (mode: ModeType) => void
  onSelectedMessagesChange?: (messages: string[]) => void
  clearSelectionTrigger?: number
}

export type ModeType = "view" | "mod" | "auto-mod"

export default function LiveChatFeed({ selectedExperienceId, onPlayerSelect, onModeChange, onSelectedMessagesChange, clearSelectionTrigger }: LiveChatFeedProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPriorities, setSelectedPriorities] = useState<PriorityLevel[]>([])
  const [selectedViolations, setSelectedViolations] = useState<ContentType[]>([])
  const [mode, setMode] = useState<ModeType>("view")
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])

  // Use the live messages hook and global flagged messages context
  const { messages: apiMessages, error, loading, fetchMessages, refreshAfterAnalysis } = useLiveMessages()
  const { flaggedMessageIds } = useFlaggedMessagesContext()

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    console.log('Manual refresh triggered');
    fetchMessages(true); // Force refresh
  }, [fetchMessages]);
  
  // Initial fetch on mount and optional fallback polling
  useEffect(() => {
    console.log('Performing initial fetch');
    fetchMessages(true);

    // Fallback refresh every 60 seconds (much less frequent than before)
    const fallbackInterval = setInterval(() => {
      console.log('Fallback refresh triggered');
      refreshAfterAnalysis(); // Use background refresh (no loading spinner)
    }, 60000); // Poll every 60 seconds as fallback

    return () => {
      clearInterval(fallbackInterval);
    };
  }, [fetchMessages, refreshAfterAnalysis]);

  // Convert API messages to ChatMessage format and filter out flagged messages
  // Only show messages when Bloom (experience_id: 1) is selected
  const chatMessages = useMemo(() => {
    // If not Bloom, return empty array
    if (selectedExperienceId !== 1) {
      return [];
    }
    
    return apiMessages
      .filter(msg => !flaggedMessageIds.has(msg.message_id)) // Filter out flagged messages using global context
      .map((msg): ChatMessage => ({
        id: msg.message_id,
        player_id: msg.player_id,
        player_name: msg.player_name,
        message: msg.message,
        avatar_url: '', // Will be fetched by CardsChat component
        timestamp: msg.created_at,
        role: UserRole.PLAYER, // Default role
        status: UserStatus.ONLINE, // Default status
        experience_id: 1, // All messages belong to Bloom
        priority_level: msg.moderation_action ? PriorityLevel.HIGH : undefined,
        content_types: msg.moderation_reason ? [ContentType.H] : undefined, // Use H for hate speech as generic violation
        safety_score: msg.sentiment_score
      }));
  }, [apiMessages, selectedExperienceId, flaggedMessageIds]);

  const filteredMessages = useMemo(() => {
    return chatMessages.filter((message) => {
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
  }, [chatMessages, selectedExperienceId, searchTerm, selectedPriorities, selectedViolations])

  const handlePriorityChange = (priority: string, checked: boolean) => {
    if (priority === "all") {
      if (checked) {
        setSelectedPriorities([]) // "All" means no specific filter
      }
      return
    }
    
    const priorityLevel = priority as PriorityLevel
    setSelectedPriorities(prev => 
      checked ? [...prev, priorityLevel] : prev.filter(p => p !== priorityLevel)
    )
  }

  const handleViolationChange = (violation: string, checked: boolean) => {
    if (violation === "all") {
      if (checked) {
        setSelectedViolations([]) // "All" means no specific filter
      }
      return
    }
    
    const contentType = violation as ContentType
    setSelectedViolations(prev => 
      checked ? [...prev, contentType] : prev.filter(v => v !== contentType)
    )
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedPriorities([])
    setSelectedViolations([])
  }

  const handleMessageSelect = (messageId: string, isSelected: boolean) => {
    setSelectedMessages(prev => 
      isSelected 
        ? [...prev, messageId]
        : prev.filter(id => id !== messageId)
    )
  }

  // Handle message removal by updating selected messages (flagged messages are auto-filtered by context)
  const handleMessageRemove = useCallback((messageId: string) => {
    // Remove from selected messages if it was selected
    setSelectedMessages(prev => prev.filter(id => id !== messageId))
  }, [])

  // Update mode and notify parent
  const handleModeChange = (newMode: ModeType) => {
    setMode(newMode)
    onModeChange?.(newMode)
    
    // Clear selections when leaving mod mode
    if (newMode !== 'mod') {
      setSelectedMessages([])
      onSelectedMessagesChange?.([])
    }
  }

  // Update selected messages in parent
  React.useEffect(() => {
    onSelectedMessagesChange?.(selectedMessages)
  }, [selectedMessages, onSelectedMessagesChange])

  // Clear selections when triggered by parent
  React.useEffect(() => {
    if (clearSelectionTrigger && clearSelectionTrigger > 0) {
      setSelectedMessages([])
    }
  }, [clearSelectionTrigger])

  const hasActiveFilters = searchTerm !== "" || selectedPriorities.length > 0 || selectedViolations.length > 0
  const totalActiveFilters = selectedPriorities.length + selectedViolations.length

  const getModeLabel = (mode: ModeType) => {
    switch (mode) {
      case "view": return "View"
      case "mod": return "Mod"
      case "auto-mod": return "Auto-Mod"
      default: return "View"
    }
  }

  return (
    <Card className="@container/card shadow-xs overflow-hidden h-full">
      <CardHeader className="space-y-4 p-4 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="font-clash text-lg font-medium">
            Live Chat Feed ({filteredMessages.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            {error && <span className="text-sm text-destructive">{error}</span>}
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={loading}
              size="sm"
              className="gap-1"
            >
              <IconRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search messages or players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filter and Mode Controls */}
          <div className="flex gap-2">
            {/* Combined Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <IconFilter className="h-4 w-4" />
                  Filter
                  {totalActiveFilters > 0 && (
                    <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
                      {totalActiveFilters}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {/* Priority Section */}
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                  Priority
                </div>
                {PRIORITY_FILTER_OPTIONS.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={option.value === "all" ? selectedPriorities.length === 0 : selectedPriorities.includes(option.value as PriorityLevel)}
                    onCheckedChange={(checked) => handlePriorityChange(option.value, !!checked)}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
                
                <DropdownMenuSeparator />
                
                {/* Violations Section */}
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                  Violations
                </div>
                {VIOLATION_FILTER_OPTIONS.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={option.value === "all" ? selectedViolations.length === 0 : selectedViolations.includes(option.value as ContentType)}
                    onCheckedChange={(checked) => handleViolationChange(option.value, !!checked)}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mode Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Mode: {getModeLabel(mode)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-32">
                <DropdownMenuRadioGroup value={mode} onValueChange={(value) => handleModeChange(value as ModeType)}>
                  <DropdownMenuRadioItem value="view">View</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="mod">Mod</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="auto-mod">Auto-Mod</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="gap-1">
                <IconX className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-4">
        <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
          {loading && apiMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Loading messages...
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {selectedExperienceId !== 1 
                ? "No live chat data available for this experience"
                : hasActiveFilters 
                  ? "No messages match the current filters" 
                  : "No messages found"
              }
            </div>
          ) : (
            filteredMessages.map((message) => (
              <CardsChat 
                key={message.id} 
                message={message} 
                onPlayerSelect={onPlayerSelect}
                mode={mode}
                isSelected={selectedMessages.includes(message.id)}
                onMessageSelect={handleMessageSelect}
                onRemove={handleMessageRemove}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}