import { useState, useCallback, useEffect } from 'react';
import { useFlaggedMessages } from './useFlaggedMessages';
import { Message } from '@/types/sentiment';
import { PriorityLevel } from '@/lib/colors-mod';

export interface QueueItem {
  id: string;
  type: "message";
  priority: PriorityLevel;
  title: string;
  description: string;
  reason: string;
  reportedBy: string;
  timestamp: string;
  experienceId: number;
  experienceName: string;
  status: "pending" | "in_review" | "resolved";
  playerName: string;
  playerId: string;
  messageContent: string;
  messageId: string;
  reportCount: number;
}

export function useQueue() {
    const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getFlaggedMessages } = useFlaggedMessages();
    
    const convertMessageToQueueItem = (message: Message): QueueItem => {
        // Determine priority based on sentiment score and moderation action
        let priority = PriorityLevel.MODERATE;
        if (message.moderation_action) {
            if (['DELETE_MESSAGE', 'BAN'].includes(message.moderation_action)) {
                priority = PriorityLevel.CRITICAL;
            } else if (['KICK', 'MUTE'].includes(message.moderation_action)) {
                priority = PriorityLevel.HIGH;
            }
        } else if (message.sentiment_score && message.sentiment_score < -50) {
            priority = PriorityLevel.HIGH;
        }
        
        return {
            id: `queue_${message.message_id}`,
            type: "message",
            priority,
            title: message.moderation_action ? 
                `${message.moderation_action} - Auto Flagged` : 
                'User Flagged Message',
            description: message.moderation_reason || 'Message flagged by user for review',
            reason: message.flag_reason || message.moderation_reason || 'Flagged for review',
            reportedBy: message.moderation_action ? 'AutoMod AI' : 'User Report',
            timestamp: message.flagged_at || message.created_at,
            experienceId: 1, // Default to Bloom for now
            experienceName: "Bloom",
            status: "pending",
            playerName: message.player_name || `Player${message.player_id}`,
            playerId: message.player_id?.toString() || '0',
            messageContent: message.message,
            messageId: message.message_id,
            reportCount: 1
        };
    };
    
    const fetchQueueItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const flaggedMessages = await getFlaggedMessages(50);
            const items = flaggedMessages.map(convertMessageToQueueItem);
            setQueueItems(items);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch queue items';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [getFlaggedMessages]);
    
    // Auto-fetch on mount
    useEffect(() => {
        fetchQueueItems();
    }, [fetchQueueItems]);
    
    const updateItemStatus = useCallback((itemId: string, status: QueueItem['status']) => {
        setQueueItems(prev => 
            prev.map(item => 
                item.id === itemId ? { ...item, status } : item
            )
        );
    }, []);
    
    return {
        queueItems,
        loading,
        error,
        fetchQueueItems,
        updateItemStatus
    };
}