import { NextResponse } from "next/server";

const LIVEPEER_API_URL = "https://livepeer.studio/api";
const OFFICIAL_STREAM_ID = "fb7fdq50-qncz-bi4u-0000-000000000000"; // Extract from HLS URL

export async function GET() {
  try {
    const apiKey = process.env.LIVEPEER_API_KEY;

    if (!apiKey) {
      console.error("LIVEPEER_API_KEY not found in environment variables");
      return NextResponse.json(
        { isLive: false, error: "API key not configured" },
        { status: 500 }
      );
    }

    // Call Livepeer API to check stream status
    const response = await fetch(
      `${LIVEPEER_API_URL}/stream/${OFFICIAL_STREAM_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // If stream not found or API error, fallback to HLS check
      console.warn(`Livepeer API returned ${response.status}, falling back to HLS check`);
      return fallbackHLSCheck();
    }

    const streamData = await response.json();

    return NextResponse.json({
      isLive: streamData.isActive || false,
      streamId: OFFICIAL_STREAM_ID,
      viewerCount: streamData.viewerCount || 0,
      startedAt: streamData.lastSeen || null,
    });
  } catch (error) {
    console.error("Error checking stream status:", error);
    // Fallback to HLS manifest check if API fails
    return fallbackHLSCheck();
  }
}

// Fallback method: Check HLS manifest availability
async function fallbackHLSCheck() {
  try {
    const HLS_URL = "https://livepeercdn.studio/hls/fb7fdq50qnczbi4u/index.m3u8";
    const response = await fetch(HLS_URL, { method: "HEAD" });
    const contentType = response.headers.get("content-type");

    const isLive =
      response.ok &&
      contentType?.includes("application/vnd.apple.mpegurl");

    return NextResponse.json({
      isLive,
      fallback: true,
      method: "HLS manifest check",
    });
  } catch {
    return NextResponse.json({
      isLive: false,
      fallback: true,
      error: "Failed to check stream status",
    });
  }
}
