// Global Imports
import express from 'express'
import dotenv from 'dotenv'

// Config Dotenv
dotenv.config()

// Constants
const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'

// Initialize App
const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Basic Route
app.get('/', (req, res) => {
  res.send('Welcome !')
})

// Start Server
app.listen(port, host, () => {
  console.info(`Server started on port http://${host}:${port}`)
})
