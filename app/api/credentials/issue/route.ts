import { type NextRequest, NextResponse } from "next/server"
import { blockchainService } from "@/lib/blockchain"
import { ipfsService } from "@/lib/ipfs"
import { ethers } from "ethers"

export async function POST(request: NextRequest) {
  try {
    const { credentialId, issuerDID, subjectDID, credentialType, credentialData, expirationDate, privateKey } =
      await request.json()

    // Validate input
    if (!credentialId || !issuerDID || !subjectDID || !credentialType || !credentialData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Upload credential data to IPFS
    const metadataURI = await ipfsService.uploadJSON({
      credentialId,
      issuerDID,
      subjectDID,
      credentialType,
      credentialData,
      issuanceDate: new Date().toISOString(),
      expirationDate: expirationDate ? new Date(expirationDate).toISOString() : null,
    })

    // Create credential hash
    const credentialHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(credentialData)))

    // Create signature (simplified - in production would use proper signing)
    const messageHash = ethers.keccak256(
      ethers.solidityPacked(
        ["string", "string", "string", "string"],
        [credentialId, issuerDID, subjectDID, credentialHash],
      ),
    )

    const wallet = new ethers.Wallet(privateKey)
    const signature = await wallet.signMessage(ethers.getBytes(messageHash))

    // Initialize blockchain service
    await blockchainService.initialize(privateKey)

    // Issue credential on blockchain
    const transaction = await blockchainService.issueCredential(
      credentialId,
      issuerDID,
      subjectDID,
      credentialType,
      credentialHash,
      metadataURI,
      expirationDate ? Math.floor(new Date(expirationDate).getTime() / 1000) : 0,
      signature,
    )

    return NextResponse.json({
      success: true,
      credentialId,
      transactionHash: transaction.hash,
      blockNumber: transaction.blockNumber,
      metadataURI,
      credentialHash,
    })
  } catch (error) {
    console.error("Credential issuance error:", error)
    return NextResponse.json(
      { error: "Failed to issue credential", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
