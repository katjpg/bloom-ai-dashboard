import { useState, useCallback, useEffect } from 'react';
import { sentimentApi } from '@/lib/api/sentiment';
import { Message } from '@/types/sentiment';

interface PlayerStats {
  totalMessages: number;
  flaggedMessages: number;
  violations: number;
}

export function usePlayerStats(playerId: number | undefined) {
  const [stats, setStats] = useState<PlayerStats>({
    totalMessages: 0,
    flaggedMessages: 0,
    violations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerStats = useCallback(async () => {
    if (!playerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch all messages for this player
      const messages = await sentimentApi.getMessages({ player_id: playerId });
      
      // Calculate statistics
      const totalMessages = messages.length;
      
      // Count flagged messages (those with moderation action or negative sentiment)
      const flaggedMessages = messages.filter(msg => 
        msg.moderation_action || 
        msg.sentiment_score < -25
      ).length;
      
      // Count violations (messages with moderation action)
      const violations = messages.filter(msg => 
        msg.moderation_action && 
        msg.moderation_action !== 'approved'
      ).length;
      
      setStats({
        totalMessages,
        flaggedMessages,
        violations
      });
      setError(null);
    } catch (err) {
      console.error('Failed to fetch player stats:', err);
      setError('Failed to load player statistics');
      // Set to 0 on error
      setStats({
        totalMessages: 0,
        flaggedMessages: 0,
        violations: 0
      });
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    fetchPlayerStats();
  }, [fetchPlayerStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchPlayerStats
  };
}