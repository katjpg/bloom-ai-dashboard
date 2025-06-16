"use client"

import React, { useState } from 'react'
import { Check, X, Edit3, AlertTriangle, Clock, Flag, Ban } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ModActionsProps {
  selectedCount: number
  onClearSelection: () => void
  onExecuteAction: (action: string, options?: any) => void
}

type ActionType = 'approve' | 'delete' | 'edit' | 'warn' | 'timeout' | 'escalate' | 'ban'

export default function ModActions({ selectedCount, onClearSelection, onExecuteAction }: ModActionsProps) {
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null)
  const [showTimeoutOptions, setShowTimeoutOptions] = useState(false)
  const [processing, setProcessing] = useState(false)

  const handleAction = (action: ActionType) => {
    setSelectedAction(action)
    if (action !== 'timeout') {
      setShowTimeoutOptions(false)
    }
  }

  const executeAction = async (timeoutDuration?: string) => {
    if (!selectedAction) return
    
    setProcessing(true)
    
    try {
      const options = selectedAction === 'timeout' ? { duration: timeoutDuration } : undefined
      onExecuteAction(selectedAction, options)
      
      // Reset state after successful execution
      setTimeout(() => {
        setProcessing(false)
        setSelectedAction(null)
        setShowTimeoutOptions(false)
        onClearSelection()
      }, 1500)
    } catch (error) {
      setProcessing(false)
      console.error('Action execution failed:', error)
    }
  }

  const actionConfigs = {
    // Message Actions
    approve: { 
      icon: Check, 
      color: 'text-green-600 dark:text-green-400', 
      bgColor: 'bg-green-600/10 dark:bg-green-600/20', 
      borderColor: 'border-green-600/60',
      hoverBg: 'hover:bg-green-600/15'
    },
    delete: { 
      icon: X, 
      color: 'text-red-600 dark:text-red-400', 
      bgColor: 'bg-red-600/10 dark:bg-red-600/20', 
      borderColor: 'border-red-600/60',
      hoverBg: 'hover:bg-red-600/15'
    },
    edit: { 
      icon: Edit3, 
      color: 'text-blue-600 dark:text-blue-400', 
      bgColor: 'bg-blue-600/10 dark:bg-blue-600/20', 
      borderColor: 'border-blue-600/60',
      hoverBg: 'hover:bg-blue-600/15'
    },
    // User Actions
    warn: { 
      icon: AlertTriangle, 
      color: 'text-yellow-600 dark:text-yellow-400', 
      bgColor: 'bg-yellow-600/10 dark:bg-yellow-600/20', 
      borderColor: 'border-yellow-600/60',
      hoverBg: 'hover:bg-yellow-600/15'
    },
    timeout: { 
      icon: Clock, 
      color: 'text-orange-600 dark:text-orange-400', 
      bgColor: 'bg-orange-600/10 dark:bg-orange-600/20', 
      borderColor: 'border-orange-600/60',
      hoverBg: 'hover:bg-orange-600/15'
    },
    escalate: { 
      icon: Flag, 
      color: 'text-purple-600 dark:text-purple-400', 
      bgColor: 'bg-purple-600/10 dark:bg-purple-600/20', 
      borderColor: 'border-purple-600/60',
      hoverBg: 'hover:bg-purple-600/15'
    },
    ban: { 
      icon: Ban, 
      color: 'text-red-700 dark:text-red-300', 
      bgColor: 'bg-red-700/10 dark:bg-red-700/25', 
      borderColor: 'border-red-700/70',
      hoverBg: 'hover:bg-red-700/15'
    }
  }

  const ActionButton = ({ id, label, description, type = 'message' }: {
    id: ActionType
    label: string
    description: string
    type?: 'message' | 'user'
  }) => {
    const config = actionConfigs[id]
    const Icon = config.icon
    const isSelected = selectedAction === id
    
    return (
      <button
        onClick={() => {
          handleAction(id)
          if (id === 'timeout') setShowTimeoutOptions(!showTimeoutOptions)
        }}
        className={`
          w-full p-4 rounded-lg border transition-all duration-200
          ${isSelected 
            ? `${config.bgColor} ${config.borderColor} border-2` 
            : `bg-card hover:bg-muted/30 border-border ${config.hoverBg}`
          }
          ${type === 'user' ? 'hover:scale-[1.01]' : ''}
        `}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-md ${isSelected ? config.bgColor : 'bg-muted/50'}`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-medium text-foreground">{label}</h4>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </button>
    )
  }

  return (
    <Card className="@container/card shadow-xs overflow-hidden h-full">
      <CardHeader className="space-y-4 p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="font-clash text-lg font-medium">Moderation Actions</CardTitle>
          <Button 
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
        </div>
        
        {/* Message Counter */}
        <div className="bg-blue-600/10 dark:bg-blue-600/20 border border-blue-600/60 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Messages Selected</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedCount}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Message Actions */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Message Actions
          </h3>
          <div className="space-y-2">
            <ActionButton 
              id="approve" 
              label="Approve" 
              description="Clear messages for display"
            />
            <ActionButton 
              id="delete" 
              label="Delete" 
              description="Remove message content"
            />
            <ActionButton 
              id="edit" 
              label="Edit/Filter" 
              description="Auto-replace with filtered version"
            />
          </div>
        </div>

        {/* User Actions */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            User Actions
          </h3>
          <div className="space-y-2">
            <ActionButton 
              id="warn" 
              label="Warn" 
              description="Send warning notification to users"
              type="user"
            />
            <ActionButton 
              id="timeout" 
              label="Timeout/Mute" 
              description="Temporary chat restriction"
              type="user"
            />
            
            {/* Timeout Options */}
            {showTimeoutOptions && selectedAction === 'timeout' && (
              <div className="ml-12 space-y-1 animate-in slide-in-from-top-2 duration-200">
                {['15 minutes', '1 hour', '24 hours'].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => executeAction(duration)}
                    className="w-full text-left px-3 py-2 text-sm rounded-md bg-orange-600/10 
                             hover:bg-orange-600/20 text-orange-600 dark:text-orange-300 transition-colors"
                  >
                    {duration}
                  </button>
                ))}
              </div>
            )}
            
            <ActionButton 
              id="escalate" 
              label="Escalate" 
              description="Flag for senior moderator review"
              type="user"
            />
            <ActionButton 
              id="ban" 
              label="Ban" 
              description="Permanent or long-term restriction"
              type="user"
            />
          </div>
        </div>
      </CardContent>

      {/* Action Footer */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={() => executeAction()}
          disabled={!selectedAction || selectedCount === 0 || processing || selectedAction === 'timeout'}
          className={`
            w-full py-3 font-medium transition-all duration-200
            ${selectedAction && selectedCount > 0 && !processing && selectedAction !== 'timeout'
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
              : 'opacity-50 cursor-not-allowed'
            }
          `}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : selectedAction === 'timeout' ? (
            'Select timeout duration above'
          ) : (
            `Apply to ${selectedCount} message${selectedCount !== 1 ? 's' : ''}`
          )}
        </Button>
        
        {selectedAction && selectedAction !== 'timeout' && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Action: <span className="text-foreground font-medium">
              {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
            </span>
          </p>
        )}
      </div>
    </Card>
  )
}