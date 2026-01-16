import { create } from "zustand";
import type { Video } from "@/types";

interface PlayerState {
  currentVideo: Video | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  setCurrentVideo: (video: Video) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  reset: () => void;
}

export const usePlayer = create<PlayerState>((set) => ({
  currentVideo: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  playbackRate: 1,
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  reset: () =>
    set({
      currentVideo: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    }),
}));
