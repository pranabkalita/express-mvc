import express from 'express'

// Controllers
import RegisterController from './../controllers/Auth/RegisterController.js'
import EmailVerificationController from './../controllers/Auth/EmailVerificationController.js'

// Validators
import { registerValidator } from '../validators/Auth.js'

/**
 * Create Auth Router
 */
const router = express.Router()

/**
 * REGISTER: [POST] /api/v1/auth/register
 */
router.post('/register', registerValidator, RegisterController.store)

/**
 * EMAIL VERIFICATION: [GET0] /api/v1/auth/email/verify/:token
 */
router.put('/email/verify/:token', EmailVerificationController.update)

export default router
