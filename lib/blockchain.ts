import { ethers } from "ethers"

// Contract ABIs (simplified for demo - in production these would be imported from compiled contracts)
const DID_REGISTRY_ABI = [
  "function createDID(string memory _did, string memory _publicKey, string memory _serviceEndpoint) external",
  "function getDIDDocument(string memory _did) external view returns (tuple(string did, address controller, string publicKey, string serviceEndpoint, uint256 created, uint256 updated, bool active))",
  "function verifyDIDController(string memory _did, address _controller) external view returns (bool)",
  "event DIDCreated(string indexed did, address indexed controller, uint256 timestamp)",
]

const CREDENTIAL_REGISTRY_ABI = [
  "function issueCredential(string memory _credentialId, string memory _issuerDID, string memory _subjectDID, string memory _credentialType, string memory _credentialHash, string memory _metadataURI, uint256 _expirationDate, bytes memory _signature) external",
  "function verifyCredential(string memory _credentialId) external view returns (bool isValid, tuple(string id, string issuerDID, string subjectDID, string credentialType, string credentialHash, string metadataURI, uint256 issuanceDate, uint256 expirationDate, uint8 status, bytes signature) credential)",
  "function getCredentialsBySubject(string memory _subjectDID) external view returns (string[] memory)",
  "function revokeCredential(string memory _credentialId) external",
  "event CredentialIssued(string indexed credentialId, string indexed issuerDID, string indexed subjectDID, string credentialType, uint256 timestamp)",
]

const CREDENTIAL_VERIFIER_ABI = [
  "function verifyCredentialWithProof(string memory _credentialId, string memory _expectedHash) external returns (tuple(bool isValid, string credentialId, string issuerDID, string subjectDID, uint256 verificationTimestamp, string reason) result)",
  "function quickVerify(string memory _credentialId) external view returns (bool isValid, string memory issuerDID, uint8 status)",
]

export class BlockchainService {
  private provider: ethers.Provider
  private signer: ethers.Signer | null = null
  private didRegistry: ethers.Contract | null = null
  private credentialRegistry: ethers.Contract | null = null
  private credentialVerifier: ethers.Contract | null = null

  constructor() {
    // Initialize provider (in production, use environment variables)
    this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL || "http://localhost:8545")
  }

  async initialize(privateKey?: string) {
    if (privateKey) {
      this.signer = new ethers.Wallet(privateKey, this.provider)
    }

    // Initialize contracts (addresses would come from deployment)
    const didRegistryAddress = process.env.DID_REGISTRY_ADDRESS || "0x..."
    const credentialRegistryAddress = process.env.CREDENTIAL_REGISTRY_ADDRESS || "0x..."
    const credentialVerifierAddress = process.env.CREDENTIAL_VERIFIER_ADDRESS || "0x..."

    this.didRegistry = new ethers.Contract(didRegistryAddress, DID_REGISTRY_ABI, this.signer || this.provider)
    this.credentialRegistry = new ethers.Contract(
      credentialRegistryAddress,
      CREDENTIAL_REGISTRY_ABI,
      this.signer || this.provider,
    )
    this.credentialVerifier = new ethers.Contract(
      credentialVerifierAddress,
      CREDENTIAL_VERIFIER_ABI,
      this.signer || this.provider,
    )
  }

  async createDID(did: string, publicKey: string, serviceEndpoint: string) {
    if (!this.didRegistry || !this.signer) {
      throw new Error("Blockchain service not properly initialized")
    }

    const tx = await this.didRegistry.createDID(did, publicKey, serviceEndpoint)
    return await tx.wait()
  }

  async getDIDDocument(did: string) {
    if (!this.didRegistry) {
      throw new Error("DID Registry not initialized")
    }

    return await this.didRegistry.getDIDDocument(did)
  }

  async issueCredential(
    credentialId: string,
    issuerDID: string,
    subjectDID: string,
    credentialType: string,
    credentialHash: string,
    metadataURI: string,
    expirationDate: number,
    signature: string,
  ) {
    if (!this.credentialRegistry || !this.signer) {
      throw new Error("Credential Registry not properly initialized")
    }

    const tx = await this.credentialRegistry.issueCredential(
      credentialId,
      issuerDID,
      subjectDID,
      credentialType,
      credentialHash,
      metadataURI,
      expirationDate,
      signature,
    )
    return await tx.wait()
  }

  async verifyCredential(credentialId: string) {
    if (!this.credentialRegistry) {
      throw new Error("Credential Registry not initialized")
    }

    return await this.credentialRegistry.verifyCredential(credentialId)
  }

  async getCredentialsBySubject(subjectDID: string) {
    if (!this.credentialRegistry) {
      throw new Error("Credential Registry not initialized")
    }

    return await this.credentialRegistry.getCredentialsBySubject(subjectDID)
  }
}

export const blockchainService = new BlockchainService()
