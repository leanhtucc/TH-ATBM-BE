/* eslint-disable no-console */
const crypto = require('crypto')

/**
 * Tạo IV ngẫu nhiên và trả về dưới dạng chuỗi hex
 */
function generateIV() {
  const iv = crypto.randomBytes(16)
  return iv.toString('hex')
}

/**
 * Mã hóa một mật khẩu với một khóa bí mật và IV
 * @param {string} password - Mật khẩu cần mã hóa
 * @param {string} secretKey - Khóa bí mật
 * @param {Buffer|string} [iv] - IV tùy chọn, nếu không cung cấp sẽ tạo mới
 * @returns {Object} Đối tượng chứa dữ liệu đã mã hóa và IV
 */
function encryptPassword(password, secretKey, providedIv) {
  // Tạo IV hoặc sử dụng IV được cung cấp
  const iv = providedIv
    ? typeof providedIv === 'string'
      ? Buffer.from(providedIv, 'hex')
      : providedIv
    : crypto.randomBytes(16)

  // Tạo key 256 bit từ secretKey bằng SHA-256
  const key = crypto.createHash('sha256').update(secretKey).digest().slice(0, 32)

  // Tạo cipher
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

  // Mã hóa mật khẩu
  let encrypted = cipher.update(password, 'utf8', 'base64')
  encrypted += cipher.final('base64')

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex')
  }
}

/**
 * Giải mã dữ liệu đã mã hóa
 * @param {string} encryptedData - Dữ liệu đã mã hóa dạng base64
 * @param {string} secretKey - Khóa bí mật
 * @param {string} iv - IV dạng hex
 * @returns {string} Mật khẩu gốc
 */
function decryptPassword(encryptedData, secretKey, iv) {
  const key = crypto.createHash('sha256').update(secretKey).digest().slice(0, 32)
  const ivBuffer = Buffer.from(iv, 'hex')

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivBuffer)

  let decrypted = decipher.update(encryptedData, 'base64', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

// Tạo dữ liệu mẫu cho API
function generateTestData(username, password) {
  const secretKey = 'YourSecretKeyForTesting' // Khóa bí mật (trong thực tế nên do người dùng cung cấp)
  const { encryptedData, iv } = encryptPassword(password, secretKey)

  return {
    username,
    encryptedData,
    iv
  }
}

// Tạo IV mới
console.log('Tạo IV ngẫu nhiên:')
console.log(generateIV())
console.log('-------------------')

// Tạo dữ liệu test mẫu
console.log('Dữ liệu test mẫu cho API:')
console.log(JSON.stringify(generateTestData('user@example.com', 'Password123'), null, 2))
console.log('-------------------')

// Chứng minh quá trình mã hóa và giải mã
const password = 'MySecretPassword123'
const secretKey = 'ThisIsMySecretKey'
const { encryptedData, iv } = encryptPassword(password, secretKey)

console.log(`Mật khẩu gốc: ${password}`)
console.log(`Dữ liệu đã mã hóa: ${encryptedData}`)
console.log(`IV: ${iv}`)

// Giải mã để chứng minh
const decrypted = decryptPassword(encryptedData, secretKey, iv)
console.log(`Mật khẩu giải mã: ${decrypted}`)
console.log(`Khớp với mật khẩu gốc: ${decrypted === password ? 'Đúng' : 'Sai'}`)

// Module exports để sử dụng trong các file khác nếu cần
module.exports = {
  generateIV,
  encryptPassword,
  decryptPassword,
  generateTestData
}
