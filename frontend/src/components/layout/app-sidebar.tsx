"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconListDetails,
  IconSettings,
  IconUsers,
  IconStack2,
  IconMessage,
  IconHistory,
} from "@tabler/icons-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"

const BloomLogo = ({ className }: { className?: string }) => (
  <img
    src="/icons/bloom-logo.svg"
    alt="Bloom Logo"
    className={className}
  />
)

const data = {
  user: {
    name: "Bloom Admin",
    email: "admin@bloom.roblox",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Moderation",
      url: "/moderation",
      icon: IconListDetails,
      items: [
        {
          title: "Live Chat",
          url: "/moderation",
          icon: IconMessage,
        },
        {
          title: "Queue",
          url: "/moderation/queue",
          icon: IconStack2,
        },
        {
          title: "History",
          url: "/moderation/history",
          icon: IconHistory,
        },
      ],
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: IconChartBar,
    },
    {
      title: "Leaderboard",
      url: "/leaderboard",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <BloomLogo className="!size-5" />
                <span className="text-xl font-semibold font-clash">Bloom</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}