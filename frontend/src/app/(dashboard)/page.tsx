import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartMessage } from "./_components/chart-message"
import { CardsKPI } from "./_components/cards-kpi"
import { CardsExperience } from "./_components/cards-experience"

export default function Page() {
  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="font-clash text-3xl font-medium">
          Welcome back, Bloom Admin!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your community's health
        </p>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="overview" className="gap-6">
        <TabsList className="w-full @3xl/page:w-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experiences">
            Experiences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-6">
          {/* Metrics Overview Cards */}
          <CardsKPI />

          {/* Charts Section */}
          <ChartMessage />
        </TabsContent>

        <TabsContent value="experiences" className="flex flex-col gap-6">
          <CardsExperience />
        </TabsContent>
      </Tabs>
    </div>
  )
}