export function generatePassword(length = 16, includeSymbols = true): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz"
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numbers = "0123456789"
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"

  let characters = lowercase + uppercase + numbers
  if (includeSymbols) {
    characters += symbols
  }

  let password = ""
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return password
}
