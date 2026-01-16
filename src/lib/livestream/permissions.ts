/**
 * Livestream permissions system
 * Controls who can access the Go Live feature
 *
 * For cost control, only allowlisted users can create livestreams.
 * You can add users by their Privy user ID or email.
 */

// Allowlist of users who can create livestreams
// Add Privy user IDs or email addresses here
const LIVESTREAM_ALLOWLIST: string[] = [
  // Add founder/admin emails or Privy IDs here
  // Example: "founder@dragverse.com",
  // Example: "did:privy:abc123...",
];

// Environment variable override - comma-separated list of allowed users
const ENV_ALLOWLIST = process.env.NEXT_PUBLIC_LIVESTREAM_ALLOWLIST?.split(",").map(s => s.trim()).filter(Boolean) || [];

// Combined allowlist
const getAllowlist = (): string[] => {
  return [...LIVESTREAM_ALLOWLIST, ...ENV_ALLOWLIST];
};

/**
 * Check if a user is allowed to create livestreams
 */
export function canUserLivestream(userId?: string, userEmail?: string): boolean {
  if (!userId && !userEmail) return false;

  const allowlist = getAllowlist();

  // If no allowlist configured, no one can stream (except in development)
  if (allowlist.length === 0) {
    // In development, allow everyone if no allowlist
    if (process.env.NODE_ENV === "development") {
      return true;
    }
    return false;
  }

  // Check if user ID or email is in allowlist
  if (userId && allowlist.includes(userId)) return true;
  if (userEmail && allowlist.includes(userEmail.toLowerCase())) return true;

  return false;
}

/**
 * Get the reason why a user cannot stream
 */
export function getStreamingBlockedReason(canStream: boolean): string | null {
  if (canStream) return null;
  return "Livestreaming is currently available to select creators. Apply to join the beta program.";
}
