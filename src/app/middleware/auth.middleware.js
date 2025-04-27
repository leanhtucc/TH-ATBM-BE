import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import User from '../../models/client/user.js'
import { abort, getToken, verifyToken } from '../../utils/helpers/index.js'
import { TOKEN_TYPE } from '../../configs/constants.js'

// Middleware to require authentication
export const requireAuth = async (req, res, next) => {
  try {
    const token = getToken(req.headers)
    if (!token) {
      return abort(401, 'Vui lòng đăng nhập để tiếp tục')
    }

    // Cập nhật để sử dụng ACCESS_TOKEN thay vì AUTHORIZATION
    const { user_id } = verifyToken(token, TOKEN_TYPE.ACCESS_TOKEN)
    const user = await User.findOne({ _id: user_id })

    if (!user) {
      return abort(401, 'Tài khoản không tồn tại')
    }

    req.currentUser = user
    next()
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return abort(401, 'Phiên đăng nhập đã hết hạn. Vui lòng làm mới token')
    }
    if (error instanceof JsonWebTokenError) {
      return abort(401, 'Token không hợp lệ')
    }
    throw error
  }
}
