/**
 * Livepeer upload utilities
 * Handles video upload, processing, and asset management
 */

const LIVEPEER_API_URL = "https://livepeer.studio/api";

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface LivepeerAsset {
  id: string;
  name: string;
  status: {
    phase: "waiting" | "processing" | "ready" | "failed";
    progress?: number;
  };
  playbackUrl?: string;
  downloadUrl?: string;
  playbackId?: string;
}

/**
 * Upload video file to Livepeer
 */
export async function uploadVideoToLivepeer(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<LivepeerAsset> {
  const apiKey = process.env.NEXT_PUBLIC_LIVEPEER_API_KEY;

  if (!apiKey) {
    throw new Error("Livepeer API key not configured");
  }

  // Step 1: Request upload URL
  const uploadUrlResponse = await fetch(`${LIVEPEER_API_URL}/asset/request-upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: file.name,
    }),
  });

  if (!uploadUrlResponse.ok) {
    throw new Error("Failed to get upload URL from Livepeer");
  }

  const { tusEndpoint, asset } = await uploadUrlResponse.json();

  // Step 2: Upload file using TUS protocol
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({
          loaded: e.loaded,
          total: e.total,
          percentage: Math.round((e.loaded / e.total) * 100),
        });
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200 || xhr.status === 201) {
        resolve(asset);
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.open("PUT", tusEndpoint);
    xhr.setRequestHeader("Upload-Length", file.size.toString());
    xhr.setRequestHeader("Content-Type", "application/offset+octet-stream");
    xhr.send(file);
  });
}

/**
 * Poll asset status until ready
 */
export async function waitForAssetReady(
  assetId: string,
  onProgress?: (progress: number) => void
): Promise<LivepeerAsset> {
  const apiKey = process.env.NEXT_PUBLIC_LIVEPEER_API_KEY;

  if (!apiKey) {
    throw new Error("Livepeer API key not configured");
  }

  const maxAttempts = 120; // 10 minutes (5s intervals)
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(`${LIVEPEER_API_URL}/asset/${assetId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get asset status");
    }

    const asset: LivepeerAsset = await response.json();

    if (onProgress && asset.status.progress) {
      onProgress(asset.status.progress);
    }

    if (asset.status.phase === "ready") {
      return asset;
    }

    if (asset.status.phase === "failed") {
      throw new Error("Asset processing failed");
    }

    // Wait 5 seconds before polling again
    await new Promise((resolve) => setTimeout(resolve, 5000));
    attempts++;
  }

  throw new Error("Asset processing timeout");
}

/**
 * Get playback URL for an asset
 */
export function getPlaybackUrl(playbackId: string): string {
  return `https://livepeercdn.studio/hls/${playbackId}/index.m3u8`;
}

/**
 * Create a livestream
 */
export async function createLivestream(name: string): Promise<{
  id: string;
  streamKey: string;
  playbackUrl: string;
  rtmpIngestUrl: string;
}> {
  const apiKey = process.env.NEXT_PUBLIC_LIVEPEER_API_KEY;

  if (!apiKey) {
    throw new Error("Livepeer API key not configured");
  }

  const response = await fetch(`${LIVEPEER_API_URL}/stream`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      profiles: [
        {
          name: "720p",
          bitrate: 2000000,
          fps: 30,
          width: 1280,
          height: 720,
        },
        {
          name: "480p",
          bitrate: 1000000,
          fps: 30,
          width: 854,
          height: 480,
        },
        {
          name: "360p",
          bitrate: 500000,
          fps: 30,
          width: 640,
          height: 360,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create livestream");
  }

  const stream = await response.json();

  return {
    id: stream.id,
    streamKey: stream.streamKey,
    playbackUrl: `https://livepeercdn.studio/hls/${stream.playbackId}/index.m3u8`,
    rtmpIngestUrl: `rtmp://rtmp.livepeer.com/live/${stream.streamKey}`,
  };
}
