import { ethers } from "ethers"

export interface User {
  id: string
  address?: string
  email?: string
  did?: string
  authMethod: "wallet" | "email"
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // Wallet Authentication
  async connectWallet(): Promise<User> {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed")
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found")
      }

      const address = accounts[0]
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      // Create a message to sign for authentication
      const message = `Sign this message to authenticate with CredentialVault.\n\nTimestamp: ${Date.now()}`
      const signature = await signer.signMessage(message)

      // Verify the signature
      const recoveredAddress = ethers.verifyMessage(message, signature)
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        throw new Error("Signature verification failed")
      }

      // Create user object
      const user: User = {
        id: address,
        address: address,
        did: `did:eth:${address}`,
        authMethod: "wallet",
        createdAt: new Date().toISOString(),
      }

      this.currentUser = user
      this.saveUserSession(user)

      return user
    } catch (error) {
      console.error("Wallet connection error:", error)
      throw error
    }
  }

  // Email Authentication
  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Authentication failed")
      }

      const { user, token } = await response.json()

      this.currentUser = user
      this.saveUserSession(user, token)

      return user
    } catch (error) {
      console.error("Email sign-in error:", error)
      throw error
    }
  }

  async signUpWithEmail(email: string, password: string): Promise<User> {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Registration failed")
      }

      const { user, token } = await response.json()

      this.currentUser = user
      this.saveUserSession(user, token)

      return user
    } catch (error) {
      console.error("Email sign-up error:", error)
      throw error
    }
  }

  // Session Management
  private saveUserSession(user: User, token?: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("credential_vault_user", JSON.stringify(user))
      if (token) {
        localStorage.setItem("credential_vault_token", token)
      }
    }
  }

  loadUserSession(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("credential_vault_user")
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          this.currentUser = user
          return user
        } catch (error) {
          console.error("Failed to parse user session:", error)
          this.clearSession()
        }
      }
    }
    return null
  }

  clearSession() {
    this.currentUser = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("credential_vault_user")
      localStorage.removeItem("credential_vault_token")
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("credential_vault_token")
    }
    return null
  }

  async signOut() {
    this.clearSession()

    // If wallet was connected, we might want to disconnect
    if (this.currentUser?.authMethod === "wallet" && window.ethereum) {
      // Note: MetaMask doesn't have a disconnect method, but we clear our session
    }
  }

  // Check if wallet is available
  isWalletAvailable(): boolean {
    return typeof window !== "undefined" && !!window.ethereum
  }
}

export const authService = AuthService.getInstance()

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
