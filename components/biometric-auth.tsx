"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { biometricAuth } from "@/lib/biometric-auth"
import { Fingerprint, Scan, Shield, CheckCircle, AlertCircle, UserCheck } from "lucide-react"

interface BiometricAuthProps {
  onAuthenticate: (username: string) => Promise<void>
  onRegister?: (username: string) => Promise<void>
  isLoading?: boolean
  username?: string
}

export function BiometricAuth({ onAuthenticate, onRegister, isLoading, username }: BiometricAuthProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [registeredUsers, setRegisteredUsers] = useState<string[]>([])
  const [isRegistering, setIsRegistering] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const checkSupport = async () => {
      const supported = biometricAuth.isSupported()
      setIsSupported(supported)

      if (supported) {
        try {
          const users = await biometricAuth.getRegisteredCredentials()
          setRegisteredUsers(users)
        } catch (error) {
          console.error("Failed to get registered credentials:", error)
        }
      }
    }

    checkSupport()
  }, [])

  const handleRegister = async () => {
    if (!username) {
      setError("Username is required for biometric registration")
      return
    }

    try {
      setError("")
      setSuccess("")
      setIsRegistering(true)

      await biometricAuth.register(username)

      if (onRegister) {
        await onRegister(username)
      }

      setSuccess("Biometric authentication registered successfully!")
      const users = await biometricAuth.getRegisteredCredentials()
      setRegisteredUsers(users)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to register biometric authentication")
    } finally {
      setIsRegistering(false)
    }
  }

  const handleAuthenticate = async () => {
    try {
      setError("")
      setSuccess("")
      setIsAuthenticating(true)

      const result = await biometricAuth.authenticate()

      if (result.success && result.username) {
        await onAuthenticate(result.username)
        setSuccess("Authentication successful!")
      } else {
        setError("Biometric authentication failed")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Authentication failed")
    } finally {
      setIsAuthenticating(false)
    }
  }

  if (!isSupported) {
    return (
      <Card className="glass-card border-border/30">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">Biometric authentication is not supported in this browser</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-primary/20 neon-border">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-2">
          <div className="p-3 rounded-full bg-primary/20 neon-border">
            <Fingerprint className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Biometric Authentication
        </CardTitle>
        <CardDescription>Secure access with face unlock or fingerprint</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <p className="text-sm text-green-500">{success}</p>
          </div>
        )}

        {registeredUsers.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Registered Users:</p>
            <div className="flex flex-wrap gap-2">
              {registeredUsers.map((user) => (
                <Badge key={user} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <UserCheck className="h-3 w-3 mr-1" />
                  {user}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {registeredUsers.length > 0 ? (
            <Button
              onClick={handleAuthenticate}
              disabled={isAuthenticating || isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 neon-border"
              size="lg"
            >
              <Scan className="h-4 w-4 mr-2" />
              {isAuthenticating ? "Authenticating..." : "Authenticate with Biometrics"}
            </Button>
          ) : (
            username && (
              <Button
                onClick={handleRegister}
                disabled={isRegistering || isLoading}
                className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 neon-border"
                size="lg"
              >
                <Shield className="h-4 w-4 mr-2" />
                {isRegistering ? "Registering..." : "Register Biometric Auth"}
              </Button>
            )
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground bg-gradient-to-r from-primary/60 to-accent/60 bg-clip-text text-transparent">
            🔒 Your biometric data stays on your device
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
