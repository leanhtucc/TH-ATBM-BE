/* eslint-disable no-console */
import mongoose from 'mongoose'

mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.id
    return ret
  }
})

const mongoDb = {
  connect: async () => {
    const uri = process.env.MONGO_DB_CLOUD

    if (!uri) {
      console.error('MongoDB connection URI is not defined.')
      process.exit(1)
    }

    try {
      // Thêm options để xử lý kết nối Atlas tốt hơn
      await mongoose.connect(uri, {
        autoCreate: true,
        autoIndex: true,
        connectTimeoutMS: 30000, // Tăng thời gian kết nối lên 30s
        socketTimeoutMS: 45000, // Tăng socket timeout lên 45s
        serverSelectionTimeoutMS: 30000, // Tăng server selection timeout
        heartbeatFrequencyMS: 10000, // Tăng tần suất heartbeat
        retryWrites: true, // Cho phép thử lại khi gặp lỗi ghi
        retryReads: true, // Cho phép thử lại khi gặp lỗi đọc
        maxPoolSize: 10, // Giới hạn số lượng kết nối đồng thời
        minPoolSize: 1, // Duy trì ít nhất 1 kết nối
        w: 'majority' // Đảm bảo ghi được xác nhận bởi đa số server
        // Removed deprecated options: useNewUrlParser and useUnifiedTopology
      })
      console.log('Connected to MongoDB Atlas successfully')
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      console.log(
        'MongoDB connection string:',
        uri.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@')
      )
      process.exit(1)
    }
  },
  close: (force) => {
    return mongoose.connection.close(force)
  },
  transaction: (...args) => {
    return mongoose.connection.transaction(...args)
  },
  isDisconnected: () => {
    return mongoose.connection.readyState === 0
  }
}

export default mongoDb
