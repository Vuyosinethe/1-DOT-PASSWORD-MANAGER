"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Key, Eye, EyeOff } from "lucide-react"
import { checkPasswordStrength } from "@/lib/password-strength"

export default function HomePage() {
  const [demoPassword, setDemoPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const strength = demoPassword ? checkPasswordStrength(demoPassword) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🔐 1Dot Password Manager</h1>
          <div className="space-x-4">
            <Link href="/login" className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800">
              Login
            </Link>
            <Link href="/register" className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800">
              Register
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto mt-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Secure Password Management</h2>
            <p className="text-gray-600 mb-8">Keep your passwords safe with military-grade encryption</p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Encryption</h3>
                <p className="text-gray-600">Your passwords are encrypted with AES-256 encryption</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <Key className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Password Generator</h3>
                <p className="text-gray-600">Generate strong, unique passwords for all your accounts</p>
              </div>
            </div>

            <div className="space-x-4">
              <Link
                href="/register"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 inline-block"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Password Strength Checker Demo */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Try Our Password Strength Checker</h3>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={demoPassword}
                  onChange={(e) => setDemoPassword(e.target.value)}
                  placeholder="Enter a password to test..."
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {strength && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Strength:</span>
                    <span className="text-sm font-medium capitalize">{strength.strength}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`strength-meter h-2 rounded-full ${
                        strength.color === "red"
                          ? "bg-red-500"
                          : strength.color === "yellow"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${(strength.score / strength.maxScore) * 100}%` }}
                    />
                  </div>

                  {strength.feedback.length > 0 && (
                    <div className="text-sm text-gray-600 mt-2">
                      <strong>Suggestions:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {strength.feedback.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {strength.feedback.length === 0 && (
                    <div className="text-sm text-green-600 mt-2">
                      <strong>Great password!</strong>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
