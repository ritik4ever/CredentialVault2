"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authService, type AuthState } from "@/lib/auth"
import { biometricAuth } from "@/lib/biometric-auth"

interface AuthContextType extends AuthState {
  signInWithWallet: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signInWithBiometric: () => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  registerBiometric: (username: string) => Promise<void>
  signOut: () => Promise<void>
  isWalletAvailable: boolean
  isBiometricAvailable: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const [isWalletAvailable, setIsWalletAvailable] = useState(false)
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false)

  useEffect(() => {
    // Check if wallet is available
    setIsWalletAvailable(authService.isWalletAvailable())

    // Load existing session
    const user = authService.loadUserSession()
    setAuthState({
      user,
      isLoading: false,
      isAuthenticated: !!user,
    })

    // Listen for wallet account changes
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected wallet
          signOut()
        } else if (authState.user?.authMethod === "wallet") {
          // Account changed, update user
          const newUser = { ...authState.user, address: accounts[0], id: accounts[0] }
          setAuthState((prev) => ({ ...prev, user: newUser }))
          authService["currentUser"] = newUser
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }

    setIsBiometricAvailable(biometricAuth.isSupported())
  }, [])

  const signInWithWallet = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }))
      const user = await authService.connectWallet()
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }))
      const user = await authService.signInWithEmail(email, password)
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signInWithBiometric = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      const result = await biometricAuth.authenticate()
      if (!result.success || !result.username) {
        throw new Error("Biometric authentication failed")
      }

      // Create user session with biometric auth
      const user = {
        id: result.username,
        email: result.username,
        authMethod: "biometric" as const,
        createdAt: new Date().toISOString(),
      }

      authService["currentUser"] = user
      localStorage.setItem("auth_user", JSON.stringify(user))

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }))
      const user = await authService.signUpWithEmail(email, password)
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const registerBiometric = async (username: string) => {
    try {
      await biometricAuth.register(username)
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    await authService.signOut()
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signInWithWallet,
        signInWithEmail,
        signInWithBiometric,
        signUpWithEmail,
        registerBiometric,
        signOut,
        isWalletAvailable,
        isBiometricAvailable,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
