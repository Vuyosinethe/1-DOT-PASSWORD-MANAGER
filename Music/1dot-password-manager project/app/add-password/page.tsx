"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, RefreshCw } from "lucide-react"
import { checkPasswordStrength, type PasswordStrength } from "@/lib/password-strength"
import { createPasswordEntry } from "@/lib/storage"
import { SiteLogo } from "@/components/site-logo"
import { getSiteDisplayName } from "@/lib/site-logos"
import { SiteSuggestions } from "@/components/site-suggestions"

interface User {
  id: number
  username: string
  encryptionKey: string
}

export default function AddPasswordPage() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    siteName: "",
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null)
  const [generatorOptions, setGeneratorOptions] = useState({
    length: 16,
    includeSymbols: true,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
  }, [router])

  const handlePasswordChange = (password: string) => {
    setFormData((prev) => ({ ...prev, password }))
    if (password) {
      setPasswordStrength(checkPasswordStrength(password))
    } else {
      setPasswordStrength(null)
    }
  }

  const generatePassword = async () => {
    try {
      const response = await fetch(
        `/api/password/generate?length=${generatorOptions.length}&symbols=${generatorOptions.includeSymbols}`,
      )
      const data = await response.json()

      if (response.ok) {
        handlePasswordChange(data.password)
      }
    } catch (error) {
      console.error("Error generating password:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !mounted) return

    setError("")
    setLoading(true)

    try {
      // Create password entry using client-side storage
      const result = createPasswordEntry(
        user.id,
        formData.siteName,
        formData.username,
        formData.password,
        user.encryptionKey,
      )

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "Failed to save password")
      }
    } catch (error) {
      setError("Failed to save password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🔐 1Dot Password Manager</h1>
          <Link href="/dashboard" className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="container mx-auto mt-8 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add New Password</h2>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <div className="relative">
                <input
                  id="siteName"
                  type="text"
                  required
                  value={formData.siteName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, siteName: e.target.value }))}
                  placeholder="e.g., Gmail, Facebook, GitHub"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-12"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <SiteLogo siteName={formData.siteName} size="sm" />
                </div>
              </div>
              {formData.siteName && (
                <p className="text-xs text-gray-500 mt-1">Preview: {getSiteDisplayName(formData.siteName)}</p>
              )}
              <SiteSuggestions
                currentValue={formData.siteName}
                onSelect={(siteName) => setFormData((prev) => ({ ...prev, siteName }))}
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username/Email
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="Optional"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button type="button" onClick={generatePassword} className="text-blue-400 hover:text-blue-600 p-1">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium">Strength:</span>
                    <span className="text-xs font-medium capitalize">{passwordStrength.strength}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className={`strength-meter h-1 rounded-full ${
                        passwordStrength.color === "red"
                          ? "bg-red-500"
                          : passwordStrength.color === "yellow"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${(passwordStrength.score / passwordStrength.maxScore) * 100}%` }}
                    />
                  </div>

                  {passwordStrength.feedback.length > 0 && (
                    <div className="text-xs text-gray-600 mt-2">{passwordStrength.feedback.join(", ")}</div>
                  )}
                </div>
              )}
            </div>

            {/* Password Generator Options */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Password Generator</h4>
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center">
                  <label htmlFor="length" className="text-xs text-gray-600 mr-2">
                    Length:
                  </label>
                  <input
                    type="range"
                    id="length"
                    min="8"
                    max="32"
                    value={generatorOptions.length}
                    onChange={(e) =>
                      setGeneratorOptions((prev) => ({ ...prev, length: Number.parseInt(e.target.value) }))
                    }
                    className="w-16"
                  />
                  <span className="text-xs text-gray-600 ml-2">{generatorOptions.length}</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="symbols"
                    checked={generatorOptions.includeSymbols}
                    onChange={(e) => setGeneratorOptions((prev) => ({ ...prev, includeSymbols: e.target.checked }))}
                    className="mr-1"
                  />
                  <label htmlFor="symbols" className="text-xs text-gray-600">
                    Symbols
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={generatePassword}
                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
              >
                Generate New Password
              </button>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Password"}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
