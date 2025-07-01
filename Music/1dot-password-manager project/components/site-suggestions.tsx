"use client"

import { useState } from "react"
import { SiteLogo } from "./site-logo"
import { getSiteDisplayName } from "@/lib/site-logos"

interface SiteSuggestionsProps {
  onSelect: (siteName: string) => void
  currentValue: string
}

const POPULAR_SITES = [
  "Facebook",
  "Instagram",
  "Twitter",
  "TikTok",
  "LinkedIn",
  "Gmail",
  "GitHub",
  "Moodle",
  "Netflix",
  "Spotify",
  "Amazon",
  "Microsoft",
  "Apple",
  "Google",
  "YouTube",
  "Discord",
  "Slack",
  "Zoom",
  "PayPal",
  "Dropbox",
]

export function SiteSuggestions({ onSelect, currentValue }: SiteSuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Filter suggestions based on current input
  const filteredSites = POPULAR_SITES.filter((site) => site.toLowerCase().includes(currentValue.toLowerCase())).slice(
    0,
    8,
  )

  if (!showSuggestions || currentValue.length < 1) {
    return (
      <button
        type="button"
        onClick={() => setShowSuggestions(true)}
        className="text-xs text-blue-600 hover:text-blue-800 mt-1"
      >
        Show popular sites
      </button>
    )
  }

  return (
    <div className="mt-2">
      <div className="text-xs text-gray-600 mb-2">Popular sites:</div>
      <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
        {filteredSites.map((site) => (
          <button
            key={site}
            type="button"
            onClick={() => {
              onSelect(site)
              setShowSuggestions(false)
            }}
            className="flex items-center space-x-2 p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
          >
            <SiteLogo siteName={site} size="sm" />
            <span className="truncate">{getSiteDisplayName(site)}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setShowSuggestions(false)}
        className="text-xs text-gray-500 hover:text-gray-700 mt-2"
      >
        Hide suggestions
      </button>
    </div>
  )
}
