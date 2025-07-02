import { type NextRequest, NextResponse } from "next/server"
import { generatePassword } from "@/lib/password-generator"
import { checkPasswordStrength } from "@/lib/password-strength"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const length = Number.parseInt(searchParams.get("length") || "16")
    const includeSymbols = searchParams.get("symbols") !== "false"

    const password = generatePassword(length, includeSymbols)
    const strength = checkPasswordStrength(password)

    return NextResponse.json({ password, strength })
  } catch (error) {
    console.error("Password generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
