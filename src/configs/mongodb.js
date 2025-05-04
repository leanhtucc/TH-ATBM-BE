/* eslint-disable no-console */
import mongoose from 'mongoose'

// Cài đặt sự kiện cho kết nối MongoDB
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected, attempting to reconnect...')
})

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully')
})

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
      // Thêm options được hỗ trợ trong phiên bản MongoDB mới
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 75000,
        connectTimeoutMS: 30000,
        heartbeatFrequencyMS: 10000,
        retryWrites: true,
        retryReads: true,
        maxPoolSize: 10,
        minPoolSize: 1,
        w: 'majority',
        family: 4 // Ưu tiên IPv4
        // Loại bỏ các option không được hỗ trợ: autoReconnect, reconnectTries, reconnectInterval
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
  },
  // Thêm hàm reconnect để sử dụng khi cần kết nối lại thủ công
  reconnect: async () => {
    if (mongoose.connection.readyState === 0) {
      console.log('Attempting to reconnect to MongoDB...')
      return mongoDb.connect()
    }
    return Promise.resolve()
  }
}

export default mongoDb
