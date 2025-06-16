"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, VolumeX, UserX, Ban, X, MessageSquare, Flag, ShieldAlert } from "lucide-react"
import { ChatMessage, UserStatus } from "../_data"
import { getActionBadgeVariant, getPriorityBadgeVariant, ActionType } from "@/lib/colors-mod"

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
    <Card className="@container">
      <CardContent className="space-y-6 relative">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Player Profile Section */}
        <div className="pt-8 text-center space-y-4">
          <div className="relative inline-block">
            <Avatar className="h-20 w-20 mx-auto">
              <AvatarImage src={selectedPlayer.avatar_url} alt={selectedPlayer.player_name} />
              <AvatarFallback className="text-lg">
                {selectedPlayer.player_name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Activity Status Indicator */}
            <div 
              className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-background ${
                isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
          </div>
          
          <div className="space-y-1">
            <h3 className="font-clash font-semibold text-xl">{selectedPlayer.player_name}</h3>
            <p className="text-sm text-muted-foreground">ID: {selectedPlayer.player_id}</p>
            <p className="text-xs text-muted-foreground">Member since {memberSince}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Activity Section */}
        <div className="space-y-4">
          <h4 className="font-clash text-lg font-medium">Activity</h4>
          
          {/* Recent Message */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-muted-foreground">Recent Message</h5>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(selectedPlayer.timestamp).toLocaleString()}
                </span>
                {selectedPlayer.priority_level && (
                  <Badge 
                    variant={getPriorityBadgeVariant(selectedPlayer.priority_level).variant}
                    className={`text-xs ${getPriorityBadgeVariant(selectedPlayer.priority_level).className}`}
                  >
                    {selectedPlayer.priority_level}
                  </Badge>
                )}
              </div>
              <p className="text-sm break-words">{selectedPlayer.message}</p>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-muted/50 hover:bg-muted/70 transition-colors rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-lg font-semibold">{playerStats.messages}</div>
              <div className="text-xs text-muted-foreground">Messages</div>
            </button>
            
            <button className="bg-muted/50 hover:bg-muted/70 transition-colors rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Flag className="h-4 w-4 text-orange-500" />
              </div>
              <div className="text-lg font-semibold">{playerStats.flagged}</div>
              <div className="text-xs text-muted-foreground">Flagged</div>
            </button>
            
            <button className="bg-muted/50 hover:bg-muted/70 transition-colors rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShieldAlert className="h-4 w-4 text-red-500" />
              </div>
              <div className="text-lg font-semibold">{playerStats.violations}</div>
              <div className="text-xs text-muted-foreground">Violations</div>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Actions Section */}
        <div className="space-y-4">
          <h4 className="font-clash text-lg font-medium">Actions</h4>
          
          <div className="flex justify-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={warningConfig.variant}
                  size="lg"
                  className={`h-12 w-12 p-0 ${warningConfig.className}`}
                  onClick={() => handleAction('WARNING')}
                >
                  <AlertTriangle className="h-5 w-5" />
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
                  size="lg"
                  className={`h-12 w-12 p-0 ${muteConfig.className}`}
                  onClick={() => handleAction('MUTE')}
                >
                  <VolumeX className="h-5 w-5" />
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
                  size="lg"
                  className={`h-12 w-12 p-0 ${kickConfig.className}`}
                  onClick={() => handleAction('KICK')}
                >
                  <UserX className="h-5 w-5" />
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
                  size="lg"
                  className={`h-12 w-12 p-0 ${banConfig.className}`}
                  onClick={() => handleAction('BAN')}
                >
                  <Ban className="h-5 w-5" />
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