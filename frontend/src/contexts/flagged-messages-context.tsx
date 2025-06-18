"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useFlaggedMessages as useApiFlag } from '@/hooks/useFlaggedMessages'

interface FlaggedMessagesContextType {
  flaggedMessageIds: Set<string>
  flagMessage: (messageId: string, reason?: string) => Promise<void>
  isFlagged: (messageId: string) => boolean
  isFlagging: (messageId: string) => boolean
  clearFlaggedMessages: () => void
}

const FlaggedMessagesContext = createContext<FlaggedMessagesContextType | undefined>(undefined)

interface FlaggedMessagesProviderProps {
  children: ReactNode
}

export function FlaggedMessagesProvider({ children }: FlaggedMessagesProviderProps) {
  const [flaggedMessageIds, setFlaggedMessageIds] = useState<Set<string>>(new Set())
  const [flaggingIds, setFlaggingIds] = useState<Set<string>>(new Set())
  
  const { flagMessage: apiFlagMessage } = useApiFlag()

  const flagMessage = useCallback(async (messageId: string, reason?: string) => {
    // Don't flag if already flagged or currently flagging
    if (flaggedMessageIds.has(messageId) || flaggingIds.has(messageId)) {
      return
    }

    // Add to flagging set
    setFlaggingIds(prev => new Set([...prev, messageId]))

    try {
      // Call the API to flag the message
      await apiFlagMessage(messageId, reason)
      
      // Add to flagged messages
      setFlaggedMessageIds(prev => new Set([...prev, messageId]))
      
      console.log(`Message ${messageId} flagged successfully (global context)`)
    } catch (error) {
      console.error('Failed to flag message:', error)
      throw error // Re-throw so component can handle the error
    } finally {
      // Remove from flagging set
      setFlaggingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(messageId)
        return newSet
      })
    }
  }, [flaggedMessageIds, flaggingIds, apiFlagMessage])

  const isFlagged = useCallback((messageId: string): boolean => {
    return flaggedMessageIds.has(messageId)
  }, [flaggedMessageIds])

  const isFlagging = useCallback((messageId: string): boolean => {
    return flaggingIds.has(messageId)
  }, [flaggingIds])

  const clearFlaggedMessages = useCallback(() => {
    setFlaggedMessageIds(new Set())
    setFlaggingIds(new Set())
    console.log('Cleared all flagged messages from global context')
  }, [])

  const value: FlaggedMessagesContextType = {
    flaggedMessageIds,
    flagMessage,
    isFlagged,
    isFlagging,
    clearFlaggedMessages
  }

  return (
    <FlaggedMessagesContext.Provider value={value}>
      {children}
    </FlaggedMessagesContext.Provider>
  )
}

export function useFlaggedMessagesContext(): FlaggedMessagesContextType {
  const context = useContext(FlaggedMessagesContext)
  if (context === undefined) {
    throw new Error('useFlaggedMessagesContext must be used within a FlaggedMessagesProvider')
  }
  return context
}