/* eslint-disable no-console */
const crypto = require('crypto')

/**
 * Mã hóa một mật khẩu và trả về encryptedData và iv
 * @param {string} password - Mật khẩu cần mã hóa
 * @param {string} secretKey - Khóa bí mật (nên giữ an toàn)
 * @returns {Object} - Đối tượng chứa encryptedData và iv
 */
function encryptPassword(password, secretKey) {
  // Tạo iv ngẫu nhiên (16 bytes)
  const iv = crypto.randomBytes(16)

  // Tạo key 256 bit từ secretKey bằng SHA-256
  const key = crypto.createHash('sha256').update(secretKey).digest().slice(0, 32)

  // Tạo cipher với thuật toán AES-256-CBC
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

  // Mã hóa mật khẩu
  let encryptedData = cipher.update(password, 'utf8', 'base64')
  encryptedData += cipher.final('base64')

  return {
    encryptedData,
    iv: iv.toString('hex')
  }
}

// Mã hóa một mật khẩu cụ thể (thay đổi giá trị này theo nhu cầu của bạn)
const password = 'MyPassword123'
const secretKey = 'ThisIsASecretKey123' // Khóa bí mật (trong thực tế là của người dùng)

const result = encryptPassword(password, secretKey)

console.log('=== KẾT QUẢ MÃ HÓA ===')
console.log('Mật khẩu gốc:', password)
console.log('encryptedData:', result.encryptedData)
console.log('iv:', result.iv)
console.log('\n=== JSON OBJECT CHO API REQUEST ===')
console.log(
  JSON.stringify(
    {
      website: 'facebook.com', // Thêm trường website
      username: 'test@example.com',
      encryptedData: result.encryptedData,
      iv: result.iv
    },
    null,
    2
  )
)
