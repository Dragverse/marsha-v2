import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/tips/crypto
 * Track crypto tip transactions
 *
 * This endpoint records crypto tips sent via Web3 wallets (ETH/USDC on Base network)
 * Once Phase 3 (Ceramic) is configured, tips will be saved to the Transaction model
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fromDID, // Will come from authenticated user once Privy auth is integrated
      toDID,
      amount,
      currency,
      txHash,
      videoId,
      message,
    } = body;

    // Validate required fields
    if (!toDID || !amount || !currency || !txHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate currency
    if (!["ETH", "USDC"].includes(currency)) {
      return NextResponse.json(
        { error: "Invalid currency. Must be ETH or USDC" },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // TODO: Once Ceramic is configured, save to Transaction model
    // Example implementation:
    // import { createTransaction } from "@/lib/ceramic/transactions";
    //
    // const transaction = await createTransaction({
    //   fromDID: fromDID || "anonymous",
    //   toDID,
    //   amount,
    //   currency,
    //   paymentType: "crypto",
    //   txHash,
    //   videoID: videoId,
    //   status: "completed",
    //   message,
    //   createdAt: new Date().toISOString(),
    // });

    console.log("Crypto tip recorded:", {
      toDID,
      amount,
      currency,
      txHash,
      videoId,
    });

    return NextResponse.json({
      success: true,
      message: "Tip recorded successfully",
      transactionId: `mock-${Date.now()}`,
      // Once Ceramic is configured, return: transactionId: transaction.id
    });
  } catch (error) {
    console.error("Crypto tip error:", error);
    return NextResponse.json(
      {
        error: "Failed to record tip",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tips/crypto
 * Get crypto tip history for a creator
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorDID = searchParams.get("creatorDID");

    if (!creatorDID) {
      return NextResponse.json(
        { error: "Missing creatorDID parameter" },
        { status: 400 }
      );
    }

    // TODO: Once Ceramic is configured, query transactions
    // import { getTransactionsByCreator } from "@/lib/ceramic/transactions";
    // const transactions = await getTransactionsByCreator(creatorDID, "crypto");

    return NextResponse.json({
      transactions: [],
      totalEarnings: {
        ETH: 0,
        USDC: 0,
      },
      message: "Ceramic pending configuration",
    });
  } catch (error) {
    console.error("Get crypto tips error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tips" },
      { status: 500 }
    );
  }
}
