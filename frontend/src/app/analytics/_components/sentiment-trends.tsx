"use client"

import { useState, useMemo, memo } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, YAxis, XAxis, ReferenceLine } from "recharts"

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
import { Button } from "@/components/ui/button"
import { 
  TimePeriod, 
  mockHourlySentimentData, 
  mockDailySentimentData, 
  mockWeeklySentimentData,
  getSentimentColor,
  getSentimentLabel
} from "../_data"

interface SentimentTrendsProps {
  selectedExperienceId: number
}

// Chart configuration - moved outside component for performance
const chartConfig = {
  averageSentiment: {
    label: "Sentiment Score",
    color: "hsl(142 76% 36%)",
  },
} satisfies ChartConfig

// Time period labels 
const TIME_PERIODS: TimePeriod[] = ["1d", "7d", "1m"]

// Format time for 1d view - moved outside component
const formatHourTime = (hour: string) => {
  const hourNum = parseInt(hour)
  if (hourNum === 0) return "12AM"
  if (hourNum < 12) return `${hourNum}AM`
  if (hourNum === 12) return "12PM"
  return `${hourNum - 12}PM`
}

const SentimentTrends = memo(function SentimentTrends({ selectedExperienceId }: SentimentTrendsProps) {
  // Filter data by selectedExperienceId
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1d")

  // Memoize chart data to avoid recalculation on every render
  const chartData = useMemo(() => {
    switch (selectedPeriod) {
      case "1d":
        return mockHourlySentimentData.map(item => ({
          period: formatHourTime(item.hour),
          averageSentiment: item.averageSentiment,
          messageCount: item.messageCount,
          fill: getSentimentColor(item.averageSentiment)
        }))
      case "7d":
        return mockDailySentimentData.map(item => ({
          period: item.day,
          averageSentiment: item.averageSentiment,
          messageCount: item.messageCount,
          fill: getSentimentColor(item.averageSentiment)
        }))
      case "1m":
        return mockWeeklySentimentData.map(item => ({
          period: item.week,
          averageSentiment: item.averageSentiment,
          messageCount: item.messageCount,
          fill: getSentimentColor(item.averageSentiment)
        }))
      default:
        return []
    }
  }, [selectedPeriod])

  // Calculate overall sentiment and dynamic line color
  const { overallSentiment, lineColor } = useMemo(() => {
    if (chartData.length === 0) {
      return { overallSentiment: 0, lineColor: "hsl(var(--muted-foreground))" }
    }
    
    const total = chartData.reduce((sum, item) => sum + item.averageSentiment, 0)
    const average = total / chartData.length
    const color = getSentimentColor(average)
    
    return {
      overallSentiment: average,
      lineColor: color
    }
  }, [chartData])
  
  // Memoize trend calculations
  const { currentSentiment, trendDirection, trendPercentage } = useMemo(() => {
    const current = chartData[chartData.length - 1]?.averageSentiment || 0
    const previous = chartData[chartData.length - 2]?.averageSentiment || 0
    const change = current - previous
    const direction = change >= 0 ? "up" : "down"
    const percentage = previous !== 0 ? Math.abs((change / previous) * 100) : 0
    
    return {
      currentSentiment: current,
      trendDirection: direction,
      trendPercentage: percentage
    }
  }, [chartData])

  const periodLabel = useMemo(() => {
    switch (selectedPeriod) {
      case "1d": return "24 hours"
      case "7d": return "7 days" 
      case "1m": return "4 weeks"
      default: return ""
    }
  }, [selectedPeriod])

  return (
    <Card className="@container/card shadow-xs">
      <CardHeader className="flex flex-col space-y-4 border-b p-0 md:flex-row md:space-y-0 md:items-center md:justify-between">
        {/* Title section - full width on mobile, flex-1 on desktop */}
        <div className="flex flex-col justify-center gap-1 px-4 py-4 md:px-6 md:py-5 md:flex-1">
          <CardTitle className="font-clash text-lg font-medium">Sentiment Trends</CardTitle>
          <CardDescription>
            Sentiment score over time ({periodLabel})
          </CardDescription>
        </div>
        
        {/* Time Period Controls - responsive layout */}
        <div className="flex flex-col justify-center px-4 pb-4 md:px-6 md:py-5">
          <div className="flex w-full rounded-lg bg-muted p-1 md:w-auto">
            {TIME_PERIODS.map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "ghost"}
                size="sm"
                className={`flex-1 h-8 px-3 text-xs font-medium transition-all md:flex-none md:min-w-[3rem] ${
                  selectedPeriod === period 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
                onClick={() => setSelectedPeriod(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="px-4 py-6 md:px-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full md:h-[350px]"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid 
                vertical={false} 
                stroke="hsl(var(--border))"
                strokeOpacity={0.3}
              />
              
              {/* Y-axis with -100 to +100 range */}
              <YAxis 
                domain={[-100, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => `${value > 0 ? '+' : ''}${value}`}
                width={40}
              />
              
              {/* X-axis */}
              <XAxis 
                dataKey="period"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                interval={selectedPeriod === "1d" ? 2 : 0}
                height={40}
              />
              
              {/* Reference lines for key sentiment levels */}
              <ReferenceLine 
                y={0} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="2 2" 
                strokeOpacity={0.5}
              />
              <ReferenceLine 
                y={40} 
                stroke="hsl(142 76% 36%)" 
                strokeDasharray="2 2" 
                strokeOpacity={0.3}
              />
              <ReferenceLine 
                y={-40} 
                stroke="hsl(0 84% 60%)" 
                strokeDasharray="2 2" 
                strokeOpacity={0.3}
              />
              
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    hideLabel
                    formatter={(value, name, payload) => [
                      <div key={name} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: payload.payload?.fill }}
                          />
                          <span className="font-medium">
                            {Number(value) > 0 ? '+' : ''}{Number(value).toFixed(1)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getSentimentLabel(Number(value))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {payload.payload?.messageCount?.toLocaleString()} messages
                        </div>
                      </div>
                    ]}
                  />
                }
              />
              
              <Line
                dataKey="averageSentiment"
                type="monotone"
                stroke={lineColor} // Dynamic color based on overall sentiment
                strokeWidth={2}
                strokeOpacity={1}
                dot={({ cx, cy, payload }) => (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill={payload.fill}
                    stroke={payload.fill}
                    strokeWidth={2}
                    className="drop-shadow-sm"
                  />
                )}
                activeDot={{
                  r: 6,
                  fill: "hsl(var(--background))",
                  stroke: lineColor,
                  strokeWidth: 2,
                  className: "drop-shadow-md",
                }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
      
      <CardFooter className="flex-col items-start gap-2 text-sm border-t px-4 py-4 md:px-6">
        <div className="flex gap-2 font-medium leading-none">
          {trendDirection === "up" ? "Trending up" : "Trending down"} by {trendPercentage.toFixed(1)}% 
          {trendDirection === "up" ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground leading-none">
          <span>Current sentiment: </span>
          <span className="font-semibold" style={{ color: getSentimentColor(currentSentiment) }}>
            {currentSentiment > 0 ? '+' : ''}{currentSentiment.toFixed(1)} ({getSentimentLabel(currentSentiment)})
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground leading-none">
          <span>Overall sentiment: </span>
          <span className="font-semibold" style={{ color: lineColor }}>
            {overallSentiment > 0 ? '+' : ''}{overallSentiment.toFixed(1)} ({getSentimentLabel(overallSentiment)})
          </span>
        </div>
      </CardFooter>
    </Card>
  )
})

export default SentimentTrends
