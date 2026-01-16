# Ceramic Network & ComposeDB Setup

This document explains how to set up and use Ceramic Network with ComposeDB for decentralized data storage in Dragverse.

## Overview

Dragverse uses Ceramic Network for storing:
- Creator profiles
- Video metadata
- Social interactions (likes, follows, comments)

All data is stored in a decentralized manner, giving users ownership of their content.

## Prerequisites

1. Node.js 18+ installed
2. Ceramic CLI installed globally:
   ```bash
   npm install -g @composedb/cli
   ```

## Initial Setup

### 1. Generate Admin Seed

First, generate an admin seed for deploying your models:

```bash
composedb did:generate-private-key
```

Save the output seed in your `.env.local`:

```env
CERAMIC_ADMIN_SEED=your_generated_seed_here
```

### 2. Compile the Composite

Compile your GraphQL schemas into a composite:

```bash
composedb composite:create ./composites/*.graphql --output=./composites/__generated__/definition.json --did-private-key=YOUR_ADMIN_SEED
```

### 3. Deploy to Ceramic Network

Deploy your models to the Ceramic network:

```bash
composedb composite:deploy ./composites/__generated__/definition.json --ceramic-url=https://ceramic-temp.hirenodes.io --did-private-key=YOUR_ADMIN_SEED
```

### 4. Generate Runtime Composite

Generate the runtime composite for your application:

```bash
composedb composite:compile ./composites/__generated__/definition.json ./src/lib/ceramic/__generated__/definition.js
```

### 5. Update Environment Variables

Add to your `.env.local`:

```env
# Ceramic Network
NEXT_PUBLIC_CERAMIC_URL=https://ceramic-temp.hirenodes.io
CERAMIC_ADMIN_SEED=your_admin_seed_here
```

## Data Models

### Creator Profile

```graphql
type Creator {
  handle: String!
  displayName: String!
  avatar: String
  banner: String
  description: String
  followerCount: Int
  followingCount: Int
  verified: Boolean
  createdAt: DateTime!
  twitterHandle: String
  instagramHandle: String
  tiktokHandle: String
  website: String
}
```

### Video

```graphql
type Video {
  title: String!
  description: String
  thumbnail: String
  livepeerAssetId: String!
  playbackId: String
  playbackUrl: String
  duration: Int
  contentType: String!
  category: String!
  tags: [String!]
  views: Int
  likes: Int
  createdAt: DateTime!
  creatorDID: DID!
}
```

### Social Models

- **Follow**: Track follower/following relationships
- **Like**: Track video likes
- **Comment**: Threaded comments on videos

## Usage in Code

### Initialize Ceramic Client

```typescript
import { getCeramicClient, authenticateWithSeed } from "@/lib/ceramic/client";

// Authenticate user
const did = await authenticateWithSeed();
console.log("Authenticated as:", did.id);
```

### Create a Video

```typescript
import { createVideo } from "@/lib/ceramic/videos";

const video = await createVideo({
  title: "My Drag Performance",
  description: "An amazing lip sync performance",
  livepeerAssetId: "asset_123",
  playbackUrl: "https://...",
  contentType: "short",
  category: "Entertainment",
  tags: ["lipsync", "drag", "performance"],
});
```

### Query Videos

```typescript
import { getVideos, getVideosByCreator } from "@/lib/ceramic/videos";

// Get all videos
const { videos, pageInfo } = await getVideos(20);

// Get videos by a specific creator
const creatorVideos = await getVideosByCreator("did:key:...");
```

### Create/Update Creator Profile

```typescript
import { createOrUpdateCreator } from "@/lib/ceramic/creators";

const profile = await createOrUpdateCreator({
  handle: "diamonddust",
  displayName: "Diamond Dust",
  description: "Drag artist and content creator",
  avatar: "https://...",
  twitterHandle: "diamonddust",
});
```

## Integration with Upload Flow

Update your upload handler in `src/app/(platform)/upload/page.tsx`:

```typescript
import { createVideo } from "@/lib/ceramic/videos";

// After Livepeer upload completes
const ceramicVideo = await createVideo({
  title: formData.title,
  description: formData.description,
  thumbnail: thumbnailUrl,
  livepeerAssetId: readyAsset.id,
  playbackId: readyAsset.playbackId,
  playbackUrl: readyAsset.playbackUrl,
  duration: readyAsset.duration,
  contentType: formData.contentType,
  category: formData.category,
  tags: formData.tags.split(",").map(t => t.trim()),
});

console.log("Video saved to Ceramic:", ceramicVideo.id);
```

## Development vs Production

### Development (Clay Testnet)

For development, use the Clay testnet:
- URL: `https://ceramic-clay.3boxlabs.com`
- Fast, free, but data is not permanent

### Production (Mainnet)

For production, use Ceramic mainnet:
- URL: `https://ceramic-mainnet.hirenodes.io`
- Requires proper infrastructure setup
- Consider running your own Ceramic node

## Running a Local Ceramic Node

For local development, you can run your own Ceramic node:

```bash
npm install -g @ceramicnetwork/cli
ceramic daemon
```

Then use `http://localhost:7007` as your Ceramic URL.

## Troubleshooting

### Model Not Found Errors

If you get "Model not found" errors:
1. Ensure you've deployed your composite: `composedb composite:deploy`
2. Check that your `CERAMIC_URL` is correct
3. Verify your admin seed is valid

### Authentication Issues

If authentication fails:
1. Check that your DID is properly initialized
2. Ensure the Ceramic client has the DID set
3. For wallet-based auth, verify the provider is connected

### Query Failures

If queries fail:
1. Verify the composite is compiled and loaded
2. Check that field names match your schema
3. Ensure you're authenticated before making mutations

## Next Steps

1. **Implement Authentication**: Integrate with Privy to authenticate users with Ceramic
2. **Add Social Features**: Implement likes, follows, and comments using the social models
3. **Build Feed**: Create a personalized feed based on follows and preferences
4. **Add Search**: Implement full-text search for videos and creators
5. **Optimize Queries**: Add indexes and caching for better performance

## Resources

- [Ceramic Documentation](https://developers.ceramic.network/)
- [ComposeDB Documentation](https://composedb.js.org/)
- [Ceramic Discord](https://discord.com/invite/ceramic)
