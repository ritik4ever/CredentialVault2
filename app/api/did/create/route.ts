import { type NextRequest, NextResponse } from "next/server"
import { blockchainService } from "@/lib/blockchain"

export async function POST(request: NextRequest) {
  try {
    const { did, publicKey, serviceEndpoint, privateKey } = await request.json()

    // Validate input
    if (!did || !publicKey || !serviceEndpoint) {
      return NextResponse.json({ error: "Missing required fields: did, publicKey, serviceEndpoint" }, { status: 400 })
    }

    // Initialize blockchain service with private key
    await blockchainService.initialize(privateKey)

    // Create DID on blockchain
    const transaction = await blockchainService.createDID(did, publicKey, serviceEndpoint)

    return NextResponse.json({
      success: true,
      did,
      transactionHash: transaction.hash,
      blockNumber: transaction.blockNumber,
    })
  } catch (error) {
    console.error("DID creation error:", error)
    return NextResponse.json(
      { error: "Failed to create DID", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
