import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDatabase } from "@/lib/database"
import { deriveKey } from "@/lib/crypto"

export async function POST(request: NextRequest) {
  try {
    console.log("Login attempt started")

    const body = await request.json()
    const { username, password } = body

    console.log("Login data received:", {
      username: username ? "provided" : "missing",
      password: password ? "provided" : "missing",
    })

    if (!username || !password) {
      console.log("Missing username or password")
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    console.log("Getting database connection...")
    const db = await getDatabase()
    console.log("Database connection established")

    // Get user
    console.log("Looking up user...")
    const user = await db.get("SELECT id, username, password_hash, salt FROM users WHERE username = ?", [username])

    if (!user) {
      console.log("User not found")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("User found, checking password...")
    const passwordValid = await bcrypt.compare(password, user.password_hash)

    if (!passwordValid) {
      console.log("Invalid password")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate encryption key
    console.log("Generating encryption key...")
    const encryptionKey = deriveKey(password, user.salt)

    console.log("Login successful for user:", user.username)

    // This endpoint now just validates the request
    // The actual login happens client-side
    return NextResponse.json({
      success: true,
      message: "Login endpoint ready",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Internal server error: " + (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 },
    )
  }
}
