import { NextRequest, NextResponse } from "next/server";

const LIVEPEER_API_URL = "https://livepeer.studio/api";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.LIVEPEER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Livepeer API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Stream name is required" },
        { status: 400 }
      );
    }

    // Create livestream on Livepeer with multi-bitrate profiles
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
      const error = await response.text();
      console.error("Livepeer stream creation error:", error);
      return NextResponse.json(
        { error: "Failed to create livestream" },
        { status: response.status }
      );
    }

    const stream = await response.json();

    // Return stream details
    return NextResponse.json({
      id: stream.id,
      streamKey: stream.streamKey,
      playbackId: stream.playbackId,
      playbackUrl: `https://livepeercdn.studio/hls/${stream.playbackId}/index.m3u8`,
      rtmpIngestUrl: `rtmp://rtmp.livepeer.com/live/${stream.streamKey}`,
    });
  } catch (error) {
    console.error("Stream creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
