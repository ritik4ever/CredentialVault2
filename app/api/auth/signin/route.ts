import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock user database - in production, use a real database
const users = new Map([
  [
    "demo@credentialvault.com",
    {
      id: "user_1",
      email: "demo@credentialvault.com",
      password: "password123", // In production, this would be hashed
      did: "did:email:demo@credentialvault.com",
      createdAt: "2024-01-01T00:00:00Z",
    },
  ],
])

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = users.get(email)
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create session token (in production, use JWT or similar)
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create user response (exclude password)
    const userResponse = {
      id: user.id,
      email: user.email,
      did: user.did,
      authMethod: "email" as const,
      createdAt: user.createdAt,
    }

    // Set HTTP-only cookie
    const cookieStore = cookies()
    cookieStore.set("credential_vault_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      success: true,
      user: userResponse,
      token,
    })
  } catch (error) {
    console.error("Sign-in error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
