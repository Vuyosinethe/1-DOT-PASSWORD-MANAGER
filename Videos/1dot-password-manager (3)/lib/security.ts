export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function isSessionValid(sessionStart: number, maxDuration: number = 30 * 60 * 1000): boolean {
  // Session expires after 30 minutes by default
  return Date.now() - sessionStart < maxDuration
}

export function createSecureSession(userId: number, username: string, encryptionKey: string) {
  const sessionData = {
    userId,
    username,
    encryptionKey,
    sessionStart: Date.now(),
    sessionToken: generateSessionToken(),
  }

  localStorage.setItem("user", JSON.stringify(sessionData))
  return sessionData
}

export function validateSession(): { valid: boolean; user?: any } {
  try {
    const userData = localStorage.getItem("user")
    if (!userData) {
      return { valid: false }
    }

    const session = JSON.parse(userData)

    // Check if session has required fields
    if (!session.sessionStart || !session.sessionToken) {
      return { valid: false }
    }

    // Check if session is still valid (30 minutes)
    if (!isSessionValid(session.sessionStart)) {
      localStorage.removeItem("user")
      return { valid: false }
    }

    return { valid: true, user: session }
  } catch (error) {
    localStorage.removeItem("user")
    return { valid: false }
  }
}
