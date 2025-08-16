"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Wallet, Smartphone, Globe, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface WalletOption {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  installed: boolean
  mobile: boolean
  desktop: boolean
}

interface WalletSelectorProps {
  onConnect: (walletId: string) => Promise<void>
  isConnecting: boolean
  children: React.ReactNode
}

export function WalletSelector({ onConnect, isConnecting, children }: WalletSelectorProps) {
  const [wallets, setWallets] = useState<WalletOption[]>([])
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null)

  useEffect(() => {
    const detectWallets = () => {
      const walletOptions: WalletOption[] = [
        {
          id: "metamask",
          name: "MetaMask",
          icon: <Wallet className="h-6 w-6" />,
          description: "Connect using MetaMask wallet",
          installed: !!(window as any).ethereum?.isMetaMask,
          mobile: true,
          desktop: true,
        },
        {
          id: "walletconnect",
          name: "WalletConnect",
          icon: <Smartphone className="h-6 w-6" />,
          description: "Connect with mobile wallets",
          installed: true, // WalletConnect is always available
          mobile: true,
          desktop: true,
        },
        {
          id: "coinbase",
          name: "Coinbase Wallet",
          icon: <Globe className="h-6 w-6" />,
          description: "Connect using Coinbase Wallet",
          installed: !!(window as any).ethereum?.isCoinbaseWallet,
          mobile: true,
          desktop: true,
        },
        {
          id: "injected",
          name: "Browser Wallet",
          icon: <Shield className="h-6 w-6" />,
          description: "Connect with any injected wallet",
          installed: !!(window as any).ethereum,
          mobile: false,
          desktop: true,
        },
      ]
      setWallets(walletOptions)
    }

    detectWallets()

    // Re-detect wallets when window loads (for better detection)
    if (typeof window !== "undefined") {
      window.addEventListener("load", detectWallets)
      return () => window.removeEventListener("load", detectWallets)
    }
  }, [])

  const handleWalletConnect = async (walletId: string) => {
    setConnectingWallet(walletId)
    try {
      await onConnect(walletId)
    } catch (error) {
      console.error("Wallet connection failed:", error)
    } finally {
      setConnectingWallet(null)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription>Choose your preferred wallet to connect to CredentialVault</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <Card
              key={wallet.id}
              className={`cursor-pointer transition-all duration-200 hover:neon-border ${
                wallet.installed ? "opacity-100" : "opacity-60"
              }`}
              onClick={() => wallet.installed && handleWalletConnect(wallet.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">{wallet.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{wallet.name}</h3>
                        {wallet.installed ? (
                          <CheckCircle className="h-4 w-4 text-accent" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{wallet.description}</p>
                      <div className="flex gap-1 mt-1">
                        {wallet.mobile && (
                          <Badge variant="secondary" className="text-xs">
                            Mobile
                          </Badge>
                        )}
                        {wallet.desktop && (
                          <Badge variant="secondary" className="text-xs">
                            Desktop
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {connectingWallet === wallet.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : !wallet.installed ? (
                    <Button variant="outline" size="sm" asChild>
                      <a href={getWalletInstallUrl(wallet.id)} target="_blank" rel="noopener noreferrer">
                        Install
                      </a>
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            New to wallets?{" "}
            <a
              href="https://ethereum.org/en/wallets/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Learn more
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getWalletInstallUrl(walletId: string): string {
  const urls = {
    metamask: "https://metamask.io/download/",
    coinbase: "https://www.coinbase.com/wallet",
    walletconnect: "https://walletconnect.com/",
    injected: "https://ethereum.org/en/wallets/",
  }
  return urls[walletId as keyof typeof urls] || "https://ethereum.org/en/wallets/"
}
