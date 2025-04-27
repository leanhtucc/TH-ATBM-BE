/* eslint-disable no-console */
import bcrypt from 'bcrypt'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import User from '../../models/client/user'
import {
  TOKEN_TYPE,
  ACCESS_TOKEN_EXPIRE_IN,
  REFRESH_TOKEN_EXPIRE_IN,
  LOGIN_EXPIRE_IN
} from '../../configs/constants'
import { generateToken, verifyToken } from '../../utils/helpers/token.helper'

// Helper function to hash passwords using bcrypt
const hashPassword = async (password) => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

// Helper function to verify passwords
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

// Register a new user
export const register = async (userData) => {
  try {
    const { email, password, enable2FA } = userData

    // Kiểm tra và chuyển đổi enable2FA thành boolean
    const enable2FABoolean =
            enable2FA === true || enable2FA === 'true' || enable2FA === 1 || enable2FA === '1'

    // Thêm log để kiểm tra dữ liệu đầu vào
    console.log('Registration userData:', {
      email,
      enable2FA_original: enable2FA,
      enable2FA_type: typeof enable2FA,
      enable2FA_converted: enable2FABoolean
    })

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error('Email đã tồn tại trong hệ thống')
    }

    // Hash the password
    const passwordHash = await hashPassword(password)

    // Create new user object
    const newUser = new User({
      email,
      passwordHash
    })

    // Handle 2FA if enabled
    let twoFAData = null
    if (enable2FABoolean) {
      console.log('Enabling 2FA for user:', email)
      try {
        const secret = speakeasy.generateSecret({
          name: `Password Manager:${email}`
        })

        console.log('Generated secret:', secret)

        // Save the secret to the user
        newUser.twoFASecret = secret.base32

        // Generate QR code for the secret
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url)
        twoFAData = {
          secret: secret.base32,
          qrCode: qrCodeUrl
        }

        console.log('2FA enabled successfully, secret length:', secret.base32.length)
      } catch (e) {
        console.error('Error setting up 2FA:', e)
        throw new Error(`Lỗi khi thiết lập 2FA: ${e.message}`)
      }
    } else {
      console.log('2FA not enabled for this registration')
    }

    console.log(
      'About to save user:',
      JSON.stringify({
        email: newUser.email,
        hasPasswordHash: !!newUser.passwordHash,
        has2FA: !!newUser.twoFASecret
      })
    )

    // Save the user
    await newUser.save()

    // Return the user and 2FA data if applicable
    return {
      user: newUser,
      twoFAData
    }
  } catch (error) {
    console.error('User registration error:', error.message)
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.errors)
    }
    throw error
  }
}

// Authenticate a user
export const authenticate = async ({ email, password, twoFACode, skipPasswordCheck = false }) => {
  try {
    // Find the user
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error('Thông tin đăng nhập không hợp lệ')
    }

    // Verify the password (skip if coming from 2FA verification)
    if (!skipPasswordCheck) {
      const isPasswordValid = await verifyPassword(password, user.passwordHash)
      if (!isPasswordValid) {
        throw new Error('Thông tin đăng nhập không hợp lệ')
      }
    }

    // Check 2FA if enabled
    if (user.twoFASecret && !skipPasswordCheck) {
      if (!twoFACode) {
        return { requireTwoFA: true }
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: 'base32',
        token: twoFACode
      })

      if (!verified) {
        throw new Error('Mã xác thực 2FA không hợp lệ')
      }
    }

    // Generate access token and refresh token
    const accessToken = generateToken(
      { user_id: user._id },
      TOKEN_TYPE.ACCESS_TOKEN,
      ACCESS_TOKEN_EXPIRE_IN
    )

    const refreshToken = generateToken(
      { user_id: user._id },
      TOKEN_TYPE.REFRESH_TOKEN,
      REFRESH_TOKEN_EXPIRE_IN
    )

    // Save refresh token to user
    user.refreshToken = refreshToken
    await user.save()

    return {
      user,
      accessToken,
      refreshToken
    }
  } catch (error) {
    console.error('Login error:', error.message)
    throw error
  }
}

export const refreshAccessToken = async (oldRefreshToken) => {
  try {
    if (!oldRefreshToken) {
      throw new Error('Refresh token là bắt buộc')
    }

    // Verify refresh token
    let userId
    try {
      const payload = verifyToken(oldRefreshToken, TOKEN_TYPE.REFRESH_TOKEN)
      userId = payload.user_id
    } catch (error) {
      throw new Error('Refresh token không hợp lệ hoặc đã hết hạn')
    }

    // Find user with this refresh token
    const user = await User.findOne({
      _id: userId,
      refreshToken: oldRefreshToken
    })

    if (!user) {
      throw new Error('Refresh token không hợp lệ')
    }

    // Generate new access token and refresh token
    const accessToken = generateToken(
      { user_id: user._id },
      TOKEN_TYPE.ACCESS_TOKEN,
      ACCESS_TOKEN_EXPIRE_IN
    )

    const refreshToken = generateToken(
      { user_id: user._id },
      TOKEN_TYPE.REFRESH_TOKEN,
      REFRESH_TOKEN_EXPIRE_IN
    )

    // Update user's refresh token
    user.refreshToken = refreshToken
    await user.save()

    return {
      user,
      accessToken,
      refreshToken
    }
  } catch (error) {
    console.error('Refresh token error:', error.message)
    throw error
  }
}

export const verify2FA = async (userId, token) => {
  const user = await User.findById(userId)
  if (!user || !user.twoFASecret) {
    throw new Error('Người dùng không tồn tại hoặc không có thiết lập 2FA')
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: 'base32',
    token: token
  })

  if (!verified) {
    throw new Error('Mã xác thực 2FA không hợp lệ')
  }

  const authToken = generateToken({ user_id: user._id }, TOKEN_TYPE.AUTHORIZATION, LOGIN_EXPIRE_IN)

  return {
    user,
    token: authToken
  }
}

export const update2FASettings = async (userId, enable2FA) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('Người dùng không tồn tại')
  }

  let twoFAData = null

  if (enable2FA && !user.twoFASecret) {
    const secret = speakeasy.generateSecret({
      name: `Password Manager:${user.email}`
    })

    user.twoFASecret = secret.base32
    await user.save()

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url)
    twoFAData = {
      secret: secret.base32,
      qrCode: qrCodeUrl
    }
  } else if (!enable2FA && user.twoFASecret) {
    user.twoFASecret = null
    await user.save()
  }

  return {
    user,
    twoFAData
  }
}
