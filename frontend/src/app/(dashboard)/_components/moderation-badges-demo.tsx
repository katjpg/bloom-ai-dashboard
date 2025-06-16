"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ModerationColorSystem,
  PIIType,
  ContentType,
  ActionType,
  PriorityLevel,
  getPIIRiskLevel,
  type BadgeVariant
} from "@/lib/colors-mod"
import {
  Moon,
  Sun,
  CreditCard,
  ShieldAlert,
  Mail,
  User,
  CheckCircle,
  AlertTriangle,
  Check,
  Ban,
  BarChart3,
  AlertOctagon,
  FileText,
  IdCard,
  Car,
  Lock,
  Calendar,
  Hash,
  Phone,
  UserCheck,
  AtSign,
  MapPin,
  Navigation,
  Building,
  MessageCircleX,
  Zap,
  UserX,
  Heart,
  ShieldX,
  Skull,
  Swords,
  MicOff,
  Trash2,
  UserMinus,
  Info,
  AlertCircle
} from "lucide-react"

// Icon mapping for dynamic icon rendering
const iconMap = {
  CreditCard, ShieldAlert, Mail, User, CheckCircle, AlertTriangle, Check, Ban,
  BarChart3, AlertOctagon, FileText, IdCard, Car, Lock, Calendar, Hash, Phone,
  UserCheck, AtSign, MapPin, Navigation, Building, MessageCircleX, Zap, UserX,
  Heart, ShieldX, Skull, Swords, MicOff, Trash2, UserMinus, Info, AlertCircle
}

interface ModerationBadgeProps {
  variant: BadgeVariant
  showIcon?: boolean
  children: React.ReactNode
}

function ModerationBadge({ variant, showIcon = true, children }: ModerationBadgeProps) {
  const IconComponent = variant.icon ? iconMap[variant.icon as keyof typeof iconMap] : null

  return (
    <Badge className={variant.className}>
      <div className={`h-1.5 w-1.5 rounded-full mr-2`} style={{ backgroundColor: variant.dotColor }} />
      {showIcon && IconComponent && <IconComponent className="h-3 w-3 mr-1.5" />}
      {children}
    </Badge>
  )
}

interface ScenarioCardProps {
  title: string
  description: string
  badges: { variant: BadgeVariant; label: string }[]
  messagePreview?: string
}

function ScenarioCard({ title, description, badges, messagePreview }: ScenarioCardProps) {
  return (
    <Card className="@container/scenario bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
        {messagePreview && (
          <div className="bg-muted/50 p-3 rounded-md text-sm italic mt-2 border-l-4 border-muted">
            "{messagePreview}"
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {badges.map((badge, index) => (
          <ModerationBadge key={index} variant={badge.variant}>
            {badge.label}
          </ModerationBadge>
        ))}
      </CardContent>
    </Card>
  )
}

export function ModerationBadgesDemo() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const piiEntries = Object.entries(ModerationColorSystem.pii) as [PIIType, BadgeVariant][]
  const contentEntries = Object.entries(ModerationColorSystem.content) as [ContentType, BadgeVariant][]
  const actionEntries = Object.entries(ModerationColorSystem.actions) as [ActionType, BadgeVariant][]
  const priorityEntries = Object.entries(ModerationColorSystem.priority) as [PriorityLevel, BadgeVariant][]

  // Group PII by risk level
  const piiByRisk = {
    CRITICAL: piiEntries.filter(([type]) => getPIIRiskLevel(type) === 'CRITICAL'),
    HIGH: piiEntries.filter(([type]) => getPIIRiskLevel(type) === 'HIGH'),
    MEDIUM: piiEntries.filter(([type]) => getPIIRiskLevel(type) === 'MEDIUM'),
    LOW: piiEntries.filter(([type]) => getPIIRiskLevel(type) === 'LOW')
  }

  // Real-world moderation scenarios
  const moderationScenarios = [
    {
      title: "Credit Card Sharing",
      description: "User posted their credit card information in chat",
      messagePreview: "Hey my card is 4532-1234-5678-9012 exp 12/25",
      badges: [
        { variant: ModerationColorSystem.pii[PIIType.CREDITCARDNUMBER], label: "Credit Card" },
        { variant: ModerationColorSystem.priority[PriorityLevel.CRITICAL], label: "Critical" },
        { variant: ModerationColorSystem.actions[ActionType.DELETE_MESSAGE], label: "Message Deleted" },
        { variant: ModerationColorSystem.actions[ActionType.WARNING], label: "User Warned" }
      ]
    },
    {
      title: "Inappropriate Content",
      description: "Sexual content detected in community post",
      messagePreview: "[Content hidden due to policy violation]",
      badges: [
        { variant: ModerationColorSystem.content[ContentType.S], label: "Sexual Content" },
        { variant: ModerationColorSystem.priority[PriorityLevel.HIGH], label: "High Priority" },
        { variant: ModerationColorSystem.actions[ActionType.DELETE_MESSAGE], label: "Content Removed" },
        { variant: ModerationColorSystem.actions[ActionType.MUTE], label: "24h Mute" }
      ]
    },
    {
      title: "Safe Community Interaction",
      description: "Normal gaming discussion with no policy violations",
      messagePreview: "Great game everyone! Who wants to team up for the next round?",
      badges: [
        { variant: ModerationColorSystem.content[ContentType.OK], label: "Safe Content" },
        { variant: ModerationColorSystem.actions[ActionType.APPROVE], label: "Approved" },
        { variant: ModerationColorSystem.priority[PriorityLevel.TOTAL], label: "Normal Processing" }
      ]
    },
    {
      title: "Severe Policy Violation",
      description: "Hate speech with threatening language detected",
      messagePreview: "[Severe content blocked by safety system]",
      badges: [
        { variant: ModerationColorSystem.content[ContentType.H2], label: "Hate + Threats" },
        { variant: ModerationColorSystem.priority[PriorityLevel.CRITICAL], label: "Critical" },
        { variant: ModerationColorSystem.actions[ActionType.BAN], label: "Account Banned" },
        { variant: ModerationColorSystem.actions[ActionType.DELETE_MESSAGE], label: "Content Removed" }
      ]
    },
    {
      title: "Personal Information Leak",
      description: "User accidentally shared personal details",
      messagePreview: "My email is john.doe@email.com, phone is 555-0123",
      badges: [
        { variant: ModerationColorSystem.pii[PIIType.EMAIL], label: "Email Address" },
        { variant: ModerationColorSystem.pii[PIIType.TELEPHONENUM], label: "Phone Number" },
        { variant: ModerationColorSystem.priority[PriorityLevel.MODERATE], label: "Moderate Risk" },
        { variant: ModerationColorSystem.actions[ActionType.WARNING], label: "Privacy Warning" }
      ]
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Dark Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="font-clash text-3xl font-medium">Moderation Badge System</h2>
          <p className="text-muted-foreground">
            Comprehensive color-coded badge system for content moderation
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={toggleDarkMode}>
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="gap-6">
        <TabsList className="w-full @3xl/page:w-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pii">PII Detection</TabsTrigger>
          <TabsTrigger value="content">Content Types</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="scenarios">Real Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 @3xl/page:grid-cols-2">
            {/* Priority Levels */}
            <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Priority Levels
                </CardTitle>
                <CardDescription>Risk-based priority classification</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {priorityEntries.map(([priority, variant]) => (
                  <div key={priority} className="flex items-center justify-between">
                    <ModerationBadge variant={variant}>
                      {variant.label}
                    </ModerationBadge>
                    <span className="text-sm text-muted-foreground">{priority}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions Overview */}
            <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Common Actions
                </CardTitle>
                <CardDescription>Most frequently used moderation actions</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {[ActionType.APPROVE, ActionType.WARNING, ActionType.MUTE, ActionType.BAN].map((action) => {
                  const variant = ModerationColorSystem.actions[action]
                  return (
                    <div key={action} className="flex items-center justify-between">
                      <ModerationBadge variant={variant}>
                        {variant.label}
                      </ModerationBadge>
                      <span className="text-sm text-muted-foreground">{action}</span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pii" className="flex flex-col gap-6">
          {Object.entries(piiByRisk).map(([riskLevel, entries]) => (
            <Card key={riskLevel} className="bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  {riskLevel} Risk PII
                </CardTitle>
                <CardDescription>
                  {riskLevel === 'CRITICAL' && 'Immediate action required - highest sensitivity data'}
                  {riskLevel === 'HIGH' && 'Requires prompt attention - sensitive personal data'}
                  {riskLevel === 'MEDIUM' && 'Monitor closely - personal contact information'}
                  {riskLevel === 'LOW' && 'Low risk - general identifying information'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 @2xl/page:grid-cols-2 @4xl/page:grid-cols-3">
                  {entries.map(([type, variant]) => (
                    <div key={type} className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                      <ModerationBadge variant={variant}>
                        {variant.label}
                      </ModerationBadge>
                      <span className="text-xs text-muted-foreground">{type}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="content" className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 @3xl/page:grid-cols-2">
            {/* Safe Content */}
            <Card className="bg-gradient-to-t from-emerald-50/50 to-card shadow-xs dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="h-5 w-5" />
                  Safe Content
                </CardTitle>
                <CardDescription>Content that passes all safety checks</CardDescription>
              </CardHeader>
              <CardContent>
                <ModerationBadge variant={ModerationColorSystem.content[ContentType.OK]}>
                  {ModerationColorSystem.content[ContentType.OK].label}
                </ModerationBadge>
              </CardContent>
            </Card>

            {/* Policy Violations */}
            <Card className="bg-gradient-to-t from-red-50/50 to-card shadow-xs dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Policy Violations
                </CardTitle>
                <CardDescription>Content requiring moderation action</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 @lg/page:grid-cols-2">
                  {contentEntries.filter(([type]) => type !== ContentType.OK).map(([type, variant]) => (
                    <div key={type} className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                      <ModerationBadge variant={variant}>
                        {variant.label}
                      </ModerationBadge>
                      <span className="text-xs text-muted-foreground">{type}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 @2xl/page:grid-cols-2 @4xl/page:grid-cols-3">
            {actionEntries.map(([action, variant]) => (
              <Card key={action} className="bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{variant.label}</CardTitle>
                  <CardDescription className="text-xs">{action}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ModerationBadge variant={variant}>
                    {variant.label}
                  </ModerationBadge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 @3xl/page:grid-cols-2">
            {moderationScenarios.map((scenario, index) => (
              <ScenarioCard key={index} {...scenario} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}