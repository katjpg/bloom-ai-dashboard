"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PriorityLevel, ContentType } from "@/lib/colors-mod"
import { PRIORITY_FILTER_OPTIONS, VIOLATION_FILTER_OPTIONS } from "../_data"

interface ModFiltersProps {
  onFiltersChange: (filters: {
    priorities: PriorityLevel[]
    violations: ContentType[]
  }) => void
}

export default function ModFilters({ onFiltersChange }: ModFiltersProps) {
  const [selectedPriorities, setSelectedPriorities] = useState<PriorityLevel[]>([])
  const [selectedViolations, setSelectedViolations] = useState<ContentType[]>([])

  const handlePriorityChange = (priority: string, checked: boolean) => {
    if (priority === "all") {
      const newPriorities: PriorityLevel[] = []
      setSelectedPriorities(newPriorities)
      onFiltersChange({ priorities: newPriorities, violations: selectedViolations })
      return
    }
    
    const priorityLevel = priority as PriorityLevel
    const newPriorities = checked 
      ? [...selectedPriorities, priorityLevel]
      : selectedPriorities.filter(p => p !== priorityLevel)
    
    setSelectedPriorities(newPriorities)
    onFiltersChange({ priorities: newPriorities, violations: selectedViolations })
  }

  const handleViolationChange = (violation: string, checked: boolean) => {
    if (violation === "all") {
      const newViolations: ContentType[] = []
      setSelectedViolations(newViolations)
      onFiltersChange({ priorities: selectedPriorities, violations: newViolations })
      return
    }
    
    const contentType = violation as ContentType
    const newViolations = checked
      ? [...selectedViolations, contentType]
      : selectedViolations.filter(v => v !== contentType)
    
    setSelectedViolations(newViolations)
    onFiltersChange({ priorities: selectedPriorities, violations: newViolations })
  }

  return (
    <Card className="@container">
      <CardHeader>
        <CardTitle className="font-clash text-lg font-medium">Quick Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Priority Level Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Priority Level</h4>
          <div className="space-y-3">
            {PRIORITY_FILTER_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center gap-3">
                <Checkbox
                  id={`priority-${option.value}`}
                  checked={option.value === "all" ? selectedPriorities.length === 0 : selectedPriorities.includes(option.value as PriorityLevel)}
                  onCheckedChange={(checked) => handlePriorityChange(option.value, !!checked)}
                />
                <label
                  htmlFor={`priority-${option.value}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Violation Type Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Violation Type</h4>
          <div className="space-y-3">
            {VIOLATION_FILTER_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center gap-3">
                <Checkbox
                  id={`violation-${option.value}`}
                  checked={option.value === "all" ? selectedViolations.length === 0 : selectedViolations.includes(option.value as ContentType)}
                  onCheckedChange={(checked) => handleViolationChange(option.value, !!checked)}
                />
                <label
                  htmlFor={`violation-${option.value}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}