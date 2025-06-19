"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { IconAlertTriangle, IconVolumeOff, IconUserX, IconBan, IconX, IconMessage, IconFlag, IconShield, IconArrowLeft, IconClock } from "@tabler/icons-react"
import { ChatMessage, UserStatus } from "../_data"
import { getActionBadgeVariant, ActionType } from "@/lib/colors-mod"
import { useAvatarHeadshot } from "@/hooks/useAvatarHeadshot"
import { usePlayerStats } from "@/hooks/usePlayerStats"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useMemo, useEffect } from "react"
import { sentimentApi } from "@/lib/api/sentiment"
import { Message } from "@/types/sentiment"

interface PlayerInfoProps {
  selectedPlayer: ChatMessage
  onClose: () => void
  onPlayerAction?: (action: string, playerId: number) => void
}

type DetailView = 'overview' | 'messages' | 'flagged' | 'violations'

// Helper function for sentiment color
const getSentimentColor = (score: number) => {
  if (score >= 75) return 'bg-green-500/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-800'
  if (score >= 25) return 'bg-green-300/10 text-green-600 border-green-200 dark:text-green-500 dark:border-green-800'
  if (score > -25) return 'bg-gray-300/10 text-gray-600 border-gray-200 dark:text-gray-400 dark:border-gray-800'
  if (score > -75) return 'bg-red-300/10 text-red-600 border-red-200 dark:text-red-500 dark:border-red-800'
  return 'bg-red-500/10 text-red-700 border-red-200 dark:text-red-400 dark:border-red-800'
}

export default function PlayerInfo({ selectedPlayer, onClose, onPlayerAction }: PlayerInfoProps) {
  const isOnline = selectedPlayer.status === UserStatus.ONLINE
  const [currentView, setCurrentView] = useState<DetailView>('overview')
  const [playerMessages, setPlayerMessages] = useState<Message[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  
  // Fetch avatar URL for the player
  const { url: avatarUrl, loading: avatarLoading } = useAvatarHeadshot(selectedPlayer.player_id?.toString())
  
  // Fetch real player statistics
  const { stats: playerStats, loading: statsLoading } = usePlayerStats(selectedPlayer.player_id)
  
  // Mock member since date - in real app this would come from player data
  const memberSince = "March 2023"
  
  // Reset data when player changes
  useEffect(() => {
    setPlayerMessages([])
    setCurrentView('overview')
  }, [selectedPlayer.player_id])

  // Function to fetch detailed messages
  const fetchPlayerMessages = async () => {
    if (playerMessages.length > 0) return // Already fetched
    
    setLoadingMessages(true)
    try {
      const messages = await sentimentApi.getMessages({ player_id: selectedPlayer.player_id })
      setPlayerMessages(messages)
    } catch (error) {
      console.error('Failed to fetch player messages:', error)
    } finally {
      setLoadingMessages(false)
    }
  }
  
  // Filter messages based on current view
  const filteredMessages = useMemo(() => {
    switch (currentView) {
      case 'messages':
        return playerMessages
      case 'flagged':
        return playerMessages.filter(msg => 
          msg.moderation_action || msg.sentiment_score < -25
        )
      case 'violations':
        return playerMessages.filter(msg => 
          msg.moderation_action && msg.moderation_action !== 'approved'
        )
      default:
        return []
    }
  }, [playerMessages, currentView])
  
  // Handle clicking on stat items
  const handleStatClick = async (view: DetailView) => {
    if (view !== 'overview') {
      await fetchPlayerMessages()
    }
    setCurrentView(view)
  }
  
  // Get action button styling configurations
  const warningConfig = getActionBadgeVariant(ActionType.WARNING)
  const muteConfig = getActionBadgeVariant(ActionType.MUTE)
  const kickConfig = getActionBadgeVariant(ActionType.KICK)
  const banConfig = getActionBadgeVariant(ActionType.BAN)
  
  const handleAction = (action: string) => {
    if (onPlayerAction) {
      onPlayerAction(action, selectedPlayer.player_id)
    }
  }

  // Render detail view header
  const renderDetailHeader = (title: string, icon: React.ReactNode) => (
    <div className="mb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrentView('overview')}
        className="h-7 px-2 py-0 hover:bg-muted/50 flex items-center gap-1 mb-3"
      >
        <IconArrowLeft className="h-3.5 w-3.5" />
        <span className="text-sm">Back</span>
      </Button>
      <div className="flex items-center gap-2 justify-center">
        {icon}
        <h3 className="font-clash font-semibold text-lg">{title}</h3>
      </div>
    </div>
  )

  // Render message item
  const renderMessageItem = (message: Message, showViolations = false) => (
    <div key={message.message_id} className="border border-border/40 rounded-lg p-3 space-y-3">
      {/* Header with avatar, username, and sentiment */}
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-[#009982] ring-offset-2 ring-offset-background">
          <AvatarImage src={avatarUrl || undefined} alt={selectedPlayer.player_name} />
          <AvatarFallback className="text-xs font-medium">
            {selectedPlayer.player_name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-medium text-sm">{selectedPlayer.player_name}</span>
            <Badge 
              variant="outline"
              className={`text-xs font-semibold shrink-0 ${getSentimentColor(message.sentiment_score)}`}
            >
              {message.sentiment_score > 0 ? '+' : ''}{message.sentiment_score}
            </Badge>
          </div>
          
          {/* Message content */}
          <p className="text-sm break-words leading-relaxed">{message.message}</p>
          
          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <IconClock className="h-3 w-3" />
            <span>{new Date(message.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {showViolations && message.moderation_action && (
        <div className="pt-2 border-t border-border/30">
          <div className="flex items-center gap-2 mb-1">
            <IconShield className="h-3 w-3 text-red-600" />
            <span className="text-xs font-medium text-red-600">Violation Details</span>
          </div>
          <div className="space-y-1">
            <Badge variant="destructive" className="text-xs">
              {message.moderation_action}
            </Badge>
            {message.moderation_reason && (
              <p className="text-xs text-muted-foreground">
                <strong>Reason:</strong> {message.moderation_reason}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <Card className="@container/card shadow-xs overflow-hidden">
      <CardContent className="space-y-4 relative p-4">
        {/* Close Button - Only show on overview */}
        {currentView === 'overview' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-3 right-3 h-7 w-7 p-0 hover:bg-muted/50 z-10"
          >
            <IconX className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* Conditional Content Based on Current View */}
        {currentView === 'overview' ? (
          <>
            {/* Player Profile Section */}
            <div className="pt-2 text-center space-y-3">
              <div className="relative inline-block">
                <Avatar className="h-14 w-14 @sm:h-16 @sm:w-16 mx-auto ring-2 ring-[#009982] ring-offset-2 ring-offset-background">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={selectedPlayer.player_name} />}
                  <AvatarFallback className="text-sm font-medium">
                    {avatarLoading ? '...' : selectedPlayer.player_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Activity Status Indicator */}
                <div 
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background ${
                    isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
              </div>
              
              <div className="space-y-0.5 min-w-0">
                <h3 className="font-clash font-semibold text-lg line-clamp-1">{selectedPlayer.player_name}</h3>
                <p className="text-xs text-muted-foreground">ID: {selectedPlayer.player_id}</p>
                <p className="text-xs text-muted-foreground">Member since {memberSince}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Detail View Content */}
            {currentView === 'messages' && renderDetailHeader('All Messages', <IconMessage className="h-5 w-5 text-blue-600" />)}
            {currentView === 'flagged' && renderDetailHeader('Flagged Messages', <IconFlag className="h-5 w-5 text-orange-600" />)}
            {currentView === 'violations' && renderDetailHeader('Violations', <IconShield className="h-5 w-5 text-red-600" />)}
          </>
        )}

        {/* Content based on current view */}
        {currentView === 'overview' ? (
          <>
            {/* Divider */}
            <div className="border-t border-border/60" />

            {/* Activity Section */}
            <div className="space-y-3">
              <h4 className="font-clash text-base font-medium">Activity</h4>
              
              {/* Recent Message */}
              <div className="space-y-2">
                <div className="bg-muted/30 rounded-lg p-3 border border-border/40">
                  <div className="mb-1.5">
                    <span className="text-xs text-muted-foreground font-medium">
                      {new Date(selectedPlayer.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm break-words leading-relaxed">{selectedPlayer.message}</p>
                </div>
              </div>

              {/* Quick Stats List */}
              <div className="space-y-2">
                <button 
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors rounded-lg border border-border/40"
                  onClick={() => handleStatClick('messages')}
                >
                  <IconMessage className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="flex-1 text-left font-medium text-sm">Messages</span>
                  <div className="flex items-center gap-2">
                    {statsLoading ? (
                      <Skeleton className="h-5 w-8" />
                    ) : (
                      <span className="text-base font-semibold tabular-nums">{playerStats.totalMessages}</span>
                    )}
                    <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </button>
                
                <button 
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors rounded-lg border border-border/40"
                  onClick={() => handleStatClick('flagged')}
                >
                  <IconFlag className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                  <span className="flex-1 text-left font-medium text-sm">Flagged</span>
                  <div className="flex items-center gap-2">
                    {statsLoading ? (
                      <Skeleton className="h-5 w-8" />
                    ) : (
                      <span className="text-base font-semibold tabular-nums">{playerStats.flaggedMessages}</span>
                    )}
                    <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </button>
                
                <button 
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors rounded-lg border border-border/40"
                  onClick={() => handleStatClick('violations')}
                >
                  <IconShield className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <span className="flex-1 text-left font-medium text-sm">Violations</span>
                  <div className="flex items-center gap-2">
                    {statsLoading ? (
                      <Skeleton className="h-5 w-8" />
                    ) : (
                      <span className="text-base font-semibold tabular-nums">{playerStats.violations}</span>
                    )}
                    <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Detail View - Messages List */}
            <div className="space-y-3">
              {loadingMessages ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border border-border/40 rounded-lg p-3 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  ))}
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No {currentView} found for this player
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {filteredMessages.map((message) => 
                      renderMessageItem(message, currentView === 'violations')
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          </>
        )}

        {/* Actions Section - Only show on overview */}
        {currentView === 'overview' && (
          <>
            {/* Divider */}
            <div className="border-t border-border/60" />

            {/* Actions Section */}
            <div className="space-y-3">
              <h4 className="font-clash text-base font-medium">Actions</h4>
              
              <div className="grid grid-cols-4 gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={warningConfig.variant}
                      size="sm"
                      className={`h-11 w-full p-0 ${warningConfig.className} shadow-none font-medium`}
                      onClick={() => handleAction('WARNING')}
                    >
                      <IconAlertTriangle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{warningConfig.label}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={muteConfig.variant}
                      size="sm"
                      className={`h-11 w-full p-0 ${muteConfig.className} shadow-none font-medium`}
                      onClick={() => handleAction('MUTE')}
                    >
                      <IconVolumeOff className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{muteConfig.label}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={kickConfig.variant}
                      size="sm"
                      className={`h-11 w-full p-0 ${kickConfig.className} shadow-none font-medium`}
                      onClick={() => handleAction('KICK')}
                    >
                      <IconUserX className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{kickConfig.label}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={banConfig.variant}
                      size="sm"
                      className={`h-11 w-full p-0 ${banConfig.className} shadow-none font-medium`}
                      onClick={() => handleAction('BAN')}
                    >
                      <IconBan className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{banConfig.label}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}