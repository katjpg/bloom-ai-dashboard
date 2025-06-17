"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, Award, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockLeaderboardData, TimePeriod, LeaderboardPlayer } from "../_data"
import { mockExperiences } from "../../(dashboard)/_data"

interface TopLeadersProps {
  timePeriod: TimePeriod
}

export default function TopLeaders({ timePeriod }: TopLeadersProps) {
  const [animateIn, setAnimateIn] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<string>("all")

  useEffect(() => {
    setAnimateIn(false)
    const timer = setTimeout(() => setAnimateIn(true), 100)
    return () => clearTimeout(timer)
  }, [timePeriod, selectedExperience])

  // Filter data by experience if selected
  const rawData = mockLeaderboardData[timePeriod]
  const filteredData = selectedExperience === "all" 
    ? rawData 
    : rawData.filter(player => player.experienceId === parseInt(selectedExperience))
  
  // Re-rank filtered data
  const data = filteredData.map((player, index) => ({
    ...player,
    rank: index + 1
  }))
  
  const topThree = data.slice(0, 3)
  const remaining = data.slice(3)

  const getPodiumHeight = (position: number) => {
    const heights = { 1: "h-32", 2: "h-24", 3: "h-20" }
    return heights[position as keyof typeof heights]
  }

  const getPositionIcon = (position: number) => {
    const iconClass = "h-6 w-6"
    switch(position) {
      case 1: return <Trophy className={`${iconClass} text-yellow-500`} />
      case 2: return <Medal className={`${iconClass} text-gray-400`} />
      case 3: return <Award className={`${iconClass} text-amber-600`} />
      default: return null
    }
  }

  const getPodiumColors = (position: number) => {
    const colors = {
      1: {
        border: "border-yellow-500/30",
        bg: "bg-gradient-to-t from-yellow-500/5 to-card shadow-xs",
        avatar: "ring-yellow-500",
        text: "text-yellow-500"
      },
      2: {
        border: "border-gray-400/30", 
        bg: "bg-gradient-to-t from-gray-400/5 to-card shadow-xs",
        avatar: "ring-gray-400",
        text: "text-gray-400"
      },
      3: {
        border: "border-amber-600/30",
        bg: "bg-gradient-to-t from-amber-600/5 to-card shadow-xs", 
        avatar: "ring-amber-600",
        text: "text-amber-600"
      }
    }
    return colors[position as keyof typeof colors]
  }

  return (
    <div className="space-y-8">
      {/* Experience Filter */}
      <div className="flex justify-center">
        <Select value={selectedExperience} onValueChange={setSelectedExperience}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Filter by experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Experiences</SelectItem>
            {mockExperiences.map((experience) => (
              <SelectItem key={experience.id} value={experience.id.toString()}>
                {experience.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Podium Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="font-clash text-2xl font-medium mb-2">
            Top Contributors
            {selectedExperience !== "all" && (
              <span className="text-base font-normal text-muted-foreground ml-2">
                in {mockExperiences.find(e => e.id.toString() === selectedExperience)?.title}
              </span>
            )}
          </h2>
        </div>

        <div className="flex justify-center items-end gap-4 md:gap-8 mb-8">
          {/* Second Place */}
          {topThree[1] && (
            <div className="text-center flex-1 max-w-[200px]">
              <div className={`mb-4 transform transition-all duration-500 ${animateIn ? 'scale-100 translate-y-0' : 'scale-90 translate-y-2'}`}
                   style={{ transitionDelay: '100ms' }}>
                <Avatar className={`h-20 w-20 mx-auto mb-3 ring-4 ${getPodiumColors(2).avatar} ring-offset-2 ring-offset-background`}>
                  <AvatarImage src={topThree[1]?.avatar_url} alt={topThree[1]?.username} />
                  <AvatarFallback className="text-lg font-bold">
                    {topThree[1]?.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg truncate">{topThree[1]?.username}</h3>
                <p className="text-sm text-muted-foreground mb-2">{topThree[1]?.positiveActions} actions</p>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary" className="text-sm font-bold pointer-events-none">
                    {topThree[1]?.score.toLocaleString()} pts
                  </Badge>
                </div>
              </div>
              <Card className={`${getPodiumHeight(2)} ${getPodiumColors(2).border} ${getPodiumColors(2).bg} transform transition-all duration-500 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    style={{ transitionDelay: '200ms' }}>
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center">
                    {getPositionIcon(2)}
                    <p className={`text-3xl font-bold mt-2 ${getPodiumColors(2).text}`}>2</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* First Place */}
          {topThree[0] && (
            <div className="text-center flex-1 max-w-[200px]">
              <div className={`mb-4 transform transition-all duration-500 ${animateIn ? 'scale-100 translate-y-0' : 'scale-90 translate-y-2'}`}
                   style={{ transitionDelay: '300ms' }}>
                <div className="relative">
                  <Avatar className={`h-24 w-24 mx-auto mb-3 ring-4 ${getPodiumColors(1).avatar} ring-offset-2 ring-offset-background`}>
                    <AvatarImage src={topThree[0]?.avatar_url} alt={topThree[0]?.username} />
                    <AvatarFallback className="text-xl font-bold">
                      {topThree[0]?.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="font-bold text-xl truncate">{topThree[0]?.username}</h3>
                <p className="text-sm text-muted-foreground mb-2">{topThree[0]?.positiveActions} actions</p>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="default" className="text-sm font-bold bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 pointer-events-none">
                    {topThree[0]?.score.toLocaleString()} pts
                  </Badge>
                </div>
              </div>
              <Card className={`${getPodiumHeight(1)} ${getPodiumColors(1).border} ${getPodiumColors(1).bg} transform transition-all duration-500 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    style={{ transitionDelay: '400ms' }}>
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center">
                    {getPositionIcon(1)}
                    <p className={`text-4xl font-bold mt-2 ${getPodiumColors(1).text}`}>1</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Third Place */}
          {topThree[2] && (
            <div className="text-center flex-1 max-w-[200px]">
              <div className={`mb-4 transform transition-all duration-500 ${animateIn ? 'scale-100 translate-y-0' : 'scale-90 translate-y-2'}`}
                   style={{ transitionDelay: '500ms' }}>
                <Avatar className={`h-20 w-20 mx-auto mb-3 ring-4 ${getPodiumColors(3).avatar} ring-offset-2 ring-offset-background`}>
                  <AvatarImage src={topThree[2]?.avatar_url} alt={topThree[2]?.username} />
                  <AvatarFallback className="text-lg font-bold">
                    {topThree[2]?.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg truncate">{topThree[2]?.username}</h3>
                <p className="text-sm text-muted-foreground mb-2">{topThree[2]?.positiveActions} actions</p>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary" className="text-sm font-bold pointer-events-none">
                    {topThree[2]?.score.toLocaleString()} pts
                  </Badge>
                </div>
              </div>
              <Card className={`${getPodiumHeight(3)} ${getPodiumColors(3).border} ${getPodiumColors(3).bg} transform transition-all duration-500 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    style={{ transitionDelay: '600ms' }}>
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center">
                    {getPositionIcon(3)}
                    <p className={`text-3xl font-bold mt-2 ${getPodiumColors(3).text}`}>3</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Remaining Players List */}
      {data.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-clash text-xl font-medium text-center">Community Leaders</h3>
          
          <div className="grid gap-3">
            {remaining.map((player, index) => (
              <Card 
                key={player.id}
                className={`@container/card shadow-xs transform transition-all duration-200 focus:outline-none ${animateIn ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                style={{ transitionDelay: `${700 + index * 100}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-muted-foreground min-w-[40px]">
                      {player.rank}
                    </div>
                    
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={player.avatar_url} alt={player.username} />
                      <AvatarFallback className="font-bold">
                        {player.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold truncate">{player.username}</h4>
                        {selectedExperience === "all" && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            {player.experienceName}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {player.positiveActions.toLocaleString()} positive actions
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-md font-bold pointer-events-none">
                          {player.score.toLocaleString()} pts
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium mb-2">No contributors found</p>
            <p className="text-sm">
              {selectedExperience === "all" 
                ? "No leaderboard data available for this time period."
                : `No contributors found in ${mockExperiences.find(e => e.id.toString() === selectedExperience)?.title} for this time period.`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  )
}