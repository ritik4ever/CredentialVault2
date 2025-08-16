import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock user database - in production, use a real database
const users = new Map()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Check if user already exists
    if (users.has(email)) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Create new user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newUser = {
      id: userId,
      email,
      password, // In production, hash this password
      did: `did:email:${email}`,
      createdAt: new Date().toISOString(),
    }

    users.set(email, newUser)

    // Create session token
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create user response (exclude password)
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      did: newUser.did,
      authMethod: "email" as const,
      createdAt: newUser.createdAt,
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
    console.error("Sign-up error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
