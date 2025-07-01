"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Copy, LogOut, Check } from "lucide-react"
import { getUserPasswordEntries, getPasswordEntry, type PasswordEntry } from "@/lib/storage"
import { SiteLogo } from "@/components/site-logo"
import { getSiteDisplayName } from "@/lib/site-logos"

interface User {
  id: number
  username: string
  encryptionKey: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [entries, setEntries] = useState<PasswordEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load password entries
    const userEntries = getUserPasswordEntries(parsedUser.id)
    setEntries(userEntries)
    setLoading(false)
  }, [router, mounted])

  const handleLogout = () => {
    if (!mounted) return
    localStorage.removeItem("user")
    router.push("/")
  }

  const copyPassword = async (entryId: number) => {
    if (!user || !mounted) return

    try {
      const result = getPasswordEntry(entryId, user.id, user.encryptionKey)

      if (result.success && result.password) {
        await navigator.clipboard.writeText(result.password)
        setCopiedId(entryId)
        setTimeout(() => setCopiedId(null), 2000)
      } else {
        console.error("Failed to decrypt password:", result.error)
      }
    } catch (error) {
      console.error("Error copying password:", error)
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your vault...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🔐 1Dot Password Manager</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.username}!</span>
            <button
              onClick={handleLogout}
              className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto mt-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Your Password Vault</h2>
            <Link
              href="/add-password"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Password
            </Link>
          </div>

          {entries.length > 0 ? (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Site
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <SiteLogo siteName={entry.siteName} size="md" className="mr-3" />
                          <span className="text-sm font-medium text-gray-900">
                            {getSiteDisplayName(entry.siteName)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.username || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => copyPassword(entry.id)}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          {copiedId === entry.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <SiteLogo siteName="" size="lg" className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No passwords saved yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first password to the vault</p>
              <Link
                href="/add-password"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Password
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
