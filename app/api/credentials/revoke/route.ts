import { type NextRequest, NextResponse } from "next/server"
import { blockchainService } from "@/lib/blockchain"

export async function POST(request: NextRequest) {
  try {
    const { credentialId, privateKey } = await request.json()

    if (!credentialId || !privateKey) {
      return NextResponse.json({ error: "Credential ID and private key are required" }, { status: 400 })
    }

    // Initialize blockchain service with private key
    await blockchainService.initialize(privateKey)

    // Revoke credential on blockchain
    const transaction = await blockchainService.credentialRegistry?.revokeCredential(credentialId)
    const receipt = await transaction.wait()

    return NextResponse.json({
      success: true,
      credentialId,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    })
  } catch (error) {
    console.error("Credential revocation error:", error)
    return NextResponse.json(
      { error: "Failed to revoke credential", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
