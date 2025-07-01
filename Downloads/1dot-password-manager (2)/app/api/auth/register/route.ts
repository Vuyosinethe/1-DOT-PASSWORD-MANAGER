import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDatabase } from "@/lib/database"
import { generateSalt } from "@/lib/crypto"

export async function POST(request: NextRequest) {
  try {
    console.log("Registration attempt started")

    const body = await request.json()
    const { username, password } = body

    console.log("Registration data received:", {
      username: username ? "provided" : "missing",
      password: password ? "provided" : "missing",
    })

    if (!username || !password) {
      console.log("Missing username or password")
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    console.log("Getting database connection...")
    const db = await getDatabase()
    console.log("Database connection established")

    // Check if user exists
    console.log("Checking if user exists...")
    const existingUser = await db.get("SELECT id FROM users WHERE username = ?", [username])
    if (existingUser) {
      console.log("User already exists")
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    // Hash password and generate salt
    console.log("Hashing password...")
    const passwordHash = await bcrypt.hash(password, 12)
    const salt = generateSalt()
    console.log("Password hashed, salt generated")

    // Insert user
    console.log("Inserting user into database...")
    const result = await db.run("INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)", [
      username,
      passwordHash,
      salt,
    ])

    console.log("User created successfully with ID:", result.lastID)

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      userId: result.lastID,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        error: "Internal server error: " + (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 },
    )
  }
}
