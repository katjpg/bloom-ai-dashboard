import { useState, useCallback, useEffect } from 'react';
import { sentimentApi } from '@/lib/api/sentiment';
import { Player } from '@/types/sentiment';

export function usePlayersData() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const fetchPlayers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await sentimentApi.getPlayers();
            setPlayers(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch players:', err);
            setError('Failed to load players');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlayers();
    }, [fetchPlayers]);

    return {
        players,
        loading,
        error,
        refetch: fetchPlayers
    };
}