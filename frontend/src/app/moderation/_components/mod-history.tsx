"use client"

import React, { useMemo, useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Clock, User, Filter, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { ModerationHistory } from "../_data/mod-history-data"
import { getActionBadgeVariant } from "@/lib/colors-mod"
import { ActionType } from "@/lib/colors-mod"

interface ModHistoryProps {
  history: ModerationHistory[]
  selectedExperienceId?: number
}

export default function ModHistory({ history, selectedExperienceId }: ModHistoryProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  // Filter history by selected experience
  const filteredHistory = useMemo(() => {
    if (!selectedExperienceId) return history
    return history.filter(entry => entry.experienceId === selectedExperienceId)
  }, [history, selectedExperienceId])

  // Format relative time
  const formatRelativeTime = (timestamp: string): string => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const columns: ColumnDef<ModerationHistory>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "timestamp",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 font-medium"
        >
          <Clock className="h-4 w-4 mr-1" />
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const timestamp = row.getValue("timestamp") as string
        const relativeTime = formatRelativeTime(timestamp)
        const exactTime = new Date(timestamp).toLocaleString()
        
        return (
          <div className="text-sm font-medium p-6" title={exactTime}>
            {relativeTime}
          </div>
        )
      },
      sortingFn: (rowA, rowB) => {
        const a = new Date(rowA.getValue("timestamp") as string).getTime()
        const b = new Date(rowB.getValue("timestamp") as string).getTime()
        return a - b
      }
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.getValue("action") as ActionType
        const config = getActionBadgeVariant(action)
        const duration = row.original.duration
        
        return (
          <div className="flex items-center gap-2">
            <Badge variant={config.variant} className={`${config.className} text-xs`}>
              <div className="h-1.5 w-1.5 rounded-full mr-2" style={{ backgroundColor: config.dotColor }} />
              {config.label}
            </Badge>
            {duration && (
              <span className="text-xs text-muted-foreground">({duration})</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "playerName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 font-medium"
        >
          <User className="h-4 w-4 mr-1" />
          Player
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const playerName = row.getValue("playerName") as string
        const messageCount = row.original.affectedMessagesCount
        
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {playerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{playerName}</span>
              {messageCount > 1 && (
                <Badge variant="secondary" className="text-xs w-fit">
                  {messageCount} msgs
                </Badge>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "messageContent",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 font-medium"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Message
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const messageContent = row.original.messageContent
        
        return (
          <div className="max-w-[300px]">
            {messageContent ? (
              <div className="text-sm truncate" title={messageContent}>
                "{messageContent}"
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic">No message content</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "experienceName",
      header: "Experience",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {row.getValue("experienceName")}
        </Badge>
      ),
    },
    {
      accessorKey: "moderator",
      header: "Moderator",
      cell: ({ row }) => {
        const moderator = row.getValue("moderator") as string
        const isAutomated = row.original.isAutomated
        
        return (
          <div className="flex items-center gap-1">
            <span className="text-sm">{moderator}</span>
            {isAutomated && (
              <Badge variant="secondary" className="text-xs">Auto</Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => {
        const reason = row.getValue("reason") as string
        return (
          <div className="text-sm max-w-[250px] truncate" title={reason}>
            {reason}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        
        const statusConfig = {
          active: { variant: "default" as const, color: "text-green-600", label: "Active" },
          expired: { variant: "secondary" as const, color: "text-gray-600", label: "Expired" },
          reversed: { variant: "destructive" as const, color: "text-red-600", label: "Reversed" }
        }
        
        const config = statusConfig[status]
        
        return (
          <Badge variant={config.variant} className="text-xs">
            {config.label}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const entry = row.original
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="py-1">
                <div className="px-2 py-1.5 text-sm font-semibold">Actions</div>
                <button
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => navigator.clipboard.writeText(entry.id)}
                >
                  Copy entry ID
                </button>
                <div className="my-1 h-px bg-border" />
                <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">
                  View details
                </button>
                {entry.status === 'active' && entry.action !== ActionType.APPROVE && (
                  <button className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-accent hover:text-accent-foreground">
                    Reverse action
                  </button>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: filteredHistory,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  return (
    <Card className="@container/card shadow-xs overflow-hidden">
      <CardHeader className="space-y-4 p-4 pb-0">
        <CardTitle className="font-clash text-lg font-medium">
          Moderation History ({filteredHistory.length} entries)
        </CardTitle>
        
        {/* Search and Filter Controls */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search history..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Columns
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="py-1">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <div key={column.id} className="flex items-center px-2 py-1.5">
                        <Checkbox
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                          className="mr-2"
                        />
                        <span className="text-sm capitalize">{column.id}</span>
                      </div>
                    )
                  })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No moderation history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}