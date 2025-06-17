"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { ChatMessage } from "../_data"
import { getPIIBadgeVariant, getContentBadgeVariant, getPriorityBadgeVariant } from "@/lib/colors-mod"
import type { ModeType } from "./live-chat-feed"

interface CardsChatProps {
  message: ChatMessage
  onPlayerSelect?: (message: ChatMessage) => void
  mode?: ModeType
  isSelected?: boolean
  onMessageSelect?: (messageId: string, isSelected: boolean) => void
}

export default function CardsChat({ message, onPlayerSelect, mode, isSelected, onMessageSelect }: CardsChatProps) {
  const timeAgo = new Date(message.timestamp).toLocaleTimeString()
  const priorityConfig = message.priority_level ? getPriorityBadgeVariant(message.priority_level) : null
  
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
            <AvatarImage src={message.avatar_url} alt={message.player_name} />
            <AvatarFallback className="text-xs font-medium">{message.player_name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-medium text-sm">{message.player_name}</span>
              <Badge 
                variant="secondary" 
                className="text-xs"
              >
                {message.role}
              </Badge>
              <span className="text-xs text-muted-foreground ml-auto font-medium">
                {timeAgo}
              </span>
            </div>
            
            <p className="text-sm mb-2 break-words leading-relaxed">{message.message}</p>
            
            <div className="flex flex-wrap gap-1">
              {priorityConfig && message.priority_level && (
                <Badge 
                  variant={priorityConfig.variant}
                  className={priorityConfig.className}
                >
                  <div className="h-1.5 w-1.5 rounded-full mr-2" style={{ backgroundColor: priorityConfig.dotColor }} />
                  {message.priority_level}
                </Badge>
              )}
              
              {message.content_types?.slice(0, 2).map((contentType) => {
                const config = getContentBadgeVariant(contentType)
                return (
                  <Badge 
                    key={contentType}
                    variant={config.variant}
                    className={`text-xs ${config.className}`}
                  >
                    <div className="h-1.5 w-1.5 rounded-full mr-2" style={{ backgroundColor: config.dotColor }} />
                    {contentType}
                  </Badge>
                )
              })}
              
              {message.pii_detected?.map((piiType) => {
                const config = getPIIBadgeVariant(piiType)
                return (
                  <Badge 
                    key={piiType}
                    variant={config.variant}
                    className={`text-xs ${config.className}`}
                  >
                    <div className="h-1.5 w-1.5 rounded-full mr-2" style={{ backgroundColor: config.dotColor }} />
                    PII: {piiType}
                  </Badge>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}