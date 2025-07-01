import CryptoJS from "crypto-js"

export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(32).toString()
}

export function deriveKey(password: string, salt: string): string {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 100000,
  }).toString()
}

export function encryptPassword(password: string, key: string): string {
  return CryptoJS.AES.encrypt(password, key).toString()
}

export function decryptPassword(encryptedPassword: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}
