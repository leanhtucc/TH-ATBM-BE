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
    const { id } = req.params

    if (!id) {
      return res.status(400).jsonify(null, 'ID mật khẩu là bắt buộc')
    }

    console.log(`Đang lấy mật khẩu với ID: ${id}`)

    // Không truyền userId vào hàm getPasswordById nữa
    const password = await passwordService.getPasswordById(id)

    // Đảm bảo _id không xuất hiện trong kết quả
    if (password && password._id) {
      delete password._id
    }

    return res.status(200).jsonify(password, 'Lấy thông tin mật khẩu thành công')
  } catch (error) {
    if (
      error.message === 'Không tìm thấy mật khẩu' ||
            error.message.includes('ID mật khẩu không hợp lệ')
    ) {
      return res.status(404).jsonify(null, error.message)
    }
    next(error)
  }
}

// Save a new password
export const savePassword = async (req, res, next) => {
  try {
    const userId = req.currentUser._id
    const { website, username, encryptedData, iv } = req.body

    // Gọi service để lưu mật khẩu, kết quả trả về đã loại bỏ userId
    const newPassword = await passwordService.savePassword({
      userId,
      website,
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

    const { website, username, encryptedData, iv } = req.body
    const updatedPassword = await passwordService.updatePassword(id, userId, {
      website,
      username,
      encryptedData,
      iv
    })

    // Đảm bảo _id không xuất hiện trong kết quả
    if (updatedPassword && updatedPassword._id) {
      delete updatedPassword._id
    }

    return res.status(200).jsonify(updatedPassword, 'Cập nhật mật khẩu thành công')
  } catch (error) {
    next(error)
  }
}

// Delete a password
export const deletePassword = async (req, res, next) => {
  try {
    const userId = req.currentUser._id

    // Sử dụng id từ params URL hoặc từ body request
    const passwordId = req.params.id || req.body.id

    // Kiểm tra xem userId và passwordId có giống nhau không để cảnh báo
    if (passwordId && passwordId.toString() === userId.toString()) {
      return res
        .status(400)
        .jsonify(null, 'ID không hợp lệ: Bạn đã gửi ID người dùng thay vì ID mật khẩu')
    }

    if (!passwordId) {
      return res.status(400).jsonify(null, 'ID mật khẩu là bắt buộc')
    }

    // Tìm kiếm mật khẩu trong danh sách mật khẩu của người dùng
    const passwords = await passwordService.getAllPasswords(userId)

    const validPasswordIds = passwords.map((p) => p.id)

    if (!validPasswordIds.includes(passwordId)) {
      return res
        .status(400)
        .jsonify(
          null,
          `ID mật khẩu không tìm thấy trong danh sách mật khẩu của bạn. Vui lòng kiểm tra lại ID.`
        )
    }

    await passwordService.deletePassword(passwordId, userId)
    return res.status(200).jsonify(null, 'Xóa mật khẩu thành công')
  } catch (error) {
    next(error)
  }
}
