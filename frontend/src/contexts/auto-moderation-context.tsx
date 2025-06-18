"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { sentimentApi } from '@/lib/api/sentiment'
import { useFlaggedMessagesContext } from './flagged-messages-context'
import { generateHistoryEntry } from '@/data/mock-data'
import { ActionType } from '@/lib/colors-mod'

// Types for moderation results
interface PIIResult {
  pii_presence: boolean
  pii_type?: string
  pii_intent?: boolean
}

interface ContentResult {
  main_category: string
  categories: Record<string, number>
}

interface ModAction {
  action: string
  reason: string
}

interface ModerationState {
  message: any
  pii_result?: PIIResult
  content_result?: ContentResult
  recommended_action?: ModAction
}

interface ModerationResponse {
  moderation_state: ModerationState
}

interface AutoModerationContextType {
  isAutoModEnabled: boolean
  toggleAutoMod: () => void
  processMessage: (messageData: any) => Promise<void>
  processExistingMessages: (messages: any[]) => void
  deletedMessageIds: Set<string>
  flaggedMessageIds: Set<string>
  processing: boolean
  moderationHistory: any[]
  addToHistory: (entry: any) => void
}

const AutoModerationContext = createContext<AutoModerationContextType | undefined>(undefined)

export function useAutoModeration() {
  const context = useContext(AutoModerationContext)
  if (!context) {
    throw new Error('useAutoModeration must be used within an AutoModerationProvider')
  }
  return context
}

interface AutoModerationProviderProps {
  children: React.ReactNode
}

export function AutoModerationProvider({ children }: AutoModerationProviderProps) {
  const [isAutoModEnabled, setIsAutoModEnabled] = useState(false)
  const [deletedMessageIds, setDeletedMessageIds] = useState<Set<string>>(new Set())
  const [flaggedMessageIds, setFlaggedMessageIds] = useState<Set<string>>(new Set())
  const [processing, setProcessing] = useState(false)
  const [moderationHistory, setModerationHistory] = useState<any[]>([])
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(new Set())
  
  // Access flagged messages context if available (only when wrapped)
  let flagMessagesContext: any = null
  try {
    flagMessagesContext = useFlaggedMessagesContext()
  } catch {
    // Context not available, that's ok for testing
  }

  const toggleAutoMod = useCallback(() => {
    setIsAutoModEnabled(prev => {
      const newValue = !prev
      console.log(`Auto-moderation ${newValue ? 'ENABLED' : 'DISABLED'}`)
      return newValue
    })
  }, [])

  const addToHistory = useCallback((entry: any) => {
    setModerationHistory(prev => [entry, ...prev])
  }, [])

  const markMessageAsProcessed = useCallback((messageId: string) => {
    setProcessedMessageIds(prev => new Set([...prev, messageId]))
  }, [])

  const processMessage = useCallback(async (messageData: any) => {
    console.log('processMessage called:', { 
      messageId: messageData.message_id, 
      isAutoModEnabled, 
      message: messageData.message 
    });
    
    if (!isAutoModEnabled) {
      console.log('Auto-mod not enabled, skipping processing');
      return
    }

    setProcessing(true)

    try {
      console.log('Auto-mod processing message:', messageData.message_id)

      // Check if message already has moderation results (from backend)
      if (messageData.moderation_action && messageData.moderation_reason) {
        console.log(`Message ${messageData.message_id} already moderated: ${messageData.moderation_action}`)
        
        // Check if this message has already been processed to avoid duplicates
        if (processedMessageIds.has(messageData.message_id)) {
          console.log(`Message ${messageData.message_id} already processed, skipping`)
          setProcessing(false)
          return
        }
        
        // Handle DELETE_MESSAGE actions - Auto-delete from UI
        if (messageData.moderation_action === 'DELETE_MESSAGE') {
          console.log(`Auto-deleting message ${messageData.message_id} due to: ${messageData.moderation_reason}`)
          setDeletedMessageIds(prev => new Set([...prev, messageData.message_id]))
          
          // Create history entry for auto-deletion
          const historyEntry = {
            id: `auto_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            timestamp: new Date().toISOString(),
            action: ActionType.DELETE_MESSAGE,
            moderator: "Auto-Mod System",
            moderatorRole: "ADMIN",
            playerId: messageData.player_id,
            playerName: messageData.player_name,
            experienceId: 1,
            experienceName: "Bloom",
            messageIds: [messageData.message_id],
            messageContent: messageData.message,
            affectedMessagesCount: 1,
            reason: `Auto-deleted: ${messageData.moderation_reason}`,
            status: 'active' as const,
            isAutomated: true
          }
          addToHistory(historyEntry)
        }
        
        // Handle other violations - Auto-flag for review
        else if (messageData.moderation_action !== 'APPROVE') {
          console.log(`Auto-flagging message ${messageData.message_id} for: ${messageData.moderation_reason}`)
          setFlaggedMessageIds(prev => new Set([...prev, messageData.message_id]))
          
          // Create history entry for auto-flagging
          const historyEntry = {
            id: `auto_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            timestamp: new Date().toISOString(),
            action: ActionType.WARNING,
            moderator: "Auto-Mod System", 
            moderatorRole: "ADMIN",
            playerId: messageData.player_id,
            playerName: messageData.player_name,
            experienceId: 1,
            experienceName: "Bloom",
            messageIds: [messageData.message_id],
            messageContent: messageData.message,
            affectedMessagesCount: 1,
            reason: `Auto-flagged: ${messageData.moderation_reason}`,
            status: 'active' as const,
            isAutomated: true
          }
          addToHistory(historyEntry)
          
          // Add to global flagged messages context if available
          if (flagMessagesContext?.flagMessage) {
            try {
              await flagMessagesContext.flagMessage(
                messageData.message_id, 
                `Auto-flagged: ${messageData.moderation_reason}`
              )
            } catch (error) {
              console.error('Failed to auto-flag message in global context:', error)
            }
          }
        }
        
        // Mark message as processed to prevent duplicates
        markMessageAsProcessed(messageData.message_id)
        
        setProcessing(false)
        return
      }

      // If no moderation results in message, call moderation API (fallback)
      console.log('No moderation results found, calling /moderate API...')
      
      const moderationRequest = {
        message: messageData.message,
        message_id: messageData.message_id,
        player_id: messageData.player_id,
        player_name: messageData.player_name
      }

      const response = await fetch('/api/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moderationRequest)
      })

      if (!response.ok) {
        throw new Error(`Moderation API error: ${response.status}`)
      }

      const moderationResult: ModerationResponse = await response.json()
      const { moderation_state } = moderationResult

      console.log('Moderation result:', moderation_state)

      // Handle PII Detection - Auto-delete messages
      if (moderation_state.pii_result?.pii_presence && 
          moderation_state.recommended_action?.action === 'DELETE_MESSAGE') {
        
        console.log(`Auto-deleting message ${messageData.message_id} due to PII detection`)
        setDeletedMessageIds(prev => new Set([...prev, messageData.message_id]))
      }

      // Handle Content Violations - Auto-flag for review
      if (moderation_state.content_result?.main_category && 
          moderation_state.content_result.main_category !== 'OK') {
        
        console.log(`Auto-flagging message ${messageData.message_id} for content violation: ${moderation_state.content_result.main_category}`)
        setFlaggedMessageIds(prev => new Set([...prev, messageData.message_id]))
        
        // Add to global flagged messages context if available
        if (flagMessagesContext?.flagMessage) {
          try {
            await flagMessagesContext.flagMessage(
              messageData.message_id, 
              `Auto-flagged: Content violation (${moderation_state.content_result.main_category})`
            )
          } catch (error) {
            console.error('Failed to auto-flag message in global context:', error)
          }
        }
      }

    } catch (error) {
      console.error('Auto-moderation error:', error)
    } finally {
      setProcessing(false)
    }
  }, [isAutoModEnabled, flagMessagesContext, processedMessageIds, markMessageAsProcessed, addToHistory])

  const processExistingMessages = useCallback((messages: any[]) => {
    if (!isAutoModEnabled) {
      return
    }

    console.log('Processing existing messages for auto-moderation results (no API calls):', messages.length)
    
    messages.forEach(messageData => {
      // Only process messages that already have moderation results from backend (e.g. from /analyze)
      // Do NOT call moderation API - just process existing results
      if (messageData.moderation_action && messageData.moderation_reason) {
        // Check if this message has already been processed to avoid duplicates
        if (processedMessageIds.has(messageData.message_id)) {
          console.log(`Message ${messageData.message_id} already processed, skipping`)
          return
        }
        
        console.log(`Processing existing message ${messageData.message_id} with action: ${messageData.moderation_action}`)
        
        // Handle DELETE_MESSAGE actions - Auto-delete from UI
        if (messageData.moderation_action === 'DELETE_MESSAGE') {
          console.log(`Auto-deleting existing message ${messageData.message_id} due to: ${messageData.moderation_reason}`)
          setDeletedMessageIds(prev => new Set([...prev, messageData.message_id]))
          
          // Create history entry for auto-deletion
          const historyEntry = {
            id: `auto_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            timestamp: new Date().toISOString(),
            action: ActionType.DELETE_MESSAGE,
            moderator: "Auto-Mod System",
            moderatorRole: "ADMIN",
            playerId: messageData.player_id,
            playerName: messageData.player_name,
            experienceId: 1,
            experienceName: "Bloom",
            messageIds: [messageData.message_id],
            messageContent: messageData.message,
            affectedMessagesCount: 1,
            reason: `Auto-deleted: ${messageData.moderation_reason}`,
            status: 'active' as const,
            isAutomated: true
          }
          addToHistory(historyEntry)
        }
        
        // Handle other violations - Auto-flag for review
        else if (messageData.moderation_action !== 'APPROVE') {
          console.log(`Auto-flagging existing message ${messageData.message_id} for: ${messageData.moderation_reason}`)
          setFlaggedMessageIds(prev => new Set([...prev, messageData.message_id]))
          
          // Create history entry for auto-flagging
          const historyEntry = {
            id: `auto_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            timestamp: new Date().toISOString(),
            action: ActionType.WARNING,
            moderator: "Auto-Mod System",
            moderatorRole: "ADMIN", 
            playerId: messageData.player_id,
            playerName: messageData.player_name,
            experienceId: 1,
            experienceName: "Bloom",
            messageIds: [messageData.message_id],
            messageContent: messageData.message,
            affectedMessagesCount: 1,
            reason: `Auto-flagged: ${messageData.moderation_reason}`,
            status: 'active' as const,
            isAutomated: true
          }
          addToHistory(historyEntry)
        }
        
        // Mark message as processed to prevent duplicates
        markMessageAsProcessed(messageData.message_id)
      }
    })
  }, [isAutoModEnabled, addToHistory, processedMessageIds, markMessageAsProcessed])

  const value: AutoModerationContextType = {
    isAutoModEnabled,
    toggleAutoMod,
    processMessage,
    processExistingMessages,
    deletedMessageIds,
    flaggedMessageIds,
    processing,
    moderationHistory,
    addToHistory
  }

  return (
    <AutoModerationContext.Provider value={value}>
      {children}
    </AutoModerationContext.Provider>
  )
}