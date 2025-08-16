import { ethers } from "ethers"

export interface WalletProvider {
  id: string
  name: string
  connect: () => Promise<string>
  disconnect?: () => Promise<void>
  switchChain?: (chainId: string) => Promise<void>
  addChain?: (chain: ChainConfig) => Promise<void>
}

export interface ChainConfig {
  chainId: string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
}

export interface EnhancedUser {
  id: string
  address?: string
  email?: string
  did?: string
  authMethod: "wallet" | "email"
  walletType?: string
  chainId?: string
  ensName?: string
  createdAt: string
}

export class EnhancedAuthService {
  private static instance: EnhancedAuthService
  private currentUser: EnhancedUser | null = null
  private supportedChains: ChainConfig[] = [
    {
      chainId: "0x1", // Ethereum Mainnet
      chainName: "Ethereum Mainnet",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://mainnet.infura.io/v3/"],
      blockExplorerUrls: ["https://etherscan.io"],
    },
    {
      chainId: "0x89", // Polygon
      chainName: "Polygon",
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      rpcUrls: ["https://polygon-rpc.com/"],
      blockExplorerUrls: ["https://polygonscan.com"],
    },
  ]

  static getInstance(): EnhancedAuthService {
    if (!EnhancedAuthService.instance) {
      EnhancedAuthService.instance = new EnhancedAuthService()
    }
    return EnhancedAuthService.instance
  }

  async connectWallet(walletId = "metamask"): Promise<EnhancedUser> {
    const provider = this.getWalletProvider(walletId)
    if (!provider) {
      throw new Error(`Wallet ${walletId} not available`)
    }

    try {
      const address = await provider.connect()

      // Get additional wallet info
      const chainId = await this.getCurrentChainId()
      const ensName = await this.resolveENSName(address)

      // Create enhanced user object
      const user: EnhancedUser = {
        id: address,
        address: address,
        did: `did:eth:${address}`,
        authMethod: "wallet",
        walletType: walletId,
        chainId: chainId,
        ensName: ensName,
        createdAt: new Date().toISOString(),
      }

      this.currentUser = user
      this.saveUserSession(user)
      return user
    } catch (error) {
      console.error("Enhanced wallet connection error:", error)
      throw error
    }
  }

  private getWalletProvider(walletId: string): WalletProvider | null {
    const providers: Record<string, WalletProvider> = {
      metamask: {
        id: "metamask",
        name: "MetaMask",
        connect: async () => {
          if (!window.ethereum?.isMetaMask) {
            throw new Error("MetaMask not installed")
          }
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          })
          return accounts[0]
        },
        switchChain: async (chainId: string) => {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
          })
        },
        addChain: async (chain: ChainConfig) => {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [chain],
          })
        },
      },
      walletconnect: {
        id: "walletconnect",
        name: "WalletConnect",
        connect: async () => {
          // WalletConnect implementation would go here
          throw new Error("WalletConnect integration coming soon")
        },
      },
      coinbase: {
        id: "coinbase",
        name: "Coinbase Wallet",
        connect: async () => {
          if (!window.ethereum?.isCoinbaseWallet) {
            throw new Error("Coinbase Wallet not installed")
          }
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          })
          return accounts[0]
        },
      },
      injected: {
        id: "injected",
        name: "Browser Wallet",
        connect: async () => {
          if (!window.ethereum) {
            throw new Error("No wallet detected")
          }
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          })
          return accounts[0]
        },
      },
    }

    return providers[walletId] || null
  }

  private async getCurrentChainId(): Promise<string> {
    if (window.ethereum) {
      try {
        return await window.ethereum.request({ method: "eth_chainId" })
      } catch (error) {
        console.error("Failed to get chain ID:", error)
      }
    }
    return "0x1" // Default to Ethereum mainnet
  }

  private async resolveENSName(address: string): Promise<string | undefined> {
    try {
      const provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/")
      const ensName = await provider.lookupAddress(address)
      return ensName || undefined
    } catch (error) {
      console.error("ENS resolution failed:", error)
      return undefined
    }
  }

  async switchChain(chainId: string): Promise<void> {
    if (!this.currentUser?.walletType) {
      throw new Error("No wallet connected")
    }

    const provider = this.getWalletProvider(this.currentUser.walletType)
    if (provider?.switchChain) {
      await provider.switchChain(chainId)

      // Update user chain info
      if (this.currentUser) {
        this.currentUser.chainId = chainId
        this.saveUserSession(this.currentUser)
      }
    }
  }

  getSupportedChains(): ChainConfig[] {
    return this.supportedChains
  }

  getCurrentUser(): EnhancedUser | null {
    return this.currentUser
  }

  private saveUserSession(user: EnhancedUser, token?: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("credential_vault_user", JSON.stringify(user))
      if (token) {
        localStorage.setItem("credential_vault_token", token)
      }
    }
  }

  loadUserSession(): EnhancedUser | null {
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

  async signOut() {
    this.clearSession()
  }

  isWalletAvailable(): boolean {
    return typeof window !== "undefined" && !!window.ethereum
  }
}

export const enhancedAuthService = EnhancedAuthService.getInstance()

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
