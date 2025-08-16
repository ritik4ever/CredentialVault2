"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useCredentials } from "@/hooks/use-credentials"
import { Verified, AlertCircle, CheckCircle, XCircle } from "lucide-react"

export function VerifyCredentialDialog() {
  const [open, setOpen] = useState(false)
  const [credentialId, setCredentialId] = useState("")
  const [expectedHash, setExpectedHash] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [error, setError] = useState("")
  const { verifyCredential } = useCredentials()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      setError("")
      setVerificationResult(null)

      const result = await verifyCredential(credentialId, expectedHash || undefined)
      setVerificationResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify credential")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setCredentialId("")
    setExpectedHash("")
    setVerificationResult(null)
    setError("")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="backdrop-blur-sm bg-card/50 border-border/50">
          <Verified className="h-4 w-4 mr-2" />
          Verify Credential
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] backdrop-blur-sm bg-card/95 border-border/50">
        <DialogHeader>
          <DialogTitle>Verify Credential</DialogTitle>
          <DialogDescription>Verify the authenticity of a credential using blockchain verification.</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!verificationResult ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="credentialId">Credential ID</Label>
              <Input
                id="credentialId"
                placeholder="Enter credential ID to verify"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                required
                className="backdrop-blur-sm bg-input/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedHash">Expected Hash (Optional)</Label>
              <Input
                id="expectedHash"
                placeholder="0x..."
                value={expectedHash}
                onChange={(e) => setExpectedHash(e.target.value)}
                className="backdrop-blur-sm bg-input/50 border-border/50"
              />
              <p className="text-xs text-muted-foreground">Provide the expected hash for additional verification.</p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {verificationResult.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">
                {verificationResult.isValid ? "Credential Valid" : "Credential Invalid"}
              </span>
              <Badge variant={verificationResult.isValid ? "default" : "destructive"}>
                {verificationResult.isValid ? "Verified" : "Failed"}
              </Badge>
            </div>

            {verificationResult.credential && (
              <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                <div>
                  <Label className="text-sm font-medium">Credential Type</Label>
                  <p className="text-sm text-muted-foreground">{verificationResult.credential.credentialType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Issuer DID</Label>
                  <p className="text-sm text-muted-foreground font-mono">{verificationResult.credential.issuerDID}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Subject DID</Label>
                  <p className="text-sm text-muted-foreground font-mono">{verificationResult.credential.subjectDID}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Issuance Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(verificationResult.credential.issuanceDate * 1000).toLocaleDateString()}
                  </p>
                </div>
                {verificationResult.credential.expirationDate > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Expiration Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(verificationResult.credential.expirationDate * 1000).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            {verificationResult.metadata && (
              <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                <Label className="text-sm font-medium">Credential Details</Label>
                <div className="space-y-2">
                  {verificationResult.metadata.title && (
                    <div>
                      <span className="text-sm font-medium">Title: </span>
                      <span className="text-sm text-muted-foreground">{verificationResult.metadata.title}</span>
                    </div>
                  )}
                  {verificationResult.metadata.description && (
                    <div>
                      <span className="text-sm font-medium">Description: </span>
                      <span className="text-sm text-muted-foreground">{verificationResult.metadata.description}</span>
                    </div>
                  )}
                  {verificationResult.metadata.issuer && (
                    <div>
                      <span className="text-sm font-medium">Issuer: </span>
                      <span className="text-sm text-muted-foreground">{verificationResult.metadata.issuer}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetForm}>
                Verify Another
              </Button>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
