import express from 'express'

import AuthRouter from './Auth.js'

const router = express.Router()

router.get('/healthcheck', (req, res) => {
  res.status(200).json({ success: true })
})

router.use('/auth', AuthRouter)

export default router
