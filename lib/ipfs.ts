// IPFS service for storing credential metadata
export class IPFSService {
  private apiUrl: string
  private apiKey: string

  constructor() {
    this.apiUrl = process.env.IPFS_API_URL || "https://api.pinata.cloud"
    this.apiKey = process.env.IPFS_API_KEY || ""
  }

  async uploadJSON(data: any): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/pinning/pinJSONToIPFS`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          pinataContent: data,
          pinataMetadata: {
            name: `credential-${Date.now()}.json`,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to upload to IPFS")
      }

      const result = await response.json()
      return `ipfs://${result.IpfsHash}`
    } catch (error) {
      console.error("IPFS upload error:", error)
      throw error
    }
  }

  async retrieveJSON(ipfsHash: string): Promise<any> {
    try {
      const hash = ipfsHash.replace("ipfs://", "")
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`)

      if (!response.ok) {
        throw new Error("Failed to retrieve from IPFS")
      }

      return await response.json()
    } catch (error) {
      console.error("IPFS retrieval error:", error)
      throw error
    }
  }
}

export const ipfsService = new IPFSService()
