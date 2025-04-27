import mongoose from 'mongoose'
import createModel from '../base'

const passwordSchema = {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
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
    virtuals: true
  }
})

export default Password
