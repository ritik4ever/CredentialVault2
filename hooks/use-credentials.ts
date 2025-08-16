"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export interface Credential {
  id: string
  issuerDID: string
  subjectDID: string
  credentialType: string
  credentialHash: string
  metadataURI: string
  issuanceDate: number
  expirationDate: number
  status: number
  isValid: boolean
  metadata?: any
}

export function useCredentials() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchCredentials = async () => {
    if (!user?.did) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/credentials/subject/${encodeURIComponent(user.did)}`)

      if (!response.ok) {
        throw new Error("Failed to fetch credentials")
      }

      const data = await response.json()
      setCredentials(data.credentials || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load credentials")
      console.error("Error fetching credentials:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const issueCredential = async (credentialData: {
    credentialId: string
    issuerDID: string
    subjectDID: string
    credentialType: string
    credentialData: any
    expirationDate?: string
    privateKey: string
  }) => {
    try {
      const response = await fetch("/api/credentials/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentialData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to issue credential")
      }

      const result = await response.json()

      // Refresh credentials list
      await fetchCredentials()

      return result
    } catch (err) {
      throw err
    }
  }

  const verifyCredential = async (credentialId: string, expectedHash?: string) => {
    try {
      const response = await fetch("/api/credentials/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credentialId, expectedHash }),
      })

      if (!response.ok) {
        throw new Error("Failed to verify credential")
      }

      return await response.json()
    } catch (err) {
      throw err
    }
  }

  const revokeCredential = async (credentialId: string, privateKey: string) => {
    try {
      const response = await fetch("/api/credentials/revoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credentialId, privateKey }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to revoke credential")
      }

      // Refresh credentials list
      await fetchCredentials()

      return await response.json()
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchCredentials()
  }, [user?.did])

  return {
    credentials,
    isLoading,
    error,
    fetchCredentials,
    issueCredential,
    verifyCredential,
    revokeCredential,
  }
}
