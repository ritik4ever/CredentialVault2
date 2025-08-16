"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { BiometricAuth } from "@/components/biometric-auth"
import { EnhancedWalletSelector } from "@/components/enhanced-wallet-selector"
import { useAuth } from "@/contexts/auth-context"
import { Shield, Mail, AlertCircle } from "lucide-react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithWallet, signInWithEmail, signInWithBiometric, isWalletAvailable, isBiometricAvailable } = useAuth()
  const router = useRouter()

  const handleWalletSignIn = async (walletId: string) => {
    try {
      setError("")
      setIsLoading(true)
      await signInWithWallet()
      router.push("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError("")
      setIsLoading(true)
      await signInWithEmail(email, password)
      router.push("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBiometricSignIn = async (username: string) => {
    try {
      setError("")
      setIsLoading(true)
      await signInWithBiometric()
      router.push("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Biometric authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Main Sign In Card */}
        <Card className="glass-card relative">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/20 neon-border">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CredentialVault
            </CardTitle>
            <CardDescription className="text-base">Welcome back to the future of credentials</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center space-x-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20 neon-border">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {isWalletAvailable && <EnhancedWalletSelector onConnect={handleWalletSignIn} isConnecting={isLoading} />}

            {isWalletAvailable && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground">Or continue with email</span>
                </div>
              </div>
            )}

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="glass-card border-border/50 focus:neon-border transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="glass-card border-border/50 focus:neon-border transition-all duration-200"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-transparent border-primary/50 hover:bg-primary/10 hover:neon-border transition-all duration-200"
                variant="outline"
                size="lg"
              >
                <Mail className="h-4 w-4 mr-2" />
                {isLoading ? "Signing in..." : "Sign In with Email"}
              </Button>
            </form>

            <div className="text-center space-y-3 pt-4 border-t border-border/30">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-primary hover:text-accent transition-colors font-medium">
                  Sign up
                </Link>
              </p>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>

        {isBiometricAvailable && (
          <div className="space-y-6">
            <BiometricAuth onAuthenticate={handleBiometricSignIn} isLoading={isLoading} username={email} />

            <Card className="glass-card border-accent/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="p-2 rounded-full bg-accent/20">
                      <Shield className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-accent">Enhanced Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Combine biometric authentication with wallet connectivity for maximum security
                  </p>
                  <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
                    <span>🔒 Device-based</span>
                    <span>⚡ Instant access</span>
                    <span>🛡️ Zero-knowledge</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
