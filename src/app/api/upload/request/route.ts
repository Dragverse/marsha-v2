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
        { error: "File name is required" },
        { status: 400 }
      );
    }

    // Request upload URL from Livepeer
    const response = await fetch(`${LIVEPEER_API_URL}/asset/request-upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Livepeer API error:", error);
      return NextResponse.json(
        { error: "Failed to get upload URL from Livepeer" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      tusEndpoint: data.tusEndpoint,
      asset: data.asset,
    });
  } catch (error) {
    console.error("Upload request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
