import bcrypt from "bcryptjs"
import { generateSalt, encryptPassword, decryptPassword } from "./crypto"

export interface User {
  id: number
  username: string
  passwordHash: string
  salt: string
  createdAt: string
}

export interface PasswordEntry {
  id: number
  userId: number
  siteName: string
  username: string
  encryptedPassword: string
  createdAt: string
}

// Storage keys
const USERS_KEY = "1dot_users"
const PASSWORDS_KEY = "1dot_passwords"
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

export function createUser(username: string, password: string): { success: boolean; error?: string; user?: User } {
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
): { success: boolean; error?: string; entry?: PasswordEntry } {
  try {
    const entries = getPasswordEntries()
    const encryptedPassword = encryptPassword(password, encryptionKey)

    const newEntry: PasswordEntry = {
      id: getNextId(),
      userId,
      siteName,
      username,
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
