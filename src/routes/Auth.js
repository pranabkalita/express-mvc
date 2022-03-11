import express from 'express'

// Controllers
import MeController from '../controllers/Auth/MeController.js'
import LoginController from '../controllers/Auth/LoginController.js'
import RegisterController from './../controllers/Auth/RegisterController.js'
import EmailVerificationController from './../controllers/Auth/EmailVerificationController.js'

// Middleware
import AuthMiddleware from '../middlewares/AuthMiddleware.js'

// Validators
import { loginValidator, registerValidator } from '../validators/Auth.js'

/**
 * Create Auth Router
 */
const router = express.Router()

/**
 * Prefix: /api/v1/auth
 */
router.post('/register', registerValidator, RegisterController.store)
router.post('/login', loginValidator, LoginController.store)
router.put(
  '/email/verify/:token',
  AuthMiddleware,
  EmailVerificationController.update
)
router.get('/me', AuthMiddleware, MeController.show)

export default router
