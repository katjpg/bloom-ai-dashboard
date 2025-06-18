"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconUsers, IconClock } from "@tabler/icons-react"
import { mockActiveUsers, mockExperiences } from "../_data"
import { usePlayersData } from "@/hooks/usePlayersData"
import { useAvatarHeadshot } from "@/hooks/useAvatarHeadshot"
import { useLiveMessages } from "@/hooks/useLiveMessages"
import { useMemo, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface ModInfoProps {
  selectedExperienceId?: number
}

// Component to render player with avatar
function PlayerItem({ player }: { player: any }) {
  const { url: avatarUrl, loading: avatarLoading } = useAvatarHeadshot(player.player_id?.toString())
  
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors border border-border/30">
      <Avatar className="h-8 w-8 flex-shrink-0">
        {avatarUrl && <AvatarImage src={avatarUrl} alt={player.player_name} />}
        <AvatarFallback className="text-xs font-medium">
          {avatarLoading ? '...' : player.player_name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm truncate">{player.player_name}</span>
          <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted/60">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          ID: <span className="tabular-nums">{player.player_id}</span>
        </div>
      </div>
    </div>
  )
}

export default function ModInfo({ selectedExperienceId = 1 }: ModInfoProps) {
  const selectedExperience = mockExperiences.find(exp => exp.id === selectedExperienceId) || mockExperiences[0]
  const { players: apiPlayers, loading: playersLoading } = usePlayersData()
  const { messages: liveMessages, loading: messagesLoading, fetchMessages } = useLiveMessages()
  
  const loading = playersLoading || messagesLoading
  
  // Fetch messages on mount for Bloom
  useEffect(() => {
    if (selectedExperienceId === 1) {
      fetchMessages(true)
    }
  }, [selectedExperienceId, fetchMessages])
  
  // Use real API data for Bloom (id: 1), empty for others
  const experienceActiveUsers = useMemo(() => {
    if (selectedExperienceId === 1) {
      // For Bloom, use real API data - show last 10 active players
      return apiPlayers.slice(0, 10).map(player => ({
        id: player.player_id,
        player_id: player.player_id,
        player_name: player.player_name,
        avatar_url: '', // Will be fetched by PlayerItem
        status: 'ACTIVE',
        role: 'MEMBER',
        experience_id: 1,
        join_time: ''
      }))
    } else {
      // For other experiences, return empty array
      return []
    }
  }, [selectedExperienceId, apiPlayers])
  
  // Calculate real player count and last updated for Bloom
  const playerCount = selectedExperienceId === 1 ? apiPlayers.length : 0
  
  // Calculate last activity based on most recent message
  const lastUpdated = useMemo(() => {
    if (selectedExperienceId !== 1) return 'No recent activity'
    
    if (liveMessages.length === 0) return 'No recent activity'
    
    // Get the most recent message timestamp
    const mostRecentMessage = liveMessages[0]
    if (!mostRecentMessage || !mostRecentMessage.created_at) return 'No recent activity'
    
    try {
      const messageTime = new Date(mostRecentMessage.created_at)
      const now = new Date()
      const diffMs = now.getTime() - messageTime.getTime()
      const diffSeconds = Math.floor(diffMs / 1000)
      const diffMinutes = Math.floor(diffSeconds / 60)
      const diffHours = Math.floor(diffMinutes / 60)
      const diffDays = Math.floor(diffHours / 24)
      
      if (diffSeconds < 60) return 'Just now'
      if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`
      if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
    } catch (e) {
      console.error('Error parsing message timestamp:', e)
      return 'No recent activity'
    }
  }, [selectedExperienceId, liveMessages])
  
  return (
    <Card className="@container/card shadow-xs overflow-hidden">
      <CardContent className="space-y-4 p-4">
        {/* Experience Info Section */}
        <div className="space-y-3">
          {/* Experience Thumbnail */}
          <div className="relative aspect-video bg-gradient-to-br from-muted/30 to-muted/50 w-full rounded-lg overflow-hidden border border-border/40">
            <div className="absolute inset-0 bg-muted/60 flex items-center justify-center">
              <div className="text-muted-foreground text-sm font-medium">Experience Thumbnail</div>
            </div>
            
            {/* Live Indicator */}
            {selectedExperience.isActive && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1.5 bg-green-500/90 text-white text-xs px-2.5 py-1.5 rounded-full backdrop-blur-sm font-medium">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Live
                </div>
              </div>
            )}
          </div>
          
          {/* Experience Stats */}
          <div className="space-y-1.5">
            <h3 className="font-clash font-semibold text-lg line-clamp-1">{selectedExperience.title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <IconUsers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {loading && selectedExperienceId === 1 ? (
                  <Skeleton className="h-4 w-8" />
                ) : (
                  <span className="font-medium tabular-nums">{playerCount.toLocaleString()}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <IconClock className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                {loading && selectedExperienceId === 1 ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <span className="font-medium">{lastUpdated}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/60" />

        {/* Active Users Section */}
        <div className="space-y-3">
          <h4 className="font-clash text-base font-medium">
            Active Users {loading && selectedExperienceId === 1 ? '' : `(${experienceActiveUsers.length})`}
          </h4>
          <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
            {loading && selectedExperienceId === 1 ? (
              // Loading skeletons for Bloom
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 border border-border/30">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))
            ) : experienceActiveUsers.length === 0 ? (
              // Empty state for non-Bloom experiences
              <div className="text-center py-8 text-muted-foreground text-sm">
                {selectedExperienceId === 1 ? "No active users found" : "No chat activity for this experience"}
              </div>
            ) : (
              // Render actual players
              experienceActiveUsers.map((user) => (
                <PlayerItem key={user.id} player={user} />
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}