"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, X, Lock, Copy, Check, Mail } from "lucide-react"
import { authenticateUser, getPasswordEntry } from "@/lib/storage"
import { SiteLogo } from "./site-logo"
import { getSiteDisplayName } from "@/lib/site-logos"
import { EmailRecoveryModal } from "./email-recovery-modal"

interface PasswordViewModalProps {
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

export function PasswordViewModal({ isOpen, onClose, entry, user }: PasswordViewModalProps) {
  const [step, setStep] = useState<"auth" | "view">("auth")
  const [masterPassword, setMasterPassword] = useState("")
  const [showMasterPassword, setShowMasterPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [decryptedPassword, setDecryptedPassword] = useState("")
  const [copied, setCopied] = useState(false)
  const [showEmailRecovery, setShowEmailRecovery] = useState(false)

  // Reset state when modal opens/closes
  const handleClose = () => {
    setStep("auth")
    setMasterPassword("")
    setShowMasterPassword(false)
    setShowPassword(false)
    setError("")
    setLoading(false)
    setDecryptedPassword("")
    setCopied(false)
    setShowEmailRecovery(false)
    onClose()
  }

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!entry) return

    setError("")
    setLoading(true)

    try {
      // Verify master password
      const authResult = authenticateUser(user.username, masterPassword)

      if (!authResult.success) {
        setError("Invalid master password")
        return
      }

      // Decrypt the password
      const passwordResult = getPasswordEntry(entry.id, user.id, user.encryptionKey)

      if (!passwordResult.success || !passwordResult.password) {
        setError("Failed to decrypt password")
        return
      }

      setDecryptedPassword(passwordResult.password)
      setStep("view")
    } catch (error) {
      setError("Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(decryptedPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy password:", error)
    }
  }

  const handleEmailRecovery = () => {
    setShowEmailRecovery(true)
  }

  if (!isOpen || !entry) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center space-x-3">
              <SiteLogo siteName={entry.siteName} size="md" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{getSiteDisplayName(entry.siteName)}</h3>
                <p className="text-sm text-gray-500">{entry.username || "No username"}</p>
              </div>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === "auth" ? (
              // Authentication Step
              <div>
                <div className="text-center mb-6">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Identity</h4>
                  <p className="text-sm text-gray-600">Enter your master password to view this password</p>
                </div>

                <form onSubmit={handleAuthenticate} className="space-y-4">
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="masterPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Master Password
                    </label>
                    <div className="relative">
                      <input
                        id="masterPassword"
                        type={showMasterPassword ? "text" : "password"}
                        value={masterPassword}
                        onChange={(e) => setMasterPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        placeholder="Enter your master password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowMasterPassword(!showMasterPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showMasterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
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
                      disabled={loading || !masterPassword}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                </form>

                {/* Email Recovery Option */}
                {entry.email && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">Forgot your master password?</p>
                      <button
                        onClick={handleEmailRecovery}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Recover via Email
                      </button>
                      <p className="text-xs text-gray-500 mt-2">We'll send a recovery token to your registered email</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Password View Step
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <SiteLogo siteName={entry.siteName} size="sm" />
                      <span className="text-sm text-gray-900">{getSiteDisplayName(entry.siteName)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900">{entry.username || "No username"}</span>
                    </div>
                  </div>

                  {entry.email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">{entry.email}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={decryptedPassword}
                        readOnly
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono pr-20"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={copyPassword}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy password"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {copied && <p className="text-xs text-green-600 mt-1">Password copied to clipboard!</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900">
                        {new Date(entry.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={copyPassword}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Copied!" : "Copy Password"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Recovery Modal */}
      <EmailRecoveryModal
        isOpen={showEmailRecovery}
        onClose={() => setShowEmailRecovery(false)}
        entry={entry}
        user={user}
      />
    </>
  )
}
