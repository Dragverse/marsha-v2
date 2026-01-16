/* eslint-disable @typescript-eslint/no-explicit-any */
import { getComposeClient } from "./client";

export interface CreateVideoInput {
  title: string;
  description?: string;
  thumbnail?: string;
  livepeerAssetId: string;
  playbackId?: string;
  playbackUrl?: string;
  duration?: number;
  contentType: "short" | "long" | "podcast" | "music" | "live";
  category: string;
  tags?: string[];
}

/**
 * Create a new video record on Ceramic
 */
export async function createVideo(input: CreateVideoInput) {
  const compose = getComposeClient();
  if (!compose) {
    throw new Error("Ceramic is not configured. Run 'npm run ceramic:setup' first.");
  }

  const mutation = `
    mutation CreateVideo($input: CreateVideoInput!) {
      createVideo(input: $input) {
        document {
          id
          title
          description
          livepeerAssetId
          playbackUrl
          contentType
          category
          tags
          views
          likes
          createdAt
        }
      }
    }
  `;

  const variables = {
    input: {
      content: {
        ...input,
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        creatorDID: (compose as any).context?.did?.id,
      },
    },
  };

  try {
    const result: any = await compose.executeQuery(mutation, variables);
    return result.data?.createVideo?.document;
  } catch (error) {
    console.error("Error creating video:", error);
    throw error;
  }
}

/**
 * Get a video by its stream ID
 */
export async function getVideo(id: string) {
  const compose = getComposeClient();
  if (!compose) return null;

  const query = `
    query GetVideo($id: ID!) {
      node(id: $id) {
        ... on Video {
          id
          title
          description
          thumbnail
          livepeerAssetId
          playbackUrl
          duration
          contentType
          category
          tags
          views
          likes
          createdAt
          creatorDID
          creator {
            handle
            displayName
            avatar
            verified
          }
        }
      }
    }
  `;

  try {
    const result: any = await compose.executeQuery(query, { id });
    return result.data?.node;
  } catch (error) {
    console.error("Error fetching video:", error);
    throw error;
  }
}

/**
 * Get all videos (with pagination)
 */
export async function getVideos(first = 20, after?: string) {
  const compose = getComposeClient();
  if (!compose) return { videos: [], pageInfo: { hasNextPage: false, endCursor: null } };

  const query = `
    query GetVideos($first: Int!, $after: String) {
      videoIndex(first: $first, after: $after) {
        edges {
          node {
            id
            title
            description
            thumbnail
            livepeerAssetId
            playbackUrl
            duration
            contentType
            category
            tags
            views
            likes
            createdAt
            creatorDID
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  try {
    const result: any = await compose.executeQuery(query, { first, after });
    return {
      videos: result.data?.videoIndex?.edges?.map((edge: any) => edge.node) || [],
      pageInfo: result.data?.videoIndex?.pageInfo,
    };
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
}

/**
 * Update video stats (views, likes)
 */
export async function updateVideoStats(
  videoId: string,
  stats: { views?: number; likes?: number }
) {
  const compose = getComposeClient();
  if (!compose) {
    throw new Error("Ceramic is not configured. Run 'npm run ceramic:setup' first.");
  }

  const mutation = `
    mutation UpdateVideo($id: ID!, $input: UpdateVideoInput!) {
      updateVideo(input: { id: $id, content: $input }) {
        document {
          id
          views
          likes
        }
      }
    }
  `;

  try {
    const result: any = await compose.executeQuery(mutation, {
      id: videoId,
      input: stats,
    });
    return result.data?.updateVideo?.document;
  } catch (error) {
    console.error("Error updating video stats:", error);
    throw error;
  }
}

/**
 * Get videos by creator DID
 */
export async function getVideosByCreator(creatorDID: string, first = 20) {
  const compose = getComposeClient();
  if (!compose) return [];

  const query = `
    query GetVideosByCreator($creatorDID: DID!, $first: Int!) {
      videoIndex(
        filters: { where: { creatorDID: { equalTo: $creatorDID } } }
        first: $first
      ) {
        edges {
          node {
            id
            title
            description
            thumbnail
            playbackUrl
            duration
            contentType
            category
            views
            likes
            createdAt
          }
        }
      }
    }
  `;

  try {
    const result: any = await compose.executeQuery(query, { creatorDID, first });
    return result.data?.videoIndex?.edges?.map((edge: any) => edge.node) || [];
  } catch (error) {
    console.error("Error fetching creator videos:", error);
    throw error;
  }
}
