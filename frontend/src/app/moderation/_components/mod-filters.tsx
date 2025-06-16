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

  const handlePriorityChange = (priority: PriorityLevel, checked: boolean) => {
    const newPriorities = checked 
      ? [...selectedPriorities, priority]
      : selectedPriorities.filter(p => p !== priority)
    
    setSelectedPriorities(newPriorities)
    onFiltersChange({ priorities: newPriorities, violations: selectedViolations })
  }

  const handleViolationChange = (violation: ContentType, checked: boolean) => {
    const newViolations = checked
      ? [...selectedViolations, violation]
      : selectedViolations.filter(v => v !== violation)
    
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
                  checked={selectedPriorities.includes(option.value)}
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
                  checked={selectedViolations.includes(option.value)}
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