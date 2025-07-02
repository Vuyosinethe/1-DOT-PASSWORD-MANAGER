import bcrypt from "bcryptjs"
import { generateSalt, encryptPassword, decryptPassword } from "./crypto"

export interface User {
  id: number
  username: string
  passwordHash: string
  salt: string
  email?: string // Add email to user profile
  createdAt: string
}

export interface PasswordEntry {
  id: number
  userId: number
  siteName: string
  username: string
  email?: string // Add email field for recovery
  encryptedPassword: string
  createdAt: string
}

export interface RecoveryToken {
  id: string
  userId: number
  entryId: number
  email: string
  token: string
  expiresAt: number
  used: boolean
}

// Storage keys
const USERS_KEY = "1dot_users"
const PASSWORDS_KEY = "1dot_passwords"
const RECOVERY_TOKENS_KEY = "1dot_recovery_tokens"
const COUNTER_KEY = "1dot_counter"

// Get next ID
function getNextId(): number {
  const counter = localStorage.getItem(COUNTER_KEY)
  const nextId = counter ? Number.parseInt(counter) + 1 : 1
  localStorage.setItem(COUNTER_KEY, nextId.toString())
  return nextId
}

// User management
export function getUsers(): User[] {
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function createUser(
  username: string,
  password: string,
  email?: string,
): { success: boolean; error?: string; user?: User } {
  const users = getUsers()

  // Check if user exists
  if (users.find((u) => u.username === username)) {
    return { success: false, error: "Username already exists" }
  }

  // Create new user
  const salt = generateSalt()
  const passwordHash = bcrypt.hashSync(password, 12)

  const newUser: User = {
    id: getNextId(),
    username,
    passwordHash,
    salt,
    email,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  return { success: true, user: newUser }
}

export function authenticateUser(
  username: string,
  password: string,
): { success: boolean; error?: string; user?: User } {
  const users = getUsers()
  const user = users.find((u) => u.username === username)

  if (!user) {
    return { success: false, error: "Invalid credentials" }
  }

  if (!bcrypt.compareSync(password, user.passwordHash)) {
    return { success: false, error: "Invalid credentials" }
  }

  return { success: true, user }
}

// Password management
export function getPasswordEntries(): PasswordEntry[] {
  const entries = localStorage.getItem(PASSWORDS_KEY)
  return entries ? JSON.parse(entries) : []
}

export function savePasswordEntries(entries: PasswordEntry[]): void {
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify(entries))
}

export function getUserPasswordEntries(userId: number): PasswordEntry[] {
  const entries = getPasswordEntries()
  return entries.filter((e) => e.userId === userId)
}

export function createPasswordEntry(
  userId: number,
  siteName: string,
  username: string,
  password: string,
  encryptionKey: string,
  email?: string,
): { success: boolean; error?: string; entry?: PasswordEntry } {
  try {
    const entries = getPasswordEntries()
    const encryptedPassword = encryptPassword(password, encryptionKey)

    const newEntry: PasswordEntry = {
      id: getNextId(),
      userId,
      siteName,
      username,
      email,
      encryptedPassword,
      createdAt: new Date().toISOString(),
    }

    entries.push(newEntry)
    savePasswordEntries(entries)

    return { success: true, entry: newEntry }
  } catch (error) {
    return { success: false, error: "Failed to encrypt password" }
  }
}

export function getPasswordEntry(
  entryId: number,
  userId: number,
  encryptionKey: string,
): { success: boolean; error?: string; password?: string; entry?: PasswordEntry } {
  try {
    const entries = getPasswordEntries()
    const entry = entries.find((e) => e.id === entryId && e.userId === userId)

    if (!entry) {
      return { success: false, error: "Entry not found" }
    }

    const decryptedPassword = decryptPassword(entry.encryptedPassword, encryptionKey)

    return { success: true, password: decryptedPassword, entry }
  } catch (error) {
    return { success: false, error: "Failed to decrypt password" }
  }
}

export function getPasswordEntryByEmail(
  entryId: number,
  email: string,
): { success: boolean; entry?: PasswordEntry; error?: string } {
  try {
    const entries = getPasswordEntries()
    const entry = entries.find((e) => e.id === entryId && e.email?.toLowerCase() === email.toLowerCase())

    if (!entry) {
      return { success: false, error: "No password entry found for this email" }
    }

    return { success: true, entry }
  } catch (error) {
    return { success: false, error: "Failed to find entry" }
  }
}

// Recovery token management
export function getRecoveryTokens(): RecoveryToken[] {
  const tokens = localStorage.getItem(RECOVERY_TOKENS_KEY)
  return tokens ? JSON.parse(tokens) : []
}

export function saveRecoveryTokens(tokens: RecoveryToken[]): void {
  localStorage.setItem(RECOVERY_TOKENS_KEY, JSON.stringify(tokens))
}

export function generateRecoveryToken(
  userId: number,
  entryId: number,
  email: string,
): { success: boolean; token?: string; error?: string } {
  try {
    const tokens = getRecoveryTokens()

    // Clean up expired tokens
    const now = Date.now()
    const validTokens = tokens.filter((t) => t.expiresAt > now)

    // Generate new token
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const recoveryToken: RecoveryToken = {
      id: `recovery_${getNextId()}`,
      userId,
      entryId,
      email,
      token,
      expiresAt: now + 15 * 60 * 1000, // 15 minutes
      used: false,
    }

    validTokens.push(recoveryToken)
    saveRecoveryTokens(validTokens)

    return { success: true, token }
  } catch (error) {
    return { success: false, error: "Failed to generate recovery token" }
  }
}

export function validateRecoveryToken(token: string): {
  success: boolean
  userId?: number
  entryId?: number
  error?: string
} {
  try {
    const tokens = getRecoveryTokens()
    const recoveryToken = tokens.find((t) => t.token === token && !t.used && t.expiresAt > Date.now())

    if (!recoveryToken) {
      return { success: false, error: "Invalid or expired token" }
    }

    // Mark token as used
    recoveryToken.used = true
    saveRecoveryTokens(tokens)

    return { success: true, userId: recoveryToken.userId, entryId: recoveryToken.entryId }
  } catch (error) {
    return { success: false, error: "Token validation failed" }
  }
}
