"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, VolumeX, UserX, Ban, X, MessageSquare, Flag, ShieldAlert } from "lucide-react"
import { ChatMessage, UserStatus } from "../_data"
import { getActionBadgeVariant, ActionType } from "@/lib/colors-mod"

interface PlayerInfoProps {
  selectedPlayer: ChatMessage
  onClose: () => void
  onPlayerAction?: (action: string, playerId: number) => void
}

export default function PlayerInfo({ selectedPlayer, onClose, onPlayerAction }: PlayerInfoProps) {
  const isOnline = selectedPlayer.status === UserStatus.ONLINE
  
  // Mock data for player stats (will be integrating API later on)
  const playerStats = {
    messages: 42,
    flagged: 3,
    violations: 1
  }
  
  // Mock member since date - in real app this would come from player data
  const memberSince = "March 2023"
  
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

  return (
    <Card className="@container/card shadow-xs overflow-hidden">
      <CardContent className="space-y-4 relative p-4">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-3 right-3 h-7 w-7 p-0 hover:bg-muted/50 z-10"
        >
          <X className="h-3.5 w-3.5" />
        </Button>

        {/* Player Profile Section */}
        <div className="pt-2 text-center space-y-3">
          <div className="relative inline-block">
            <Avatar className="h-14 w-14 @sm:h-16 @sm:w-16 mx-auto">
              <AvatarImage src={selectedPlayer.avatar_url} alt={selectedPlayer.player_name} />
              <AvatarFallback className="text-sm font-medium">
                {selectedPlayer.player_name.split(' ').map(n => n[0]).join('').toUpperCase()}
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
            <button className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors rounded-lg border border-border/40">
              <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="flex-1 text-left font-medium text-sm">Messages</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tabular-nums">{playerStats.messages}</span>
                <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors rounded-lg border border-border/40">
              <Flag className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <span className="flex-1 text-left font-medium text-sm">Flagged</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tabular-nums">{playerStats.flagged}</span>
                <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors rounded-lg border border-border/40">
              <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="flex-1 text-left font-medium text-sm">Violations</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tabular-nums">{playerStats.violations}</span>
                <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

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
                  <AlertTriangle className="h-4 w-4" />
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
                  <VolumeX className="h-4 w-4" />
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
                  <UserX className="h-4 w-4" />
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
                  <Ban className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{banConfig.label}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}