import crypto from 'crypto'

const algorithm = 'aes-256-cbc'

/**
 * Derives an encryption key from a master password
 * @param {string} masterPassword - User's master password
 * @returns {Buffer} - 32-byte encryption key
 */
export const deriveKey = (masterPassword) => {
  // Use PBKDF2 to derive a key from the master password
  // In a production app, you'd want to store a salt per user
  const salt = 'password-manager-salt' // In production, use a secure, user-specific salt
  return crypto.pbkdf2Sync(masterPassword, salt, 10000, 32, 'sha256')
}

/**
 * Encrypts text using a key derived from the master password
 * @param {string} text - Text to encrypt
 * @param {string} masterPassword - User's master password
 * @returns {Object} - Object with iv and encryptedData
 */
export const encrypt = (text, masterPassword) => {
  const key = deriveKey(masterPassword)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted
  }
}

/**
 * Decrypts encrypted data using a key derived from the master password
 * @param {Object} encryption - Object with iv and encryptedData
 * @param {string} masterPassword - User's master password
 * @returns {string} - Decrypted text
 */
export const decrypt = (encryption, masterPassword) => {
  const key = deriveKey(masterPassword)
  const iv = Buffer.from(encryption.iv, 'hex')
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encryption.encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
