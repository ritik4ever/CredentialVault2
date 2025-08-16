"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Wallet, ExternalLink, Copy, CheckCircle, AlertTriangle, Zap, Shield, Globe } from "lucide-react"

interface WalletInfo {
  id: string
  name: string
  icon: string
  description: string
  isInstalled: boolean
  downloadUrl?: string
  features: string[]
}

interface EnhancedWalletSelectorProps {
  onConnect: (walletId: string) => Promise<void>
  isConnecting?: boolean
  connectedWallet?: {
    address: string
    balance?: string
    chainId?: number
    ensName?: string
  }
}

const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Most popular Ethereum wallet",
    isInstalled: false,
    downloadUrl: "https://metamask.io/download/",
    features: ["DeFi", "NFTs", "Browser Extension"],
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "🔗",
    description: "Connect any mobile wallet",
    isInstalled: true,
    features: ["Mobile", "Multi-chain", "QR Code"],
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🔵",
    description: "Self-custody wallet by Coinbase",
    isInstalled: false,
    downloadUrl: "https://wallet.coinbase.com/",
    features: ["DApps", "DeFi", "Mobile & Desktop"],
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: "👻",
    description: "Solana & Ethereum wallet",
    isInstalled: false,
    downloadUrl: "https://phantom.app/",
    features: ["Solana", "Ethereum", "NFTs"],
  },
]

export function EnhancedWalletSelector({ onConnect, isConnecting, connectedWallet }: EnhancedWalletSelectorProps) {
  const [wallets, setWallets] = useState<WalletInfo[]>(SUPPORTED_WALLETS)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Check which wallets are installed
    const checkWalletInstallation = () => {
      const updatedWallets = wallets.map((wallet) => {
        let isInstalled = false

        if (typeof window !== "undefined") {
          switch (wallet.id) {
            case "metamask":
              isInstalled = !!(window as any).ethereum?.isMetaMask
              break
            case "coinbase":
              isInstalled = !!(window as any).ethereum?.isCoinbaseWallet
              break
            case "phantom":
              isInstalled = !!(window as any).phantom?.ethereum
              break
            case "walletconnect":
              isInstalled = true // Always available
              break
          }
        }

        return { ...wallet, isInstalled }
      })

      setWallets(updatedWallets)
    }

    checkWalletInstallation()
  }, [])

  const handleConnect = async (walletId: string) => {
    try {
      setError("")
      setSelectedWallet(walletId)
      await onConnect(walletId)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to connect wallet")
      setSelectedWallet(null)
    }
  }

  const copyAddress = async () => {
    if (connectedWallet?.address) {
      await navigator.clipboard.writeText(connectedWallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getChainName = (chainId: number) => {
    const chains: Record<number, string> = {
      1: "Ethereum",
      137: "Polygon",
      56: "BSC",
      43114: "Avalanche",
      250: "Fantom",
      42161: "Arbitrum",
      10: "Optimism",
    }
    return chains[chainId] || `Chain ${chainId}`
  }

  if (connectedWallet) {
    return (
      <Card className="glass-card border-primary/20 neon-border">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-2">
            <div className="p-3 rounded-full bg-green-500/20 border border-green-500/30">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-lg text-green-500">Wallet Connected</CardTitle>
          <CardDescription>Your Web3 identity is active</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="space-y-1">
                <p className="text-sm font-medium">Address</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {connectedWallet.ensName || formatAddress(connectedWallet.address)}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={copyAddress} className="h-8 w-8 p-0">
                {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {connectedWallet.balance && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/20">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Balance</p>
                  <p className="text-xs text-muted-foreground">
                    {Number.parseFloat(connectedWallet.balance).toFixed(4)} ETH
                  </p>
                </div>
                <Zap className="h-4 w-4 text-accent" />
              </div>
            )}

            {connectedWallet.chainId && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Network</p>
                  <p className="text-xs text-muted-foreground">{getChainName(connectedWallet.chainId)}</p>
                </div>
                <Globe className="h-4 w-4 text-blue-500" />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <Shield className="h-4 w-4 text-green-500" />
            <p className="text-sm text-green-500">Secure connection established</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-2">
          <div className="p-3 rounded-full bg-primary/20 neon-border">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Connect Your Wallet
        </CardTitle>
        <CardDescription>Choose your preferred Web3 wallet to continue</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <div key={wallet.id} className="space-y-2">
              <Button
                onClick={() => handleConnect(wallet.id)}
                disabled={isConnecting || !wallet.isInstalled}
                className={`w-full justify-start h-auto p-4 ${
                  wallet.isInstalled
                    ? "glass-card border-border/50 hover:border-primary/50 hover:neon-border"
                    : "glass-card border-border/30 opacity-60"
                }`}
                variant="outline"
              >
                <div className="flex items-center space-x-4 w-full">
                  <div className="text-2xl">{wallet.icon}</div>
                  <div className="flex-1 text-left space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{wallet.name}</p>
                      {wallet.isInstalled ? (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Installed
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                          Not Installed
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{wallet.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {wallet.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs px-2 py-0">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {isConnecting && selectedWallet === wallet.id && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                  )}
                </div>
              </Button>

              {!wallet.isInstalled && wallet.downloadUrl && (
                <div className="ml-4 pl-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    <a href={wallet.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Install {wallet.name}
                    </a>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">New to Web3 wallets?</p>
          <Button variant="ghost" size="sm" asChild className="text-xs text-primary hover:text-accent">
            <a href="https://ethereum.org/en/wallets/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" />
              Learn about wallets
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
