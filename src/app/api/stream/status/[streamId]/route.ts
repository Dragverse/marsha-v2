import { NextRequest, NextResponse } from "next/server";

const LIVEPEER_API_URL = "https://livepeer.studio/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ streamId: string }> }
) {
  try {
    const { streamId } = await params;
    const apiKey = process.env.LIVEPEER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Livepeer API key not configured" },
        { status: 500 }
      );
    }

    // Query Livepeer API for stream status
    const response = await fetch(`${LIVEPEER_API_URL}/stream/${streamId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Stream not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Failed to fetch stream status" },
        { status: response.status }
      );
    }

    const stream = await response.json();

    return NextResponse.json({
      id: stream.id,
      name: stream.name,
      isActive: stream.isActive || false,
      playbackId: stream.playbackId,
      playbackUrl: stream.playbackId
        ? `https://livepeercdn.studio/hls/${stream.playbackId}/index.m3u8`
        : null,
      createdAt: stream.createdAt,
      lastSeen: stream.lastSeen,
    });
  } catch (error) {
    console.error("Stream status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
