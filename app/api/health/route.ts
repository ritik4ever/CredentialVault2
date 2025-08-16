import { NextResponse } from "next/server"
import { blockchainService } from "@/lib/blockchain"

export async function GET() {
  try {
    // Initialize blockchain service
    await blockchainService.initialize()

    // Check blockchain connectivity
    const blockNumber = await blockchainService["provider"].getBlockNumber()

    return NextResponse.json({
      success: true,
      status: "healthy",
      blockchain: {
        connected: true,
        latestBlock: blockNumber,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        success: false,
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
