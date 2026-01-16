/**
 * Core type definitions for the platform
 */

// User/Creator types
export interface Creator {
  did: string; // Bluesky DID
  handle: string;
  displayName: string;
  avatar: string;
  description: string;
  followerCount: number;
  followingCount: number;
  createdAt: Date;
  verified: boolean;
}

// Content types
export type ContentType = "short" | "long" | "podcast" | "music" | "live";

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number; // in seconds
  views: number;
  likes: number;
  createdAt: Date;
  playbackUrl: string; // Livepeer playback URL
  livepeerAssetId: string;
  contentType: ContentType;
  creator: Creator;
  category: string;
  tags: string[];
}

export interface Comment {
  id: string;
  content: string;
  creator: Creator;
  createdAt: Date;
  likes: number;
  replies?: Comment[];
}

// Auth types
export interface AuthSession {
  did: string;
  handle: string;
  accessJwt: string;
  refreshJwt: string;
  creator?: Creator;
}

export interface UploadAsset {
  id: string;
  status: "uploading" | "processing" | "ready" | "failed";
  progress: number;
  playbackUrl?: string;
  error?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}
