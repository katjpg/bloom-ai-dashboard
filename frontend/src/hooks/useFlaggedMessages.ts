import { useState, useCallback } from 'react';
import { moderationApi } from '@/lib/api/moderation';

export function useFlaggedMessages() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const flagMessage = useCallback(async (messageId: string, reason?: string) => {
        setLoading(true);
        setError(null);
        
        try {
            await moderationApi.flagMessage(messageId, reason);
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to flag message';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);
    
    const getFlaggedMessages = useCallback(async (limit: number = 50) => {
        setLoading(true);
        setError(null);
        
        try {
            const messages = await moderationApi.getFlaggedMessages(limit);
            return messages;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch flagged messages';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);
    
    return {
        flagMessage,
        getFlaggedMessages,
        loading,
        error
    };
}