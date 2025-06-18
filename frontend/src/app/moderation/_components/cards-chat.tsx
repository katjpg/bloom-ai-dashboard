"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { ChatMessage } from "../_data"
import type { ModeType } from "./live-chat-feed"
import { useAvatarHeadshot } from "@/hooks/useAvatarHeadshot"

interface CardsChatProps {
  message: ChatMessage
  onPlayerSelect?: (message: ChatMessage) => void
  mode?: ModeType
  isSelected?: boolean
  onMessageSelect?: (messageId: string, isSelected: boolean) => void
}

export default function CardsChat({ message, onPlayerSelect, mode, isSelected, onMessageSelect }: CardsChatProps) {
  const timeAgo = new Date(message.timestamp).toLocaleTimeString()
  
  // Fetch avatar URL for the player
  const { url: avatarUrl, loading: avatarLoading } = useAvatarHeadshot(message.player_id?.toString())
  
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
    <Card 
      className={`@container/card shadow-xs overflow-hidden ${mode === 'mod' ? 'cursor-pointer hover:bg-muted/30 transition-colors' : onPlayerSelect ? 'cursor-pointer hover:bg-muted/30 transition-colors' : ''}`}
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
            
            <p className="text-sm break-words leading-relaxed">{message.message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}