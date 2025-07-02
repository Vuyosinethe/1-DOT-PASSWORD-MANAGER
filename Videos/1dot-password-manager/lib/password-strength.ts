export interface PasswordStrength {
  score: number
  maxScore: number
  strength: string
  color: string
  feedback: string[]
}

export function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0
  const feedback: string[] = []

  // Length check
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push("Use at least 8 characters")
  }

  if (password.length >= 12) {
    score += 1
  }

  // Character variety checks
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push("Include lowercase letters")
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push("Include uppercase letters")
  }

  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push("Include numbers")
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push("Include special characters")
  }

  // Pattern checks
  if (!/(.)\1{2,}/.test(password)) {
    // No 3+ repeated chars
    score += 1
  } else {
    feedback.push("Avoid repeated characters")
  }

  // Strength levels
  let strength: string
  let color: string

  if (score <= 2) {
    strength = "weak"
    color = "red"
  } else if (score <= 4) {
    strength = "medium"
    color = "yellow"
  } else if (score <= 6) {
    strength = "strong"
    color = "green"
  } else {
    strength = "very strong"
    color = "green"
  }

  return {
    score,
    maxScore: 7,
    strength,
    color,
    feedback,
  }
}
