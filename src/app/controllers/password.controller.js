import * as passwordService from '../services/password.service'

// Get all passwords for the current user
export const getAllPasswords = async (req, res, next) => {
  try {
    const userId = req.currentUser._id
    const passwords = await passwordService.getAllPasswords(userId)
    return res.status(200).jsonify(passwords, 'Lấy danh sách mật khẩu thành công')
  } catch (error) {
    next(error)
  }
}

// Get a single password by ID
export const getPasswordById = async (req, res, next) => {
  try {
    const userId = req.currentUser._id
    const { id } = req.params
    const password = await passwordService.getPasswordById(id, userId)
    return res.status(200).jsonify(password, 'Lấy thông tin mật khẩu thành công')
  } catch (error) {
    next(error)
  }
}

// Save a new password
export const savePassword = async (req, res, next) => {
  try {
    const userId = req.currentUser._id
    const { username, encryptedData, iv } = req.body
    const newPassword = await passwordService.savePassword({
      userId,
      username,
      encryptedData,
      iv
    })
    return res.status(201).jsonify(newPassword, 'Lưu mật khẩu thành công')
  } catch (error) {
    next(error)
  }
}

// Update an existing password
export const updatePassword = async (req, res, next) => {
  try {
    const userId = req.currentUser._id
    // Sử dụng id từ body nếu có, nếu không thì lấy từ params
    const id = req.body.id || req.params.id

    if (!id) {
      return res.status(400).jsonify(null, 'ID mật khẩu là bắt buộc')
    }

    const { username, encryptedData, iv } = req.body
    const updatedPassword = await passwordService.updatePassword(id, userId, {
      username,
      encryptedData,
      iv
    })
    return res.status(200).jsonify(updatedPassword, 'Cập nhật mật khẩu thành công')
  } catch (error) {
    next(error)
  }
}

// Delete a password
export const deletePassword = async (req, res, next) => {
  try {
    const userId = req.currentUser._id
    // Sử dụng id từ body nếu có, nếu không thì lấy từ params
    const id = req.body.id || req.params.id

    if (!id) {
      return res.status(400).jsonify(null, 'ID mật khẩu là bắt buộc')
    }

    await passwordService.deletePassword(id, userId)
    return res.status(200).jsonify(null, 'Xóa mật khẩu thành công')
  } catch (error) {
    next(error)
  }
}
