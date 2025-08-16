export interface BiometricAuthService {
  isSupported(): boolean
  register(username: string): Promise<void>
  authenticate(): Promise<{ success: boolean; username?: string }>
  getRegisteredCredentials(): Promise<string[]>
}

class WebAuthnService implements BiometricAuthService {
  private readonly rpId = typeof window !== "undefined" ? window.location.hostname : "localhost"
  private readonly rpName = "CredentialVault"

  isSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      "credentials" in navigator &&
      "create" in navigator.credentials &&
      typeof PublicKeyCredential !== "undefined"
    )
  }

  async register(username: string): Promise<void> {
    if (!this.isSupported()) {
      throw new Error("WebAuthn is not supported in this browser")
    }

    try {
      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const credential = (await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: this.rpName,
            id: this.rpId,
          },
          user: {
            id: new TextEncoder().encode(username),
            name: username,
            displayName: username,
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" }, // ES256
            { alg: -257, type: "public-key" }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            requireResidentKey: true,
          },
          timeout: 60000,
          attestation: "direct",
        },
      })) as PublicKeyCredential

      if (!credential) {
        throw new Error("Failed to create credential")
      }

      // Store credential info locally
      const credentialInfo = {
        id: credential.id,
        username,
        createdAt: new Date().toISOString(),
      }

      const existingCredentials = this.getStoredCredentials()
      existingCredentials.push(credentialInfo)
      localStorage.setItem("biometric_credentials", JSON.stringify(existingCredentials))
    } catch (error) {
      console.error("Biometric registration failed:", error)
      throw new Error("Failed to register biometric authentication")
    }
  }

  async authenticate(): Promise<{ success: boolean; username?: string }> {
    if (!this.isSupported()) {
      throw new Error("WebAuthn is not supported in this browser")
    }

    try {
      const credentials = this.getStoredCredentials()
      if (credentials.length === 0) {
        throw new Error("No biometric credentials found. Please register first.")
      }

      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const assertion = (await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: credentials.map((cred) => ({
            id: new TextEncoder().encode(cred.id),
            type: "public-key",
          })),
          userVerification: "required",
          timeout: 60000,
        },
      })) as PublicKeyCredential

      if (!assertion) {
        return { success: false }
      }

      // Find matching credential
      const matchingCredential = credentials.find((cred) => cred.id === assertion.id)

      return {
        success: true,
        username: matchingCredential?.username,
      }
    } catch (error) {
      console.error("Biometric authentication failed:", error)
      return { success: false }
    }
  }

  async getRegisteredCredentials(): Promise<string[]> {
    const credentials = this.getStoredCredentials()
    return credentials.map((cred) => cred.username)
  }

  private getStoredCredentials(): Array<{ id: string; username: string; createdAt: string }> {
    try {
      const stored = localStorage.getItem("biometric_credentials")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }
}

export const biometricAuth = new WebAuthnService()
