"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { ModerationHistory } from '@/app/moderation/_data'

interface ModerationHistoryContextType {
  history: ModerationHistory[]
  addHistoryEntries: (entries: ModerationHistory[]) => void
  clearHistory: () => void
}

const ModerationHistoryContext = createContext<ModerationHistoryContextType | undefined>(undefined)

export function ModerationHistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<ModerationHistory[]>([])

  const addHistoryEntries = useCallback((entries: ModerationHistory[]) => {
    setHistory(prev => [...entries, ...prev])
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return (
    <ModerationHistoryContext.Provider value={{ history, addHistoryEntries, clearHistory }}>
      {children}
    </ModerationHistoryContext.Provider>
  )
}

export function useModerationHistory() {
  const context = useContext(ModerationHistoryContext)
  if (context === undefined) {
    throw new Error('useModerationHistory must be used within a ModerationHistoryProvider')
  }
  return context
}