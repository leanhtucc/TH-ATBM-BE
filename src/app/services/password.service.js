import Password from '../../models/client/passwords'
import { ObjectId } from '../../models/base'

// Get all passwords for a user
export const getAllPasswords = async (userId) => {
  try {
    const passwords = await Password.find({ userId: new ObjectId(userId) })
    return passwords
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách mật khẩu: ${error.message}`)
  }
}

// Get a single password by ID
export const getPasswordById = async (id, userId) => {
  try {
    const password = await Password.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    })

    if (!password) {
      throw new Error('Không tìm thấy mật khẩu')
    }

    return password
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin mật khẩu: ${error.message}`)
  }
}

// Save a new password
export const savePassword = async (passwordData) => {
  try {
    const { userId, username, encryptedData, iv } = passwordData

    const newPassword = new Password({
      userId: new ObjectId(userId),
      username,
      encryptedData,
      iv
    })

    return await newPassword.save()
  } catch (error) {
    throw new Error(`Lỗi khi lưu mật khẩu: ${error.message}`)
  }
}

// Update an existing password
export const updatePassword = async (id, userId, passwordData) => {
  try {
    const { username, encryptedData, iv } = passwordData

    const updatedPassword = await Password.findOneAndUpdate(
      {
        _id: new ObjectId(id),
        userId: new ObjectId(userId)
      },
      {
        ...(username && { username }),
        ...(encryptedData && { encryptedData }),
        ...(iv && { iv })
      },
      { new: true }
    )

    if (!updatedPassword) {
      throw new Error('Không tìm thấy mật khẩu')
    }

    return updatedPassword
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật mật khẩu: ${error.message}`)
  }
}

// Delete a password
export const deletePassword = async (id, userId) => {
  try {
    const result = await Password.findOneAndDelete({
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    })

    if (!result) {
      throw new Error('Không tìm thấy mật khẩu')
    }

    return { success: true }
  } catch (error) {
    throw new Error(`Lỗi khi xóa mật khẩu: ${error.message}`)
  }
}
