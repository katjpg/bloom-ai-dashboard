/**
 * Avatar Mapping Utility
 * 
 * Maps player IDs to valid Roblox user IDs for consistent avatar display
 * while keeping player names and IDs separate from avatar sources.
 */

// Pool of verified working Roblox user IDs (these return valid avatars)
// These are real Roblox users but we're using their avatars as "stock photos"
const VALID_AVATAR_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
  51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
  71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
  81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
  91, 92, 93, 94, 95, 96, 97, 98, 99, 100
] as const;

/**
 * Simple hash function to consistently map player IDs to avatar IDs
 */
function simpleHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Maps a player ID to a consistent avatar user ID
 * Same player ID will always return the same avatar ID
 * 
 * @param playerId - The original player ID (string or number)
 * @returns A valid Roblox user ID for avatar fetching
 */
export function getAvatarUserId(playerId: string | number | null | undefined): number | null {
  if (!playerId) return null;
  
  const playerIdString = String(playerId);
  const hash = simpleHash(playerIdString);
  const index = hash % VALID_AVATAR_IDS.length;
  
  return VALID_AVATAR_IDS[index];
}

/**
 * Environment variable to enable/disable avatar mapping
 * Set NEXT_PUBLIC_USE_AVATAR_MAPPING=true to enable
 */
export function isAvatarMappingEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check environment variable or default to enabled for better visual experience
  const envSetting = process.env.NEXT_PUBLIC_USE_AVATAR_MAPPING;
  return envSetting !== 'false'; // Default to enabled unless explicitly disabled
}

/**
 * Gets the appropriate user ID for avatar fetching
 * Returns mapped avatar ID if mapping is enabled, otherwise returns original player ID
 * 
 * @param playerId - The original player ID
 * @returns User ID to use for avatar fetching
 */
export function getEffectiveAvatarUserId(playerId: string | number | null | undefined): string | number | null {
  if (!playerId) return null;
  
  if (isAvatarMappingEnabled()) {
    return getAvatarUserId(playerId);
  }
  
  return playerId;
}

/**
 * Debug function to show mapping for a player ID
 */
export function debugAvatarMapping(playerId: string | number): void {
  console.log(`Player ID: ${playerId} → Avatar ID: ${getAvatarUserId(playerId)} (mapping ${isAvatarMappingEnabled() ? 'enabled' : 'disabled'})`);
}