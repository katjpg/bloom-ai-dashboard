"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Clock, 
  AlertTriangle, 
  Shield, 
  CheckCircle, 
  XCircle,
  Eye
} from "lucide-react"
import { 
  PriorityLevel, 
  getPriorityBadgeVariant
} from "@/lib/colors-mod"
import { mockExperiences } from "../_data"

// Mock queue data
interface QueueItem {
  id: string
  type: "message" | "user" | "experience"
  priority: PriorityLevel
  title: string
  description: string
  reportedBy: string
  timestamp: string
  experienceId: number
  status: "pending" | "in_review" | "resolved"
}

const mockQueueItems: QueueItem[] = [
  {
    id: "queue_001",
    type: "message",
    priority: PriorityLevel.CRITICAL,
    title: "Violent Threat Detected",
    description: "User threatening physical harm to another player",
    reportedBy: "AutoMod AI",
    timestamp: "2024-01-21T14:30:00Z",
    experienceId: 1,
    status: "pending"
  },
  {
    id: "queue_002", 
    type: "user",
    priority: PriorityLevel.HIGH,
    title: "Harassment Report",
    description: "Multiple users reporting harassment from player 'ToxicGamer99'",
    reportedBy: "Community Reports (5)",
    timestamp: "2024-01-21T14:25:00Z",
    experienceId: 2,
    status: "pending"
  },
  {
    id: "queue_003",
    type: "message",
    priority: PriorityLevel.MODERATE,
    title: "Spam Detection",
    description: "Repeated identical messages in chat",
    reportedBy: "AutoMod AI",
    timestamp: "2024-01-21T14:20:00Z",
    experienceId: 3,
    status: "in_review"
  },
  {
    id: "queue_004",
    type: "experience",
    priority: PriorityLevel.HIGH,
    title: "Inappropriate Content",
    description: "Experience reported for adult content",
    reportedBy: "Community Reports (12)",
    timestamp: "2024-01-21T14:15:00Z",
    experienceId: 4,
    status: "pending"
  },
  {
    id: "queue_005",
    type: "message",
    priority: PriorityLevel.MODERATE,
    title: "Mild Language",
    description: "Borderline inappropriate language detected",
    reportedBy: "AutoMod AI",
    timestamp: "2024-01-21T14:10:00Z",
    experienceId: 1,
    status: "resolved"
  }
]

const getPriorityIcon = (priority: PriorityLevel) => {
  switch (priority) {
    case PriorityLevel.CRITICAL:
      return <AlertTriangle className="h-4 w-4" />
    case PriorityLevel.HIGH:
      return <Shield className="h-4 w-4" />
    case PriorityLevel.MODERATE:
      return <Clock className="h-4 w-4" />
    default:
      return <Eye className="h-4 w-4" />
  }
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "pending":
      return "outline" as const // Changed from "destructive" to "outline" to reduce intensity
    case "in_review":
      return "secondary" as const
    case "resolved":
      return "default" as const
    default:
      return "secondary" as const
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

export default function QueuePage() {
  const [selectedExperienceId, setSelectedExperienceId] = useState<number>(0) // 0 for "All"
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Filter queue items
  const filteredItems = mockQueueItems.filter(item => {
    const experienceMatch = selectedExperienceId === 0 || item.experienceId === selectedExperienceId
    const priorityMatch = selectedPriority === "all" || item.priority === selectedPriority
    const statusMatch = selectedStatus === "all" || item.status === selectedStatus
    return experienceMatch && priorityMatch && statusMatch
  })

  const handleReview = (itemId: string) => {
    console.log(`Reviewing item ${itemId}`)
    // Here you would navigate to the detailed review page or open a modal
  }

  const handleResolve = (itemId: string) => {
    console.log(`Resolving item ${itemId}`)
    // Here you would mark the item as resolved
  }

  const handleDismiss = (itemId: string) => {
    console.log(`Dismissing item ${itemId}`)
    // Here you would dismiss the item
  }

  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 @2xl/page:flex-row @2xl/page:items-end @2xl/page:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-clash text-3xl font-medium">
            Moderation Queue
          </h1>
          <p className="text-muted-foreground">
            Review and manage flagged content and user reports
          </p>
        </div>
        
        {/* Filters - Responsive layout */}
        <div className="flex flex-col gap-3 @lg/page:flex-row @lg/page:gap-4">
          <Select value={selectedExperienceId.toString()} onValueChange={(value) => setSelectedExperienceId(Number(value))}>
            <SelectTrigger className="w-full @lg/page:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Experiences</SelectItem>
              {mockExperiences.map((experience) => (
                <SelectItem key={experience.id} value={experience.id.toString()}>
                  {experience.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-full @lg/page:w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value={PriorityLevel.CRITICAL}>Critical</SelectItem>
              <SelectItem value={PriorityLevel.HIGH}>High</SelectItem>
              <SelectItem value={PriorityLevel.MODERATE}>Moderate</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full @lg/page:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Queue Items */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                <h3 className="font-clash text-lg font-medium">Queue is Empty</h3>
                <p className="text-sm text-muted-foreground">
                  No items match your current filters
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => {
            const priorityConfig = getPriorityBadgeVariant(item.priority)
            
            return (
              <Card key={item.id} className="@container/card shadow-xs overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-4 @lg/card:flex-row @lg/card:items-start @lg/card:justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-full text-white flex-shrink-0"
                        style={{ backgroundColor: priorityConfig.dotColor }}
                      >
                        {getPriorityIcon(item.priority)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {item.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 @lg/card:flex-nowrap">
                      <Badge variant={getStatusBadgeVariant(item.status)} className="text-xs capitalize">
                        {item.status.replace('_', ' ')}
                      </Badge>
                      <Badge 
                        variant={priorityConfig.variant}
                        className={`text-xs ${priorityConfig.className}`}
                      >
                        <div className="h-1.5 w-1.5 rounded-full mr-2" style={{ backgroundColor: priorityConfig.dotColor }} />
                        {priorityConfig.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-col gap-4 @xl/card:flex-row @xl/card:items-center @xl/card:justify-between">
                    <div className="flex flex-col gap-2 @lg/card:flex-row @lg/card:items-center @lg/card:gap-4 text-sm text-muted-foreground">
                      <span>Reported by: {item.reportedBy}</span>
                      <span className="hidden @lg/card:inline">•</span>
                      <span>{formatTimeAgo(item.timestamp)}</span>
                      <span className="hidden @lg/card:inline">•</span>
                      <span>
                        {mockExperiences.find(exp => exp.id === item.experienceId)?.title || 'Unknown Experience'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 @lg/card:flex-nowrap">
                      {item.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 @lg/card:flex-none"
                            onClick={() => handleReview(item.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="flex-1 @lg/card:flex-none"
                            onClick={() => handleResolve(item.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex-1 @lg/card:flex-none"
                            onClick={() => handleDismiss(item.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Dismiss
                          </Button>
                        </>
                      )}
                      {item.status === 'in_review' && (
                        <>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="flex-1 @lg/card:flex-none"
                            onClick={() => handleResolve(item.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex-1 @lg/card:flex-none"
                            onClick={() => handleDismiss(item.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Dismiss
                          </Button>
                        </>
                      )}
                      {item.status === 'resolved' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 @lg/card:flex-none"
                          onClick={() => handleReview(item.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}