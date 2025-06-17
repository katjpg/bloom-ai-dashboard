"use client"

import { useState, useMemo, memo } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  TimePeriod,
  mockPositiveCommunityActions,
  mockNegativeCommunityActions,
  mockHourlyActionData,
  mockDailyActionData,
  mockWeeklyActionData,
  getActionLabel,
  getActionTypeColor
} from "../_data"

interface ActionsBreakdownProps {
  selectedExperienceId: number
}

// Chart configurations
const positiveChartConfig = {
  count: {
    label: "Count",
    color: "hsl(142 76% 36%)", // Green
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

const negativeChartConfig = {
  count: {
    label: "Count", 
    color: "hsl(0 84% 60%)", // Red
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

// Time period options for dropdown
const TIME_PERIOD_OPTIONS = [
  { value: "1d", label: "Last Day" },
  { value: "7d", label: "Last Week" },
  { value: "1m", label: "Last Month" }
] as const

const ActionsBreakdown = memo(function ActionsBreakdown({ selectedExperienceId }: ActionsBreakdownProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1d")

  // Memoize chart data based on selected period
  const { positiveData, negativeData, totalPositive, totalNegative } = useMemo(() => {
    let basePositiveData, baseNegativeData

    switch (selectedPeriod) {
      case "1d":
        // Use hourly aggregated data for 1d view
        const hourlyTotal = mockHourlyActionData.reduce((acc, item) => ({
          positive: acc.positive + item.positiveActions,
          negative: acc.negative + item.negativeActions
        }), { positive: 0, negative: 0 })
        
        // Scale existing action data proportionally
        const hourlyPositiveScale = hourlyTotal.positive / mockPositiveCommunityActions.reduce((acc, item) => acc + item.count, 0)
        const hourlyNegativeScale = hourlyTotal.negative / mockNegativeCommunityActions.reduce((acc, item) => acc + item.count, 0)
        
        basePositiveData = mockPositiveCommunityActions.map(action => ({
          ...action,
          count: Math.round(action.count * hourlyPositiveScale)
        }))
        baseNegativeData = mockNegativeCommunityActions.map(action => ({
          ...action,
          count: Math.round(action.count * hourlyNegativeScale)
        }))
        break
        
      case "7d":
        // Use daily aggregated data for 7d view
        const dailyTotal = mockDailyActionData.reduce((acc, item) => ({
          positive: acc.positive + item.positiveActions,
          negative: acc.negative + item.negativeActions
        }), { positive: 0, negative: 0 })
        
        const dailyPositiveScale = dailyTotal.positive / mockPositiveCommunityActions.reduce((acc, item) => acc + item.count, 0)
        const dailyNegativeScale = dailyTotal.negative / mockNegativeCommunityActions.reduce((acc, item) => acc + item.count, 0)
        
        basePositiveData = mockPositiveCommunityActions.map(action => ({
          ...action,
          count: Math.round(action.count * dailyPositiveScale)
        }))
        baseNegativeData = mockNegativeCommunityActions.map(action => ({
          ...action,
          count: Math.round(action.count * dailyNegativeScale)
        }))
        break
        
      case "1m":
        // Use weekly aggregated data for 1m view  
        const weeklyTotal = mockWeeklyActionData.reduce((acc, item) => ({
          positive: acc.positive + item.positiveActions,
          negative: acc.negative + item.negativeActions
        }), { positive: 0, negative: 0 })
        
        const weeklyPositiveScale = weeklyTotal.positive / mockPositiveCommunityActions.reduce((acc, item) => acc + item.count, 0)
        const weeklyNegativeScale = weeklyTotal.negative / mockNegativeCommunityActions.reduce((acc, item) => acc + item.count, 0)
        
        basePositiveData = mockPositiveCommunityActions.map(action => ({
          ...action,
          count: Math.round(action.count * weeklyPositiveScale)
        }))
        baseNegativeData = mockNegativeCommunityActions.map(action => ({
          ...action,
          count: Math.round(action.count * weeklyNegativeScale)
        }))
        break
        
      default:
        basePositiveData = mockPositiveCommunityActions
        baseNegativeData = mockNegativeCommunityActions
    }

    // Sort by count (descending) and transform for chart
    const sortedPositive = [...basePositiveData]
      .sort((a, b) => b.count - a.count)
      .map(item => ({
        action: getActionLabel(item.action),
        count: item.count,
        fill: getActionTypeColor(item.action)
      }))

    const sortedNegative = [...baseNegativeData]
      .sort((a, b) => b.count - a.count)
      .map(item => ({
        action: getActionLabel(item.action),
        count: item.count,
        fill: getActionTypeColor(item.action)
      }))

    const totalPos = sortedPositive.reduce((acc, item) => acc + item.count, 0)
    const totalNeg = sortedNegative.reduce((acc, item) => acc + item.count, 0)

    return {
      positiveData: sortedPositive,
      negativeData: sortedNegative,
      totalPositive: totalPos,
      totalNegative: totalNeg
    }
  }, [selectedPeriod])

  const periodLabel = useMemo(() => {
    switch (selectedPeriod) {
      case "1d": return "24 hours"
      case "7d": return "7 days"
      case "1m": return "4 weeks"
      default: return ""
    }
  }, [selectedPeriod])

  return (
    <div className="space-y-6">
      {/* Header with Time Period Dropdown */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-clash text-xl font-medium">Actions Breakdown</h2>
          <p className="text-sm text-muted-foreground">Positive vs negative community behaviors ({periodLabel})</p>
        </div>
        <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as TimePeriod)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIME_PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 @4xl/page:grid-cols-2">
        {/* Positive Actions Chart */}
        <Card className="@container/chart shadow-xs">
          <CardHeader className="flex flex-col justify-center border-b">
            <CardTitle className="font-clash text-lg font-medium">Positive Actions</CardTitle>
            <CardDescription>
              Constructive community behaviors
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <ChartContainer
              config={positiveChartConfig}
              className="aspect-auto h-[400px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={positiveData}
                layout="vertical"
                margin={{
                  right: 20,
                  left: -30,
                  top: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="action"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  width={130}
                />
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="count"
                  layout="vertical"
                  fill="var(--color-count)"
                  radius={4}
                >
                  <LabelList
                    dataKey="count"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          
          <CardFooter className="flex-col items-start gap-2 text-sm border-t">
            <div className="flex gap-2 font-medium leading-relaxed">
              Growing community support <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-relaxed">
              {totalPositive.toLocaleString()} positive actions recorded
            </div>
          </CardFooter>
        </Card>

        {/* Negative Actions Chart */}
        <Card className="@container/chart shadow-xs">
          <CardHeader className="flex flex-col justify-center border-b">
            <CardTitle className="font-clash text-lg font-medium">Negative Actions</CardTitle>
            <CardDescription>
              Disruptive community behaviors
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <ChartContainer
              config={negativeChartConfig}
              className="aspect-auto h-[400px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={negativeData}
                layout="vertical"
                margin={{
                  right: 20,
                  left: -30,
                  top: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="action"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  width={130}
                />
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="count"
                  layout="vertical"
                  fill="var(--color-count)"
                  radius={4}
                >
                  <LabelList
                    dataKey="count"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          
          <CardFooter className="flex-col items-start gap-2 text-sm border-t">
            <div className="flex gap-2 font-medium leading-relaxed">
              Improving moderation <TrendingDown className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-relaxed">
              {totalNegative.toLocaleString()} negative actions detected
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
})

export default ActionsBreakdown