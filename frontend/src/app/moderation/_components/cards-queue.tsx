"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  IconClock,
  IconAlertTriangle,
  IconShield,
  IconEye,
  IconUser,
  IconFileText,
  IconWorld
} from "@tabler/icons-react"
import { 
  PriorityLevel, 
  ContentType,
  getPriorityBadgeVariant,
  getContentBadgeVariant
} from "@/lib/colors-mod"
import { QueueItem } from "@/hooks/useQueue"

interface CardsQueueProps {
  item: QueueItem
  onReview?: (itemId: string) => void
  onResolve?: (itemId: string) => void
  onDismiss?: (itemId: string) => void
  mode?: "view" | "select"
  isSelected?: boolean
  onItemSelect?: (itemId: string, isSelected: boolean) => void
}

export default function CardsQueue({ 
  item, 
  onReview, 
  onResolve, 
  onDismiss,
  mode = "view",
  isSelected = false,
  onItemSelect
}: CardsQueueProps) {
  const priorityConfig = getPriorityBadgeVariant(item.priority)
  
  const getPriorityIcon = (priority: PriorityLevel) => {
    switch (priority) {
      case PriorityLevel.CRITICAL:
        return <IconAlertTriangle className="h-5 w-5" />
      case PriorityLevel.HIGH:
        return <IconShield className="h-5 w-5" />
      default:
        return <IconClock className="h-5 w-5" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "message":
        return <IconFileText className="h-5 w-5" />
      case "user":
        return <IconUser className="h-5 w-5" />
      case "experience":
        return <IconWorld className="h-5 w-5" />
      default:
        return <IconFileText className="h-5 w-5" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    onItemSelect?.(item.id, checked)
  }

  return (
    <div 
      className={`
        group relative rounded-xl border bg-card transition-all hover:shadow-md
        ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'hover:border-muted-foreground/30'}
      `}
    >
      {/* Header Section */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left side - Main content */}
          <div className="flex items-start gap-4 flex-1">
            {/* Selection Checkbox */}
            {mode === "select" && (
              <div className="pt-1">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={handleCheckboxChange}
                  aria-label={`Select ${item.title}`}
                  className="h-5 w-5"
                />
              </div>
            )}

            {/* User/Reporter Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-sm font-medium">
                  {item.playerName ? item.playerName.slice(0, 2).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-base">
                  {item.playerName || 'Unknown User'}
                </div>
                <div className="text-sm text-muted-foreground">
                  ID: {item.id} • {formatTimeAgo(item.timestamp)}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Priority and Status */}
          <div className="flex flex-col gap-2 items-end">
            <Badge 
              variant={priorityConfig.variant}
              className={`text-sm px-3 py-1 ${priorityConfig.className}`}
            >
              <div 
                className="h-2 w-2 rounded-full mr-2" 
                style={{ backgroundColor: priorityConfig.dotColor }} 
              />
              {priorityConfig.label}
            </Badge>
            

          </div>
        </div>
      </div>

            {/* Message Content */}
      {item.messageContent && (
        <div className="mx-6 mb-4">
          <div className="bg-muted/30 border rounded-lg p-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Reported Message
            </div>
            <p className="text-base text-foreground">
              {item.messageContent}
            </p>
          </div>
        </div>
      )}




      {/* Violations */}
      {item.violationTypes && item.violationTypes.length > 0 && (
        <div className="mx-6 mb-4">
          <div className="text-sm font-medium text-muted-foreground mb-3">
            Violation Types
          </div>
          <div className="flex flex-wrap gap-2">
            {item.violationTypes?.map((violation: ContentType) => {
              const config = getContentBadgeVariant(violation)
              return (
                <Badge 
                  key={violation}
                  variant={config.variant}
                  className={`text-sm px-3 py-1 ${config.className}`}
                >
                  <div 
                    className="h-2 w-2 rounded-full mr-2" 
                    style={{ backgroundColor: config.dotColor }} 
                  />
                  {config.label}
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="px-6 py-4 border-t bg-muted/20">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>
            <span className="font-medium">Reported by:</span> {item.reportedBy}
          </span>
          <span>
            <span className="font-medium">Experience:</span> {item.experienceName}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {mode === "view" && item.status !== "resolved" && (
        <div className="p-6 pt-4 border-t">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="default"
              className="flex-1 h-10"
              onClick={() => onReview?.(item.id)}
            >
              <IconEye className="h-4 w-4 mr-2" />
              Review Details
            </Button>
            {item.status === "pending" && (
              <>
                <Button 
                  variant="default" 
                  size="default"
                  className="flex-1 h-10"
                  onClick={() => onResolve?.(item.id)}
                >
                  Resolve
                </Button>
                <Button 
                  variant="ghost" 
                  size="default"
                  className="h-10"
                  onClick={() => onDismiss?.(item.id)}
                >
                  Dismiss
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
