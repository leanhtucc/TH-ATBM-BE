/* eslint-disable no-console */
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
export const getPasswordById = async (id) => {
  try {
    console.log(`[Service] Tìm mật khẩu với ID chính xác: ${id}`)

    if (!ObjectId.isValid(id)) {
      throw new Error(`ID mật khẩu không hợp lệ: ${id}`)
    }

    // Tìm chính xác theo _id (phải dùng ObjectId)
    const password = await Password.findById(new ObjectId(id))

    if (!password) {
      console.log(`[Service] Không tìm thấy mật khẩu với ID: ${id}`)
      throw new Error('Không tìm thấy mật khẩu')
    }

    console.log(`[Service] Tìm thấy mật khẩu: ${id}`)

    // Chuyển đối tượng Mongoose thành plain JavaScript object
    const plainObj = password.toObject()

    // Loại bỏ các trường không mong muốn
    delete plainObj._id
    delete plainObj.userId

    // Thêm id vào kết quả
    plainObj.id = id

    return plainObj
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin mật khẩu: ${error.message}`)
  }
}

// Save a new password
export const savePassword = async (passwordData) => {
  try {
    const { userId, website, username, encryptedData, iv } = passwordData

    const newPassword = new Password({
      userId: new ObjectId(userId),
      website,
      username,
      encryptedData,
      iv
    })

    const savedPassword = await newPassword.save()

    // Sử dụng toJSON thay vì toObject để áp dụng transform trong schema
    const result = savedPassword.toJSON()

    // Loại bỏ userId khỏi kết quả trả về
    delete result.userId

    // Đảm bảo _id không xuất hiện
    delete result._id

    return result
  } catch (error) {
    throw new Error(`Lỗi khi lưu mật khẩu: ${error.message}`)
  }
}

// Update an existing password
export const updatePassword = async (id, userId, passwordData) => {
  try {
    const { website, username, encryptedData, iv } = passwordData

    const updatedPassword = await Password.findOneAndUpdate(
      {
        _id: new ObjectId(id),
        userId: new ObjectId(userId)
      },
      {
        ...(website && { website }),
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
    // Log để debug
    console.log(`[Service] Đang cố gắng xóa mật khẩu với ID: ${id} của người dùng: ${userId}`)

    // Kiểm tra xem ID có phải là ObjectId hợp lệ
    if (!ObjectId.isValid(id)) {
      throw new Error(`ID mật khẩu không hợp lệ: ${id}`)
    }

    // Tìm mật khẩu theo _id (không phải id) và userId
    const password = await Password.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    })

    if (!password) {
      console.log(`[Service] Không tìm thấy mật khẩu với ID: ${id} của người dùng: ${userId}`)
      throw new Error('Không tìm thấy mật khẩu')
    }

    // Xóa mật khẩu
    await Password.deleteOne({ _id: password._id })

    console.log(`[Service] Đã xóa thành công mật khẩu: ${id}`)
    return { success: true }
  } catch (error) {
    console.error(`[Service] Lỗi xóa mật khẩu: ${error.message}`)
    throw new Error(`Lỗi khi xóa mật khẩu: ${error.message}`)
  }
}
