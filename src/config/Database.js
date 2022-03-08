import mongoose from 'mongoose'

import log from '../utils/Logger.js'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })

    log.info(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    log.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
