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
import LiveChatFeed, { ModeType } from "./_components/live-chat-feed"
import ModInfo from "./_components/mod-info"
import ModActions from "./_components/mod-actions"
import PlayerInfo from "./_components/player-info"
import { mockExperiences, ChatMessage } from "./_data"

export default function ModerationPage() {
  const [selectedExperienceId, setSelectedExperienceId] = useState<number>(1)
  const [selectedPlayer, setSelectedPlayer] = useState<ChatMessage | null>(null)
  const [mode, setMode] = useState<ModeType>("view")
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [clearTrigger, setClearTrigger] = useState(0)

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

  const handleModAction = (action: string, options?: any) => {
    console.log(`Mod action ${action} on ${selectedMessages.length} messages`, options)
    // Here you would typically call an API to perform the moderation action
    // For now, just simulate the action
    return new Promise((resolve) => setTimeout(resolve, 1000))
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

      {/* Navigation Tabs */}
      <Tabs defaultValue="live-chat" className="gap-6">
        <TabsList className="w-full @3xl/page:w-fit">
          <TabsTrigger value="live-chat">Live Chat</TabsTrigger>
          <TabsTrigger value="mod-history" disabled>
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live-chat" className="flex flex-col gap-6">
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
        </TabsContent>

        <TabsContent value="mod-history" className="flex flex-col gap-6">
          <div className="text-center text-muted-foreground py-8">
            History
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}