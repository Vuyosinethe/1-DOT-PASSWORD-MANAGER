import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"
import { decryptPassword } from "@/lib/crypto"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const encryptionKey = searchParams.get("encryptionKey")

    if (!userId || !encryptionKey) {
      return NextResponse.json({ error: "User ID and encryption key required" }, { status: 400 })
    }

    const db = await getDatabase()
    const entry = await db.get(
      "SELECT site_name, username, encrypted_password FROM password_entries WHERE id = ? AND user_id = ?",
      [params.id, userId],
    )

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    // Decrypt the password
    const decryptedPassword = decryptPassword(entry.encrypted_password, decodeURIComponent(encryptionKey))

    return NextResponse.json({
      site_name: entry.site_name,
      username: entry.username,
      password: decryptedPassword,
    })
  } catch (error) {
    console.error("Error retrieving password:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
