import { type NextRequest, NextResponse } from "next/server"
import { blockchainService } from "@/lib/blockchain"
import { ipfsService } from "@/lib/ipfs"

export async function GET(request: NextRequest, { params }: { params: { subjectDID: string } }) {
  try {
    const { subjectDID } = params

    if (!subjectDID) {
      return NextResponse.json({ error: "Subject DID parameter is required" }, { status: 400 })
    }

    // Initialize blockchain service
    await blockchainService.initialize()

    // Get credentials for subject
    const credentialIds = await blockchainService.getCredentialsBySubject(subjectDID)

    // Fetch detailed information for each credential
    const credentials = []
    for (const credentialId of credentialIds) {
      try {
        const [isValid, credential] = await blockchainService.verifyCredential(credentialId)

        // Try to get metadata from IPFS
        let metadata = null
        try {
          metadata = await ipfsService.retrieveJSON(credential.metadataURI)
        } catch (error) {
          console.warn(`Failed to retrieve metadata for credential ${credentialId}:`, error)
        }

        credentials.push({
          id: credential.id,
          issuerDID: credential.issuerDID,
          subjectDID: credential.subjectDID,
          credentialType: credential.credentialType,
          credentialHash: credential.credentialHash,
          metadataURI: credential.metadataURI,
          issuanceDate: Number(credential.issuanceDate),
          expirationDate: Number(credential.expirationDate),
          status: credential.status,
          isValid,
          metadata,
        })
      } catch (error) {
        console.warn(`Failed to fetch credential ${credentialId}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      subjectDID,
      credentials,
      count: credentials.length,
    })
  } catch (error) {
    console.error("Credentials retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve credentials", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
