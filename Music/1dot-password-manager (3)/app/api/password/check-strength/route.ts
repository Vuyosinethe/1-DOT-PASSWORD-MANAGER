import { type NextRequest, NextResponse } from "next/server"
import { checkPasswordStrength } from "@/lib/password-strength"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (typeof password !== "string") {
      return NextResponse.json({ error: "Password must be a string" }, { status: 400 })
    }

    const strength = checkPasswordStrength(password)
    return NextResponse.json(strength)
  } catch (error) {
    console.error("Password strength check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
