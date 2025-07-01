import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"
import { encryptPassword } from "@/lib/crypto"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const db = await getDatabase()
    const entries = await db.all(
      "SELECT id, site_name, username, created_at FROM password_entries WHERE user_id = ? ORDER BY created_at DESC",
      [userId],
    )

    return NextResponse.json({ entries })
  } catch (error) {
    console.error("Error fetching passwords:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, siteName, username, password, encryptionKey } = await request.json()

    if (!userId || !siteName || !password || !encryptionKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Encrypt the password
    const encryptedPassword = encryptPassword(password, encryptionKey)

    const db = await getDatabase()
    const result = await db.run(
      "INSERT INTO password_entries (user_id, site_name, username, encrypted_password) VALUES (?, ?, ?, ?)",
      [userId, siteName, username || null, encryptedPassword],
    )

    return NextResponse.json({
      success: true,
      entryId: result.lastID,
    })
  } catch (error) {
    console.error("Error saving password:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
