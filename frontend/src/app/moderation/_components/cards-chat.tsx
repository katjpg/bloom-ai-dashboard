"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { IconFlag } from "@tabler/icons-react"
import { ChatMessage } from "../_data"
import type { ModeType } from "./live-chat-feed"
import { useAvatarHeadshot } from "@/hooks/useAvatarHeadshot"
import { useFlaggedMessagesContext } from "@/contexts/flagged-messages-context"
import { useState, useEffect } from "react"

interface CardsChatProps {
  message: ChatMessage
  onPlayerSelect?: (message: ChatMessage) => void
  mode?: ModeType
  isSelected?: boolean
  onMessageSelect?: (messageId: string, isSelected: boolean) => void
  onRemove?: (messageId: string) => void
}

export default function CardsChat({ message, onPlayerSelect, mode, isSelected, onMessageSelect, onRemove }: CardsChatProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const { flagMessage, isFlagged, isFlagging } = useFlaggedMessagesContext()
  
  const messageFlagged = isFlagged(message.id)
  const messageBeingFlagged = isFlagging(message.id)
  
  const timeAgo = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
  
  // Fetch avatar URL for the player
  const { url: avatarUrl, loading: avatarLoading } = useAvatarHeadshot(message.player_id?.toString())
  
  const handleFlag = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    
    if (messageFlagged || messageBeingFlagged || isRemoving) return
    
    try {
      await flagMessage(message.id, "User flagged message")
      setIsRemoving(true)
      console.log('Message flagged successfully:', message.id)
      
      // Trigger smooth fade out animation, then notify parent
      setTimeout(() => {
        onRemove?.(message.id)
      }, 600) // Smooth fade duration
    } catch (error) {
      console.error('Failed to flag message:', error)
      setIsRemoving(false)
    }
  }
  
  const handleCheckboxChange = (checked: boolean) => {
    onMessageSelect?.(message.id, checked)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't handle click if it's on the checkbox itself
    if ((e.target as HTMLElement).closest('[data-checkbox]')) {
      return
    }
    
    // In mod mode, clicking anywhere on the card toggles selection
    if (mode === 'mod') {
      handleCheckboxChange(!isSelected)
      return
    }
    // In view mode, select the player
    onPlayerSelect?.(message)
  }
  
  return (
    <div className={`transition-all duration-600 ease-out ${
      isRemoving ? 'opacity-0 max-h-0 py-0 my-0' : 'opacity-100 max-h-96 py-1 my-1'
    }`}>
      <Card 
        className={`@container/card shadow-xs overflow-hidden transition-all duration-500 ease-out ${
          isRemoving ? 'opacity-30 scale-98' : 'opacity-100 scale-100'
        } ${mode === 'mod' ? 'cursor-pointer hover:bg-muted/30 transition-colors' : onPlayerSelect ? 'cursor-pointer hover:bg-muted/30 transition-colors' : ''}`}
        onClick={handleCardClick}
      >
      <CardContent>
        <div className="flex items-start gap-3">
          {mode === 'mod' && (
            <div className="flex items-center pt-4" data-checkbox>
              <Checkbox
                checked={isSelected}
                onCheckedChange={handleCheckboxChange}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
            </div>
          )}
          <Avatar className="h-12 w-12 flex-shrink-0">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={message.player_name} />}
            <AvatarFallback className="text-xs font-medium">
              {avatarLoading ? '...' : message.player_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-medium text-sm">{message.player_name}</span>
              {message.safety_score !== undefined && (
                <Badge 
                  variant="outline"
                  className={`text-xs font-semibold ${
                    message.safety_score >= 75 ? 'bg-green-500/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-800' : 
                    message.safety_score >= 25 ? 'bg-green-300/10 text-green-600 border-green-200 dark:text-green-500 dark:border-green-800' :
                    message.safety_score > -25 ? 'bg-gray-300/10 text-gray-600 border-gray-200 dark:text-gray-400 dark:border-gray-800' :
                    message.safety_score > -75 ? 'bg-red-300/10 text-red-600 border-red-200 dark:text-red-500 dark:border-red-800' :
                    'bg-red-500/10 text-red-700 border-red-200 dark:text-red-400 dark:border-red-800'
                  }`}
                >
                  {message.safety_score > 0 ? '+' : ''}{message.safety_score}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground ml-auto font-medium">
                {timeAgo}
              </span>
            </div>
            
            {/* Message content and flag button on same line */}
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm break-words leading-relaxed flex-1">{message.message}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFlag}
                disabled={messageFlagged || messageBeingFlagged || isRemoving}
                className={`h-6 px-2 text-xs gap-1 flex-shrink-0 transition-all duration-300 ${
                  messageFlagged 
                    ? 'text-red-600 bg-red-50 hover:bg-red-50 dark:text-red-400 dark:bg-red-950/30' 
                    : 'text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/30'
                }`}
              >
                <IconFlag className={`h-3 w-3 ${messageBeingFlagged || isRemoving ? 'animate-pulse' : ''}`} />
                {messageFlagged ? 'Flagged' : messageBeingFlagged ? 'Flagging...' : isRemoving ? 'Removing...' : 'Flag'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}