import Joi from 'joi'

export const addPasswordSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Tên đăng nhập là bắt buộc'
  }),
  encryptedData: Joi.string().required().messages({
    'any.required': 'Dữ liệu mã hóa là bắt buộc'
  }),
  iv: Joi.string().required().messages({
    'any.required': 'Vector khởi tạo (IV) là bắt buộc'
  })
})

export const updatePasswordSchema = Joi.object({
  id: Joi.string().optional(),
  username: Joi.string().optional(),
  encryptedData: Joi.string().optional(),
  iv: Joi.string().optional()
})
