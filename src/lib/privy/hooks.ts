import { usePrivy } from "@privy-io/react-auth";
import { useAuth } from "@/lib/store/auth";

/**
 * Combined hook that provides both Privy auth and our store
 * No crypto language exposed - just clean auth state
 */
export function useAuthUser() {
  const { authenticated, user, login, logout, ready } = usePrivy();
  const { session, creator } = useAuth();

  return {
    // User info
    isAuthenticated: authenticated,
    user: user,
    session,
    creator,

    // Auth actions (no crypto terminology)
    signIn: login,
    signOut: logout,

    // Loading state
    isReady: ready,

    // Derived values
    userEmail: user?.email?.address,
    userHandle: user?.farcaster?.username || user?.google?.email || user?.email?.address || "user",
    userId: user?.id,
  };
}
