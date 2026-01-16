import { NextRequest, NextResponse } from "next/server";

const LIVEPEER_API_URL = "https://livepeer.studio/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  try {
    const { assetId } = await params;
    const apiKey = process.env.LIVEPEER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Livepeer API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${LIVEPEER_API_URL}/asset/${assetId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to get asset status" },
        { status: response.status }
      );
    }

    const asset = await response.json();

    return NextResponse.json({
      id: asset.id,
      name: asset.name,
      status: asset.status,
      playbackUrl: asset.playbackUrl,
      playbackId: asset.playbackId,
      downloadUrl: asset.downloadUrl,
    });
  } catch (error) {
    console.error("Asset status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
