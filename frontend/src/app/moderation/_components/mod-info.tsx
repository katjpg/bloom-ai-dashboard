"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconUsers, IconClock } from "@tabler/icons-react"
import { mockActiveUsers, mockExperiences } from "../_data"

interface ModInfoProps {
  selectedExperienceId?: number
}

export default function ModInfo({ selectedExperienceId = 1 }: ModInfoProps) {
  const selectedExperience = mockExperiences.find(exp => exp.id === selectedExperienceId) || mockExperiences[0]
  const experienceActiveUsers = mockActiveUsers.filter(user => user.experience_id === selectedExperienceId)
  
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
                <span className="font-medium tabular-nums">{selectedExperience.playerCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <IconClock className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                <span className="font-medium">{selectedExperience.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/60" />

        {/* Active Users Section */}
        <div className="space-y-3">
          <h4 className="font-clash text-base font-medium">
            Active Users ({experienceActiveUsers.length})
          </h4>
          <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
            {experienceActiveUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors border border-border/30">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={user.avatar_url} alt={user.player_name} />
                  <AvatarFallback className="text-xs font-medium">
                    {user.player_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{user.player_name}</span>
                    <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted/60">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="19" cy="12" r="1"/>
                        <circle cx="5" cy="12" r="1"/>
                      </svg>
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    ID: <span className="tabular-nums">{user.player_id}</span> • {user.join_time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}