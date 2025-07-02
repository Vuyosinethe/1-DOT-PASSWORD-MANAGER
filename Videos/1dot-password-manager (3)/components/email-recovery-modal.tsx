"use client"

import type React from "react"

import { useState } from "react"
import { X, Mail, Clock, Key, AlertCircle, CheckCircle } from "lucide-react"
import { generateRecoveryToken, validateRecoveryToken, getPasswordEntryByEmail, getPasswordEntry } from "@/lib/storage"
import { SiteLogo } from "./site-logo"
import { getSiteDisplayName } from "@/lib/site-logos"

interface EmailRecoveryModalProps {
  isOpen: boolean
  onClose: () => void
  entry: {
    id: number
    siteName: string
    username: string
    email?: string
    createdAt: string
  } | null
  user: {
    id: number
    username: string
    encryptionKey: string
  }
}

export function EmailRecoveryModal({ isOpen, onClose, entry, user }: EmailRecoveryModalProps) {
  const [step, setStep] = useState<"email" | "token" | "success">("email")
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [recoveredPassword, setRecoveredPassword] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  // Reset state when modal opens/closes
  const handleClose = () => {
    setStep("email")
    setEmail("")
    setToken("")
    setError("")
    setLoading(false)
    setRecoveredPassword("")
    setEmailSent(false)
    onClose()
  }

  const handleSendRecoveryEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!entry) return

    setError("")
    setLoading(true)

    try {
      // Check if the email matches the one saved with the password
      const entryResult = getPasswordEntryByEmail(entry.id, email)

      if (!entryResult.success) {
        setError("This email address is not associated with this password entry")
        return
      }

      // Generate recovery token
      const tokenResult = generateRecoveryToken(user.id, entry.id, email)

      if (!tokenResult.success) {
        setError("Failed to generate recovery token")
        return
      }

      // Simulate sending email (in a real app, this would send an actual email)
      console.log(`Recovery email sent to ${email} with token: ${tokenResult.token}`)

      // For demo purposes, show the token in the UI
      setEmailSent(true)
      setStep("token")

      // In a real app, you wouldn't show the token like this
      setTimeout(() => {
        alert(`Demo: Your recovery token is: ${tokenResult.token}\n\nIn a real app, this would be sent to your email.`)
      }, 1000)
    } catch (error) {
      setError("Failed to send recovery email")
    } finally {
      setLoading(false)
    }
  }

  const handleValidateToken = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!entry) return

    setError("")
    setLoading(true)

    try {
      // Validate the recovery token
      const tokenResult = validateRecoveryToken(token)

      if (!tokenResult.success) {
        setError(tokenResult.error || "Invalid token")
        return
      }

      // Get the password using a temporary bypass (in real app, this would use a recovery key)
      const passwordResult = getPasswordEntry(entry.id, user.id, user.encryptionKey)

      if (!passwordResult.success) {
        setError("Failed to recover password")
        return
      }

      setRecoveredPassword(passwordResult.password || "")
      setStep("success")
    } catch (error) {
      setError("Token validation failed")
    } finally {
      setLoading(false)
    }
  }

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(recoveredPassword)
    } catch (error) {
      console.error("Failed to copy password:", error)
    }
  }

  if (!isOpen || !entry) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-3">
            <SiteLogo siteName={entry.siteName} size="md" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Password Recovery</h3>
              <p className="text-sm text-gray-500">{getSiteDisplayName(entry.siteName)}</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "email" && (
            <div>
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Email Recovery</h4>
                <p className="text-sm text-gray-600">Enter the email address you used when saving this password</p>
              </div>

              <form onSubmit={handleSendRecoveryEmail} className="space-y-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="recoveryEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="recoveryEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your email address"
                  />
                  {entry.email && (
                    <p className="text-xs text-gray-500 mt-1">Hint: Email starts with "{entry.email.charAt(0)}***"</p>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Security Notice</p>
                      <p>
                        This recovery method will send a temporary access token to your email. The token expires in 15
                        minutes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Sending..." : "Send Recovery Email"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "token" && (
            <div>
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Enter Recovery Token</h4>
                <p className="text-sm text-gray-600">Check your email for the recovery token</p>
              </div>

              {emailSent && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium">Recovery email sent!</p>
                      <p>Check your email for the recovery token.</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleValidateToken} className="space-y-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="recoveryToken" className="block text-sm font-medium text-gray-700 mb-2">
                    Recovery Token
                  </label>
                  <input
                    id="recoveryToken"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="Enter the token from your email"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Token expires in 15 minutes</p>
                      <p>If you don't receive the email, check your spam folder or try again.</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !token}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Validating..." : "Validate Token"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "success" && (
            <div>
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Key className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Password Recovered</h4>
                <p className="text-sm text-gray-600">Your password has been successfully recovered</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recovered Password</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={recoveredPassword}
                      readOnly
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono pr-12"
                    />
                    <button
                      onClick={copyPassword}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy password"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Security Recommendation</p>
                      <p>Consider updating your master password and re-encrypting your vault for enhanced security.</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={copyPassword}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Copy Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
