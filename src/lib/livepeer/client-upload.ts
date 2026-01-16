/**
 * Client-side Livepeer upload utilities
 * Uses secure backend API routes instead of direct API calls
 */

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
 * Upload video file to Livepeer via backend API
 */
export async function uploadVideoToLivepeer(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<LivepeerAsset> {
  // Step 1: Request upload URL from our backend
  const uploadUrlResponse = await fetch("/api/upload/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: file.name,
    }),
  });

  if (!uploadUrlResponse.ok) {
    throw new Error("Failed to get upload URL");
  }

  const { tusEndpoint, asset } = await uploadUrlResponse.json();

  // Step 2: Upload file using TUS protocol (direct to Livepeer)
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
 * Poll asset status until ready via backend API
 */
export async function waitForAssetReady(
  assetId: string,
  onProgress?: (progress: number) => void
): Promise<LivepeerAsset> {
  const maxAttempts = 120; // 10 minutes (5s intervals)
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(`/api/upload/status/${assetId}`);

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
