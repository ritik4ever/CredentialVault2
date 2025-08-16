"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useCredentials } from "@/hooks/use-credentials"
import { Plus, AlertCircle } from "lucide-react"

export function IssueCredentialDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()
  const { issueCredential } = useCredentials()

  const [formData, setFormData] = useState({
    credentialId: "",
    subjectDID: "",
    credentialType: "",
    title: "",
    description: "",
    issuer: "",
    expirationDate: "",
    privateKey: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.did) {
      setError("User not authenticated")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const credentialData = {
        title: formData.title,
        description: formData.description,
        issuer: formData.issuer,
        recipient: formData.subjectDID,
        type: formData.credentialType,
      }

      await issueCredential({
        credentialId: formData.credentialId,
        issuerDID: user.did,
        subjectDID: formData.subjectDID,
        credentialType: formData.credentialType,
        credentialData,
        expirationDate: formData.expirationDate || undefined,
        privateKey: formData.privateKey,
      })

      // Reset form and close dialog
      setFormData({
        credentialId: "",
        subjectDID: "",
        credentialType: "",
        title: "",
        description: "",
        issuer: "",
        expirationDate: "",
        privateKey: "",
      })
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to issue credential")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Issue Credential
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] backdrop-blur-sm bg-card/95 border-border/50">
        <DialogHeader>
          <DialogTitle>Issue New Credential</DialogTitle>
          <DialogDescription>Create and issue a new verifiable credential on the blockchain.</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credentialId">Credential ID</Label>
              <Input
                id="credentialId"
                placeholder="unique-credential-id"
                value={formData.credentialId}
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                required
                className="backdrop-blur-sm bg-input/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credentialType">Type</Label>
              <Select
                value={formData.credentialType}
                onValueChange={(value) => setFormData({ ...formData, credentialType: value })}
              >
                <SelectTrigger className="backdrop-blur-sm bg-input/50 border-border/50">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="degree">Academic Degree</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="license">Professional License</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="membership">Membership</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjectDID">Recipient DID</Label>
            <Input
              id="subjectDID"
              placeholder="did:eth:0x..."
              value={formData.subjectDID}
              onChange={(e) => setFormData({ ...formData, subjectDID: e.target.value })}
              required
              className="backdrop-blur-sm bg-input/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Bachelor of Computer Science"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="backdrop-blur-sm bg-input/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the credential..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="backdrop-blur-sm bg-input/50 border-border/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issuer">Issuing Organization</Label>
              <Input
                id="issuer"
                placeholder="Stanford University"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                required
                className="backdrop-blur-sm bg-input/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
              <Input
                id="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                className="backdrop-blur-sm bg-input/50 border-border/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="privateKey">Private Key (for signing)</Label>
            <Input
              id="privateKey"
              type="password"
              placeholder="0x..."
              value={formData.privateKey}
              onChange={(e) => setFormData({ ...formData, privateKey: e.target.value })}
              required
              className="backdrop-blur-sm bg-input/50 border-border/50"
            />
            <p className="text-xs text-muted-foreground">
              Your private key is used to sign the credential and is not stored.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? "Issuing..." : "Issue Credential"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
