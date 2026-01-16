import { useMemo } from "react";
import { useAuthUser } from "@/lib/privy/hooks";
import { canUserLivestream, getStreamingBlockedReason } from "./permissions";

/**
 * Hook to check if the current user can create livestreams
 */
export function useCanLivestream() {
  const { userId, userEmail, isAuthenticated } = useAuthUser();

  const canStream = useMemo(() => {
    if (!isAuthenticated) return false;
    return canUserLivestream(userId, userEmail);
  }, [isAuthenticated, userId, userEmail]);

  const blockedReason = useMemo(() => {
    return getStreamingBlockedReason(canStream);
  }, [canStream]);

  return {
    canStream,
    blockedReason,
    isAuthenticated,
  };
}
