import sqlite3 from "sqlite3"
import { open, type Database } from "sqlite"
import path from "path"

let db: Database | null = null

export async function getDatabase(): Promise<Database> {
  if (!db) {
    try {
      // Create database in a writable directory
      const dbPath = path.join(process.cwd(), "data", "passwords.db")

      // Ensure data directory exists
      const fs = require("fs")
      const dataDir = path.dirname(dbPath)
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }

      db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      })

      // Initialize tables
      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          salt TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await db.exec(`
        CREATE TABLE IF NOT EXISTS password_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          site_name TEXT NOT NULL,
          username TEXT,
          encrypted_password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `)

      console.log("Database initialized successfully")
    } catch (error) {
      console.error("Database initialization error:", error)
      throw error
    }
  }

  return db
}
