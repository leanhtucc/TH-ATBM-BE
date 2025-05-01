/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
import * as authService from '../services/auth.service'

// Register a new user
export const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body)
        return res.status(201).jsonify(result, 'Đăng ký thành công')
    } catch (error) {
        next(error)
    }
}

// Login user
export const login = async (req, res, next) => {
    try {
        const result = await authService.authenticate(req.body)

        if (result.requireTwoFA) {
            return res.status(200).jsonify(result, 'Yêu cầu xác thực 2 bước')
        }

        return res.status(200).jsonify(result, 'Đăng nhập thành công')
    } catch (error) {
        next(error)
    }
}

// Refresh token để lấy access token mới
export const refresh = async (req, res, next) => {
    try {
        const {refreshToken} = req.body
        const result = await authService.refreshAccessToken(refreshToken)

        return res.status(200).jsonify(result, 'Refresh token thành công')
    } catch (error) {
        next(error)
    }
}

// Verify 2FA code
export const verify2FA = async (req, res, next) => {
    try {
        const {userId, twoFACode} = req.body
        const result = await authService.verify2FA(userId, twoFACode)

        // Cập nhật để trả về accessToken và refreshToken giống như login
        const tokens = await authService.authenticate({
            email: result.user.email,
            password: null, // Không cần password vì đã xác thực 2FA
            twoFACode: twoFACode,
            skipPasswordCheck: true // Flag để bỏ qua kiểm tra password
        })

        return res.status(200).jsonify(
            {
                user: result.user,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            },
            'Xác thực 2FA thành công'
        )
    } catch (error) {
        next(error)
    }
}

// Update 2FA settings
export const update2FASettings = async (req, res, next) => {
    try {
        const {enable2FA} = req.body
        const userId = req.currentUser._id
        const result = await authService.update2FASettings(userId, enable2FA)

        return res
            .status(200)
            .jsonify(result, enable2FA ? 'Đã bật xác thực 2 bước' : 'Đã tắt xác thực 2 bước')
    } catch (error) {
        next(error)
    }
}
