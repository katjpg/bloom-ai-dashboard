import { useState, useEffect } from 'react';
import { robloxApi } from '@/lib/api/roblox';
import { getAvatarUserId, isAvatarMappingEnabled } from '@/lib/avatar-mapping';

/**
 * Custom hook to fetch a Roblox user's avatar headshot URL.
 * Smart fallback system: 
 * 1. Tries original user ID first (for real Roblox users)
 * 2. If that fails and mapping is enabled, falls back to mapped ID (for mock/generated users)
 * @param userId The original user ID (number or string).
 * @returns An object containing the avatar URL, loading state, and error state.
 */
export function useAvatarHeadshot(userId: number | string | null | undefined) {
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Clear previous state and fetch if userId is valid
        if (userId === null || userId === undefined || String(userId).trim() === '' || Number(userId) <= 0) {
            setUrl(null);
            setLoading(false);
            setError(null);
            return; // Don't fetch for invalid or missing IDs
        }

        const fetchAvatar = async () => {
            setLoading(true);
            setError(null);
            setUrl(null); // Clear previous URL while fetching

            try {
                // Step 1: Try original user ID first
                let imageUrl = await robloxApi.getAvatarHeadshotUrl(userId);
                
                // Step 2: If original failed and mapping is enabled, try mapped user ID as fallback
                if (!imageUrl && isAvatarMappingEnabled()) {
                    const mappedUserId = getAvatarUserId(userId);
                    if (mappedUserId && mappedUserId !== userId) {
                        console.log(`Avatar fallback: Original ID ${userId} failed, trying mapped ID ${mappedUserId}`);
                        imageUrl = await robloxApi.getAvatarHeadshotUrl(mappedUserId);
                    }
                }
                
                setUrl(imageUrl); // Set the fetched URL (will be null if both attempts failed)
            } catch (err: any) {
                // Only log actual errors, not 404s for fake user IDs
                if (err.response?.status !== 404) {
                    console.error(`Error in useAvatarHeadshot for user ${userId}:`, err);
                    setError(err.message || "Failed to fetch avatar");
                }
                setUrl(null); // Ensure URL is null on error
            } finally {
                setLoading(false);
            }
        };

        fetchAvatar();

    }, [userId]);

    return {
        url,
        loading,
        error,
    };
}