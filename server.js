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

// Basic Route
app.get('/', (req, res) => {
  res.send('Welcome !')
})

// Start Server
app.listen(port, host, () => {
  console.info(`Server started on port http://${host}:${port}`)
})
