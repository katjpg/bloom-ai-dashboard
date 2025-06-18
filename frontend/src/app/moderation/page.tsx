"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import LiveChatFeed, { ModeType } from "./_components/live-chat-feed"
import ModInfo from "./_components/mod-info"
import ModActions from "./_components/mod-actions"
import PlayerInfo from "./_components/player-info"
import { mockExperiences, ChatMessage, generateHistoryEntry } from "./_data"
import { useModerationHistory } from "@/contexts/moderation-history-context"
import { useLiveMessages } from "@/hooks/useLiveMessages"
import { useEffect } from "react"

export default function ModerationPage() {
  const [selectedExperienceId, setSelectedExperienceId] = useState<number>(1)
  const [selectedPlayer, setSelectedPlayer] = useState<ChatMessage | null>(null)
  const [mode, setMode] = useState<ModeType>("view")
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [clearTrigger, setClearTrigger] = useState(0)
  const { addHistoryEntries } = useModerationHistory()
  const { messages: liveMessages, fetchMessages } = useLiveMessages()

  // Fetch messages on mount
  useEffect(() => {
    fetchMessages(true)
  }, [fetchMessages])

  const handlePlayerSelect = (message: ChatMessage) => {
    // Only select player in view mode
    if (mode === 'view') {
      setSelectedPlayer(message)
    }
  }

  const handleClosePlayerInfo = () => {
    setSelectedPlayer(null)
  }

  const handlePlayerAction = (action: string, playerId: number) => {
    console.log(`Action ${action} on player ${playerId}`)
    // Here you would typically call an API to perform the moderation action
  }

  const handleModAction = async (action: string, options?: any) => {
    console.log(`Mod action ${action} on ${selectedMessages.length} messages`, options)
    
    try {
      // Convert live API messages to ChatMessage format for history generation
      const selectedMessagesWithData: ChatMessage[] = liveMessages
        .filter(msg => selectedMessages.includes(msg.message_id))
        .map(msg => ({
          id: msg.message_id,
          player_id: msg.player_id,
          player_name: msg.player_name,
          message: msg.message,
          avatar_url: '',
          timestamp: msg.created_at,
          role: 'PLAYER' as any,
          status: 'ONLINE' as any,
          experience_id: selectedExperienceId,
          priority_level: msg.moderation_action ? 'HIGH' as any : undefined,
          content_types: msg.moderation_reason ? ['H'] as any : undefined,
          safety_score: msg.sentiment_score
        }))
      
      if (selectedMessagesWithData.length === 0) {
        throw new Error('No valid messages selected')
      }
      
      // Get current experience
      const currentExperience = mockExperiences.find(exp => exp.id === selectedExperienceId)
      if (!currentExperience) {
        throw new Error('Current experience not found')
      }
      
      // Generate history entries (one per unique user)
      const historyEntries = generateHistoryEntry({
        action,
        options,
        selectedMessages: selectedMessagesWithData,
        moderator: "CurrentModerator", // This would come from auth context
        experience: currentExperience
      })
      
      // Add all entries to history context (newest first)
      addHistoryEntries(historyEntries)
      
      // Simulate API call
      return new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Failed to create history entry:', error)
      // Still simulate the action for now
      return new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  const handleClearSelection = () => {
    setSelectedMessages([])
    setClearTrigger(prev => prev + 1)
  }

  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      {/* Header Section */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-clash text-3xl font-medium">
            Moderation
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage live chat interactions
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

      {/* Main Content - No tabs needed */}
      {selectedPlayer && mode === 'view' ? (
        /* Player Info Mode - Responsive Layout */
        <div className="grid grid-cols-1 @3xl/page:grid-cols-3 gap-6">
          {/* Main chat feed */}
          <div className="@3xl/page:col-span-2">
            <LiveChatFeed 
              selectedExperienceId={selectedExperienceId} 
              onPlayerSelect={handlePlayerSelect}
              onModeChange={setMode}
              onSelectedMessagesChange={setSelectedMessages}
              clearSelectionTrigger={clearTrigger}
            />
          </div>

          {/* Player info - goes underneath on smaller screens */}
          <div className="@3xl/page:col-span-1">
            <PlayerInfo 
              selectedPlayer={selectedPlayer}
              onClose={handleClosePlayerInfo}
              onPlayerAction={handlePlayerAction}
            />
          </div>
        </div>
      ) : (
        /* Default Mode - Standard Layout */
        <div className="grid grid-cols-1 @3xl/page:grid-cols-3 gap-6">
          {/* Main chat feed */}
          <div className="@3xl/page:col-span-2">
            <LiveChatFeed 
              selectedExperienceId={selectedExperienceId} 
              onPlayerSelect={handlePlayerSelect}
              onModeChange={setMode}
              onSelectedMessagesChange={setSelectedMessages}
              clearSelectionTrigger={clearTrigger}
            />
          </div>

          {/* Sidebar - ModActions when in mod mode, ModInfo otherwise */}
          <div className="@3xl/page:col-span-1">
            {mode === 'mod' ? (
              <ModActions
                selectedCount={selectedMessages.length}
                onClearSelection={handleClearSelection}
                onExecuteAction={handleModAction}
              />
            ) : (
              <ModInfo selectedExperienceId={selectedExperienceId} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}