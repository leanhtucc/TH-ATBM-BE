import createModel from '../base'

const UserSchema = {
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  twoFASecret: {
    type: String,
    default: null
  },
  refreshToken: {
    type: String,
    default: null
  }
}

// Correct format: createModel(name, collection, definition, options)
const User = createModel(
  'User',
  'users', // collection name
  UserSchema, // schema definition
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.passwordHash
        delete ret.refreshToken
        delete ret._id // Loại bỏ _id khỏi kết quả trả về
        return ret
      },
      virtuals: true
    }
  }
)

export default User
