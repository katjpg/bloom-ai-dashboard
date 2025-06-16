"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import LiveChatFeed from "./_components/live-chat-feed"
import ModInfo from "./_components/mod-info"
import { mockExperiences } from "./_data"

export default function ModerationPage() {
  const [selectedExperienceId, setSelectedExperienceId] = useState<number>(1)

  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      {/* Header Section */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-clash text-3xl font-medium">
            Moderation Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage live chat interactions
          </p>
        </div>
        <Select value={selectedExperienceId.toString()} onValueChange={(value) => setSelectedExperienceId(Number(value))}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mockExperiences.map((experience) => (
              <SelectItem key={experience.id} value={experience.id.toString()}>
                {experience.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="live-chat" className="gap-6">
        <TabsList className="w-full @3xl/page:w-fit">
          <TabsTrigger value="live-chat">Live Chat</TabsTrigger>
          <TabsTrigger value="moderation-history" disabled>
            Moderation History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live-chat" className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main chat feed */}
            <div className="lg:col-span-3">
              <LiveChatFeed selectedExperienceId={selectedExperienceId} />
            </div>

            {/* Right sidebar with mod info */}
            <div className="lg:col-span-1">
              <ModInfo selectedExperienceId={selectedExperienceId} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="moderation-history" className="flex flex-col gap-6">
          <div className="text-center text-muted-foreground py-8">
            Moderation History - Coming Soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}