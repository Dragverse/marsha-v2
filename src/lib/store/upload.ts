import { create } from "zustand";
import type { UploadAsset } from "@/types";

interface UploadState {
  currentUpload: UploadAsset | null;
  uploads: UploadAsset[];
  addUpload: (upload: UploadAsset) => void;
  updateUpload: (id: string, update: Partial<UploadAsset>) => void;
  removeUpload: (id: string) => void;
  clearUploads: () => void;
}

export const useUpload = create<UploadState>((set) => ({
  currentUpload: null,
  uploads: [],
  addUpload: (upload) =>
    set((state) => ({
      uploads: [...state.uploads, upload],
      currentUpload: upload,
    })),
  updateUpload: (id, update) =>
    set((state) => ({
      uploads: state.uploads.map((u) =>
        u.id === id ? { ...u, ...update } : u
      ),
      currentUpload:
        state.currentUpload?.id === id
          ? { ...state.currentUpload, ...update }
          : state.currentUpload,
    })),
  removeUpload: (id) =>
    set((state) => ({
      uploads: state.uploads.filter((u) => u.id !== id),
    })),
  clearUploads: () => set({ uploads: [], currentUpload: null }),
}));
