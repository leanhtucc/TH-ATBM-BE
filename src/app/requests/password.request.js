import Joi from 'joi'

export const addPasswordSchema = Joi.object({
  website: Joi.string().allow('').optional(), // Không bắt buộc
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
  website: Joi.string().allow('').optional(),
  username: Joi.string().optional(),
  encryptedData: Joi.string().optional(),
  iv: Joi.string().optional()
})
