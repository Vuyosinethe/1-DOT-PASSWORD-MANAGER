"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { getSiteLogo } from "@/lib/site-logos"

interface SiteLogoProps {
  siteName: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function SiteLogo({ siteName, size = "md", className = "" }: SiteLogoProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const logoUrl = getSiteLogo(siteName)

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  // If no logo URL or image failed to load, show globe icon
  if (!logoUrl || imageError) {
    return <Globe className={`${iconSizeClasses[size]} text-gray-400 ${className}`} />
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      {!imageLoaded && <Globe className={`${iconSizeClasses[size]} text-gray-400 absolute inset-0`} />}
      <img
        src={logoUrl || "/placeholder.svg"}
        alt={`${siteName} logo`}
        className={`${sizeClasses[size]} rounded-sm transition-opacity duration-200 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  )
}
