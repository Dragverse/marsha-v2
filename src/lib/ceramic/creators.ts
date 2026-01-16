/* eslint-disable @typescript-eslint/no-explicit-any */
import { getComposeClient } from "./client";

export interface CreateCreatorInput {
  handle: string;
  displayName: string;
  avatar?: string;
  banner?: string;
  description?: string;
  twitterHandle?: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  website?: string;
}

/**
 * Create or update a creator profile
 */
export async function createOrUpdateCreator(input: CreateCreatorInput) {
  const compose = getComposeClient();
  if (!compose) {
    throw new Error("Ceramic is not configured. Run 'npm run ceramic:setup' first.");
  }

  // Check if profile already exists
  const existing = await getCreatorByDID((compose as any).context?.did?.id || "");

  if (existing) {
    // Update existing profile
    const mutation = `
      mutation UpdateCreator($id: ID!, $input: UpdateCreatorInput!) {
        updateCreator(input: { id: $id, content: $input }) {
          document {
            id
            handle
            displayName
            avatar
            banner
            description
            followerCount
            followingCount
            verified
            createdAt
          }
        }
      }
    `;

    const result: any = await compose.executeQuery(mutation, {
      id: existing.id,
      input: {
        ...input,
        updatedAt: new Date().toISOString(),
      },
    });

    return result.data?.updateCreator?.document;
  } else {
    // Create new profile
    const mutation = `
      mutation CreateCreator($input: CreateCreatorInput!) {
        createCreator(input: $input) {
          document {
            id
            handle
            displayName
            avatar
            banner
            description
            followerCount
            followingCount
            verified
            createdAt
          }
        }
      }
    `;

    const result: any = await compose.executeQuery(mutation, {
      input: {
        content: {
          ...input,
          followerCount: 0,
          followingCount: 0,
          verified: false,
          createdAt: new Date().toISOString(),
        },
      },
    });

    return result.data?.createCreator?.document;
  }
}

/**
 * Get a creator profile by DID
 */
export async function getCreatorByDID(did: string) {
  const compose = getComposeClient();
  if (!compose) return null;

  const query = `
    query GetCreator($did: DID!) {
      viewer(id: $did) {
        creator {
          id
          handle
          displayName
          avatar
          banner
          description
          followerCount
          followingCount
          verified
          twitterHandle
          instagramHandle
          tiktokHandle
          website
          createdAt
        }
      }
    }
  `;

  try {
    const result: any = await compose.executeQuery(query, { did });
    return result.data?.viewer?.creator;
  } catch (error) {
    console.error("Error fetching creator:", error);
    return null;
  }
}

/**
 * Get a creator profile by handle
 */
export async function getCreatorByHandle(handle: string) {
  const compose = getComposeClient();
  if (!compose) return null;

  const query = `
    query GetCreatorByHandle($handle: String!) {
      creatorIndex(
        filters: { where: { handle: { equalTo: $handle } } }
        first: 1
      ) {
        edges {
          node {
            id
            handle
            displayName
            avatar
            banner
            description
            followerCount
            followingCount
            verified
            twitterHandle
            instagramHandle
            tiktokHandle
            website
            createdAt
          }
        }
      }
    }
  `;

  try {
    const result: any = await compose.executeQuery(query, { handle });
    const edges = result.data?.creatorIndex?.edges || [];
    return edges.length > 0 ? edges[0].node : null;
  } catch (error) {
    console.error("Error fetching creator by handle:", error);
    return null;
  }
}

/**
 * Search creators by name or handle
 */
export async function searchCreators(searchTerm: string, first = 20) {
  const compose = getComposeClient();
  if (!compose) return [];

  // Note: This is a simplified search. In production, you'd want to use
  // a proper search solution like Algolia or implement text search in your queries
  const query = `
    query SearchCreators($first: Int!) {
      creatorIndex(first: $first) {
        edges {
          node {
            id
            handle
            displayName
            avatar
            description
            followerCount
            verified
          }
        }
      }
    }
  `;

  try {
    const result: any = await compose.executeQuery(query, { first });
    const creators = result.data?.creatorIndex?.edges?.map((edge: any) => edge.node) || [];

    // Client-side filtering (in production, do this server-side)
    const searchLower = searchTerm.toLowerCase();
    return creators.filter((creator: any) =>
      creator.handle.toLowerCase().includes(searchLower) ||
      creator.displayName.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error("Error searching creators:", error);
    return [];
  }
}

/**
 * Update follower/following counts
 */
export async function updateCreatorStats(
  creatorId: string,
  stats: { followerCount?: number; followingCount?: number }
) {
  const compose = getComposeClient();
  if (!compose) {
    throw new Error("Ceramic is not configured. Run 'npm run ceramic:setup' first.");
  }

  const mutation = `
    mutation UpdateCreatorStats($id: ID!, $input: UpdateCreatorInput!) {
      updateCreator(input: { id: $id, content: $input }) {
        document {
          id
          followerCount
          followingCount
        }
      }
    }
  `;

  try {
    const result: any = await compose.executeQuery(mutation, {
      id: creatorId,
      input: stats,
    });
    return result.data?.updateCreator?.document;
  } catch (error) {
    console.error("Error updating creator stats:", error);
    throw error;
  }
}
