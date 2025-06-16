"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChatMessage } from "../_data"
import { getPIIBadgeVariant, getContentBadgeVariant, getPriorityBadgeVariant } from "@/lib/colors-mod"

interface CardsChatProps {
  message: ChatMessage
  onPlayerSelect?: (message: ChatMessage) => void
}

export default function CardsChat({ message, onPlayerSelect }: CardsChatProps) {
  const timeAgo = new Date(message.timestamp).toLocaleTimeString()
  const priorityConfig = message.priority_level ? getPriorityBadgeVariant(message.priority_level) : null
  
  return (
    <Card 
      className={`@container/card shadow-xs overflow-hidden ${onPlayerSelect ? 'cursor-pointer hover:bg-muted/30 transition-colors' : ''}`}
      onClick={() => onPlayerSelect?.(message)}
    >
      <CardContent>
        <div className="flex items-start gap-3">
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