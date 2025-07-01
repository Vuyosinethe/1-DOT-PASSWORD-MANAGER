// Popular sites with their domains for logo fetching
const SITE_DOMAINS: Record<string, string> = {
  // Social Media
  facebook: "facebook.com",
  instagram: "instagram.com",
  twitter: "twitter.com",
  tiktok: "tiktok.com",
  linkedin: "linkedin.com",
  snapchat: "snapchat.com",
  youtube: "youtube.com",
  pinterest: "pinterest.com",
  reddit: "reddit.com",
  discord: "discord.com",
  telegram: "telegram.org",
  whatsapp: "whatsapp.com",

  // Email & Communication
  gmail: "gmail.com",
  outlook: "outlook.com",
  yahoo: "yahoo.com",
  protonmail: "protonmail.com",
  slack: "slack.com",
  zoom: "zoom.us",
  teams: "teams.microsoft.com",
  skype: "skype.com",

  // Education
  moodle: "moodle.org",
  canvas: "canvas.instructure.com",
  blackboard: "blackboard.com",
  coursera: "coursera.org",
  udemy: "udemy.com",
  edx: "edx.org",
  khan: "khanacademy.org",

  // Work & Productivity
  github: "github.com",
  gitlab: "gitlab.com",
  bitbucket: "bitbucket.org",
  jira: "atlassian.com",
  trello: "trello.com",
  asana: "asana.com",
  notion: "notion.so",
  monday: "monday.com",
  clickup: "clickup.com",

  // Cloud & Storage
  google: "google.com",
  drive: "drive.google.com",
  dropbox: "dropbox.com",
  onedrive: "onedrive.live.com",
  icloud: "icloud.com",
  box: "box.com",

  // Streaming & Entertainment
  netflix: "netflix.com",
  spotify: "spotify.com",
  apple: "apple.com",
  amazon: "amazon.com",
  hulu: "hulu.com",
  disney: "disneyplus.com",
  twitch: "twitch.tv",

  // Banking & Finance
  paypal: "paypal.com",
  stripe: "stripe.com",
  venmo: "venmo.com",
  cashapp: "cash.app",
  robinhood: "robinhood.com",
  coinbase: "coinbase.com",

  // Shopping
  ebay: "ebay.com",
  etsy: "etsy.com",
  shopify: "shopify.com",
  walmart: "walmart.com",
  target: "target.com",

  // Microsoft Services
  microsoft: "microsoft.com",
  office: "office.com",
  xbox: "xbox.com",

  // Adobe Services
  adobe: "adobe.com",
  photoshop: "adobe.com",
  illustrator: "adobe.com",

  // Other Popular Services
  wordpress: "wordpress.com",
  medium: "medium.com",
  stackoverflow: "stackoverflow.com",
  figma: "figma.com",
  canva: "canva.com",
}

export function getSiteLogo(siteName: string): string {
  if (!siteName) return ""

  // Clean the site name (remove spaces, convert to lowercase)
  const cleanName = siteName
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "")

  // Check if we have a specific domain mapping
  const domain = SITE_DOMAINS[cleanName]
  if (domain) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  }

  // Try to extract domain from site name if it looks like a URL
  const urlPattern = /^https?:\/\/([^/]+)/i
  const match = siteName.match(urlPattern)
  if (match) {
    return `https://www.google.com/s2/favicons?domain=${match[1]}&sz=32`
  }

  // Try to guess the domain (add .com to the site name)
  if (cleanName && !cleanName.includes(".")) {
    return `https://www.google.com/s2/favicons?domain=${cleanName}.com&sz=32`
  }

  // If site name already looks like a domain
  if (siteName.includes(".")) {
    return `https://www.google.com/s2/favicons?domain=${siteName}&sz=32`
  }

  // No logo found
  return ""
}

export function getSiteDisplayName(siteName: string): string {
  // Convert common site names to proper display format
  const displayNames: Record<string, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    twitter: "Twitter",
    tiktok: "TikTok",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    gmail: "Gmail",
    github: "GitHub",
    moodle: "Moodle",
    netflix: "Netflix",
    spotify: "Spotify",
    amazon: "Amazon",
    microsoft: "Microsoft",
    apple: "Apple",
    google: "Google",
    adobe: "Adobe",
    paypal: "PayPal",
    wordpress: "WordPress",
  }

  const cleanName = siteName
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "")
  return displayNames[cleanName] || siteName
}
