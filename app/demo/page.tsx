"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shield, CheckCircle, User, GraduationCap, Building, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState<"issue" | "verify">("issue")
  const [issuedCredential, setIssuedCredential] = useState<any>(null)
  const [verificationResult, setVerificationResult] = useState<any>(null)

  const handleIssueCredential = () => {
    // Simulate credential issuance
    const credential = {
      id: `cred_${Date.now()}`,
      type: "University Degree",
      recipient: "John Doe",
      issuer: "MIT",
      issueDate: new Date().toISOString().split("T")[0],
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      status: "Verified",
    }
    setIssuedCredential(credential)
  }

  const handleVerifyCredential = () => {
    // Simulate credential verification
    const result = {
      valid: true,
      issuer: "MIT",
      recipient: "John Doe",
      type: "Bachelor of Science in Computer Science",
      issueDate: "2023-05-15",
      verificationDate: new Date().toISOString().split("T")[0],
      blockchainHash: "0xa1b2c3d4e5f6789012345678901234567890abcdef",
    }
    setVerificationResult(result)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <div className="border-b border-border/50 backdrop-blur-sm bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">CredentialVault Demo</span>
              </div>
            </div>
            <Badge variant="secondary" className="backdrop-blur-sm bg-secondary/20">
              Interactive Demo
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Demo Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 p-1 bg-muted/30 rounded-lg backdrop-blur-sm">
            <Button
              variant={activeDemo === "issue" ? "default" : "ghost"}
              onClick={() => setActiveDemo("issue")}
              className="px-6"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Issue Credential
            </Button>
            <Button
              variant={activeDemo === "verify" ? "default" : "ghost"}
              onClick={() => setActiveDemo("verify")}
              className="px-6"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify Credential
            </Button>
          </div>
        </div>

        {/* Issue Credential Demo */}
        {activeDemo === "issue" && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="backdrop-blur-sm bg-card/30 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-primary" />
                  Issue New Credential
                </CardTitle>
                <CardDescription>Simulate issuing a digital credential to the blockchain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Recipient Name</Label>
                  <Input id="recipient" defaultValue="John Doe" />
                </div>
                <div>
                  <Label htmlFor="credential-type">Credential Type</Label>
                  <Input id="credential-type" defaultValue="Bachelor of Science in Computer Science" />
                </div>
                <div>
                  <Label htmlFor="issuer">Issuing Institution</Label>
                  <Input id="issuer" defaultValue="Massachusetts Institute of Technology" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue="Completed 4-year degree program with focus on algorithms, data structures, and software engineering."
                    rows={3}
                  />
                </div>
                <Button onClick={handleIssueCredential} className="w-full">
                  Issue Credential to Blockchain
                </Button>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/30 border-border/50">
              <CardHeader>
                <CardTitle>Blockchain Transaction</CardTitle>
                <CardDescription>Real-time simulation of credential issuance</CardDescription>
              </CardHeader>
              <CardContent>
                {issuedCredential ? (
                  <div className="space-y-4">
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Credential Successfully Issued
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Credential ID:</strong> {issuedCredential.id}
                      </div>
                      <div>
                        <strong>Recipient:</strong> {issuedCredential.recipient}
                      </div>
                      <div>
                        <strong>Issuer:</strong> {issuedCredential.issuer}
                      </div>
                      <div>
                        <strong>Issue Date:</strong> {issuedCredential.issueDate}
                      </div>
                      <div>
                        <strong>Blockchain Hash:</strong>
                        <code className="text-xs bg-muted p-1 rounded ml-1">{issuedCredential.hash}</code>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                      Permanently Stored on Blockchain
                    </Badge>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Click "Issue Credential" to see the blockchain transaction
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Verify Credential Demo */}
        {activeDemo === "verify" && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="backdrop-blur-sm bg-card/30 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Verify Credential
                </CardTitle>
                <CardDescription>Enter credential details to verify authenticity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="verify-id">Credential ID</Label>
                  <Input id="verify-id" placeholder="Enter credential ID or hash" />
                </div>
                <div>
                  <Label htmlFor="verify-recipient">Recipient Name</Label>
                  <Input id="verify-recipient" defaultValue="John Doe" />
                </div>
                <div>
                  <Label htmlFor="verify-issuer">Expected Issuer</Label>
                  <Input id="verify-issuer" defaultValue="MIT" />
                </div>
                <Button onClick={handleVerifyCredential} className="w-full">
                  Verify on Blockchain
                </Button>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/30 border-border/50">
              <CardHeader>
                <CardTitle>Verification Result</CardTitle>
                <CardDescription>Cryptographic verification from blockchain</CardDescription>
              </CardHeader>
              <CardContent>
                {verificationResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Credential Verified Successfully
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Status:</strong>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-700 ml-2">
                          Valid
                        </Badge>
                      </div>
                      <div>
                        <strong>Recipient:</strong> {verificationResult.recipient}
                      </div>
                      <div>
                        <strong>Issuer:</strong> {verificationResult.issuer}
                      </div>
                      <div>
                        <strong>Credential:</strong> {verificationResult.type}
                      </div>
                      <div>
                        <strong>Issue Date:</strong> {verificationResult.issueDate}
                      </div>
                      <div>
                        <strong>Verified On:</strong> {verificationResult.verificationDate}
                      </div>
                      <div>
                        <strong>Blockchain Hash:</strong>
                        <code className="text-xs bg-muted p-1 rounded ml-1 block mt-1">
                          {verificationResult.blockchainHash}
                        </code>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Click "Verify on Blockchain" to check credential authenticity
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Demo Features */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Demo Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="backdrop-blur-sm bg-card/30 border-border/50">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Blockchain Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All credentials are cryptographically secured and stored on an immutable blockchain.
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/30 border-border/50">
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Instant Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Verify any credential in seconds without contacting the issuing institution.
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/30 border-border/50">
              <CardHeader>
                <User className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">User Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You own and control your credentials completely - no third-party dependencies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-xl font-bold mb-4">Ready to get started?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Create Your Account
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="backdrop-blur-sm bg-card/50 border-border/50">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
