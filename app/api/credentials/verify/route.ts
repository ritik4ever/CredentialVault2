import { type NextRequest, NextResponse } from "next/server"
import { blockchainService } from "@/lib/blockchain"
import { ipfsService } from "@/lib/ipfs"

export async function POST(request: NextRequest) {
  try {
    const { credentialId, expectedHash } = await request.json()

    if (!credentialId) {
      return NextResponse.json({ error: "Credential ID is required" }, { status: 400 })
    }

    // Initialize blockchain service
    await blockchainService.initialize()

    // Verify credential on blockchain
    const [isValid, credential] = await blockchainService.verifyCredential(credentialId)

    if (!isValid) {
      return NextResponse.json({
        success: false,
        isValid: false,
        reason: "Credential is not valid or has expired",
      })
    }

    // Retrieve metadata from IPFS
    let metadata = null
    try {
      metadata = await ipfsService.retrieveJSON(credential.metadataURI)
    } catch (error) {
      console.warn("Failed to retrieve metadata from IPFS:", error)
    }

    // Additional hash verification if provided
    if (expectedHash && credential.credentialHash !== expectedHash) {
      return NextResponse.json({
        success: false,
        isValid: false,
        reason: "Credential hash mismatch",
      })
    }

    return NextResponse.json({
      success: true,
      isValid: true,
      credential: {
        id: credential.id,
        issuerDID: credential.issuerDID,
        subjectDID: credential.subjectDID,
        credentialType: credential.credentialType,
        credentialHash: credential.credentialHash,
        metadataURI: credential.metadataURI,
        issuanceDate: Number(credential.issuanceDate),
        expirationDate: Number(credential.expirationDate),
        status: credential.status,
      },
      metadata,
    })
  } catch (error) {
    console.error("Credential verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify credential", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
