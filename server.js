// Global Imports
import hpp from 'hpp'
import cors from 'cors'
import helmet from 'helmet'
import xss from 'xss-clean'
import dotenv from 'dotenv'
import express from 'express'
import { fileURLToPath } from 'url'
import compression from 'compression'
import path, { dirname } from 'path'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'

// Config Dotenv
dotenv.config()

// Project Imports
import log from './src/utils/Logger.js'
import connectDB from './src/config/Database.js'
import ErrorHandler from './src/utils/ErrorHandler.js'
import ErrorMiddleware from './src/middlewares/ErrorMiddleware.js'
import { deserializeUser } from './src/middlewares/DeserializeUserMiddleware.js'

// Import Router
import v1Router from './src/routes/index.js'

// Constants
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes,
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes!',
})

// Handle Uncaught Exceptions
// process.on('uncaughtException', (err) => {
//   log.error('UNCAUGHT EXCEPTION🔥. SHUTTING DOWN.')
//   log.error(err.name, err.message)
//   process.exit(1)
// })

// Initialize App
const app = express()

// View engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'src/views'))

// Middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(limiter)
app.use(hpp())
app.use(xss())
app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use(mongoSanitize())
app.use(deserializeUser)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(compression())

// Register Routes
app.use('/api/v1', v1Router)

// Handle Unhandled Routes
app.all('*', (req, res, next) => {
  next(new ErrorHandler('PAGE NOT FOUND', 404))
})

// Register Global Error Handling Middleware
app.use(ErrorMiddleware)

// Start Server
const start = async () => {
  try {
    await connectDB()

    return app.listen(port, host, () => {
      log.info(`Server started on port http://${host}:${port}`)
    })
  } catch (error) {}
}

const server = await start()

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    log.error(`ERROR: ${err.stack}`)
  }

  if (process.env.NODE_ENV === 'PRODUCTION') {
    log.error(`ERROR: ${err.message}`)
  }

  log.warn('Shutting down the server due to the unhandled promise rejection.')

  server.close(() => {
    process.exit(1)
  })
})
