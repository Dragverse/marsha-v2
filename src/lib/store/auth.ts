import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSession, Creator } from "@/types";

interface AuthState {
  session: AuthSession | null;
  creator: Creator | null;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  setCreator: (creator: Creator) => void;
  clearAuth: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      creator: null,
      isAuthenticated: false,
      setSession: (session) =>
        set({
          session,
          isAuthenticated: true,
        }),
      setCreator: (creator) => set({ creator }),
      clearAuth: () =>
        set({
          session: null,
          creator: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-store",
    }
  )
);
