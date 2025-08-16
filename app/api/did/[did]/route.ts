import { type NextRequest, NextResponse } from "next/server"
import { blockchainService } from "@/lib/blockchain"

export async function GET(request: NextRequest, { params }: { params: { did: string } }) {
  try {
    const { did } = params

    if (!did) {
      return NextResponse.json({ error: "DID parameter is required" }, { status: 400 })
    }

    // Initialize blockchain service
    await blockchainService.initialize()

    // Get DID document from blockchain
    const didDocument = await blockchainService.getDIDDocument(did)

    return NextResponse.json({
      success: true,
      didDocument: {
        did: didDocument.did,
        controller: didDocument.controller,
        publicKey: didDocument.publicKey,
        serviceEndpoint: didDocument.serviceEndpoint,
        created: Number(didDocument.created),
        updated: Number(didDocument.updated),
        active: didDocument.active,
      },
    })
  } catch (error) {
    console.error("DID retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve DID", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
