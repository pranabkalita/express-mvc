// Global Imports
import hpp from 'hpp'
import cors from 'cors'
import helmet from 'helmet'
import xss from 'xss-clean'
import dotenv from 'dotenv'
import express from 'express'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'

// Config Dotenv
dotenv.config()

// Project Imports
import log from './src/utils/Logger.js'
import connectDB from './src/config/Database.js'

// Import Router
import v1Router from './src/routes/index.js'

// Constants
const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes,
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes!',
})

// Initialize App
const app = express()

// Middleware
app.use(limiter)
app.use(hpp())
app.use(xss())
app.use(cors())
app.use(helmet())
app.use(mongoSanitize())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(compression())

// Register Routes
app.use('/api/v1', v1Router)

// Start Server
const start = async () => {
  try {
    await connectDB()

    app.listen(port, host, () => {
      log.info(`Server started on port http://${host}:${port}`)
    })
  } catch (error) {}
}

await start()
