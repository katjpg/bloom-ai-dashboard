"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb"
import { ModeToggle } from "./mode-toggle"
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs"

export function SiteHeader() {
  const breadcrumbs = useBreadcrumbs()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList className="font-clash">
            {breadcrumbs.map((breadcrumb, index) => (
              <BreadcrumbItem key={breadcrumb.href}>
                {breadcrumb.isCurrentPage ? (
                  <BreadcrumbPage className="font-clash font-medium text-base">
                    {breadcrumb.label}
                  </BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink asChild>
                      <Link 
                        href={breadcrumb.href}
                        className="font-clash font-medium text-base hover:text-foreground transition-colors"
                      >
                        {breadcrumb.label}
                      </Link>
                    </BreadcrumbLink>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}