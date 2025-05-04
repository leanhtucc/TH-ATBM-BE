import mongoose from 'mongoose'
import createModel from '../base'

const passwordSchema = {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  website: {
    type: String,
    required: false, // Không bắt buộc
    trim: true,
    default: '' // Giá trị mặc định là chuỗi rỗng
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  encryptedData: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  }
}

const Password = createModel('Password', 'passwords', passwordSchema, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.userId // Loại bỏ userId khỏi kết quả JSON
      return ret
    },
    virtuals: true
  }
})

export default Password
