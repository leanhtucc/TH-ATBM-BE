import Joi from 'joi'

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự',
    'any.required': 'Mật khẩu là bắt buộc'
  }),
  enable2FA: Joi.boolean().default(false),
  // Thêm trường enableFA và chuyển đổi sang enable2FA
  enableFA: Joi.boolean()
}).custom((obj) => {
  // Nếu có enableFA nhưng không có enable2FA, sử dụng giá trị từ enableFA
  if (obj.enableFA !== undefined && obj.enable2FA === false) {
    obj.enable2FA = obj.enableFA
  }
  // Xóa trường enableFA khỏi kết quả cuối cùng
  delete obj.enableFA
  return obj
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Mật khẩu là bắt buộc'
  }),
  twoFACode: Joi.string().length(6).optional().messages({
    'string.length': 'Mã xác thực phải có {#limit} ký tự'
  })
})

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'Refresh token không được bỏ trống',
    'any.required': 'Refresh token là bắt buộc'
  })
})
