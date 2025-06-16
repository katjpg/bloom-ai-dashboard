"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Clock } from "lucide-react"
import { mockActiveUsers, mockExperiences } from "../_data"

interface ModInfoProps {
  selectedExperienceId?: number
}

export default function ModInfo({ selectedExperienceId = 1 }: ModInfoProps) {
  const selectedExperience = mockExperiences.find(exp => exp.id === selectedExperienceId) || mockExperiences[0]
  const experienceActiveUsers = mockActiveUsers.filter(user => user.experience_id === selectedExperienceId)
  
  return (
    <div className="space-y-4">
      {/* Experience Info Card */}
      <Card className="@container">
        <CardContent className="space-y-4">
          {/* Experience Thumbnail */}
          <div className="relative aspect-video bg-gradient-to-br from-muted/50 to-muted w-full rounded-md overflow-hidden">
            <div className="absolute inset-0 bg-muted/80 flex items-center justify-center">
              <div className="text-muted-foreground text-xs font-medium">Experience Thumbnail</div>
            </div>
            
            {/* Live Indicator */}
            {selectedExperience.isActive && (
              <div className="absolute top-2 right-2">
                <div className="flex items-center gap-1 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm font-medium">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                  Live
                </div>
              </div>
            )}
          </div>
          
          {/* Experience Stats */}
          <div className="space-y-2">
            <h3 className="font-clash font-semibold text-lg line-clamp-1">{selectedExperience.title}</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span className="font-medium">{selectedExperience.playerCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="font-medium">{selectedExperience.lastUpdated}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Users Card */}
      <Card className="@container">
        <CardHeader className="pb-3">
          <CardTitle className="font-clash text-lg font-medium">
            Active Users ({experienceActiveUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {experienceActiveUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={user.avatar_url} alt={user.player_name} />
                  <AvatarFallback className="text-xs">
                    {user.player_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{user.player_name}</span>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="19" cy="12" r="1"/>
                        <circle cx="5" cy="12" r="1"/>
                      </svg>
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {user.player_id} " {user.join_time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}