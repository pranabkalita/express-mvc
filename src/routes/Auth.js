import express from 'express'

// Controllers
import MeController from '../controllers/Auth/MeController.js'
import LoginController from '../controllers/Auth/LoginController.js'
import LogoutController from '../controllers/Auth/LogoutController.js'
import RegisterController from './../controllers/Auth/RegisterController.js'
import ForgetPasswordController from '../controllers/Auth/ForgetPasswordController.js'
import ResetPasswordController from './../controllers/Auth/ResetPasswordController.js'
import EmailVerificationController from './../controllers/Auth/EmailVerificationController.js'

// Middleware
import AuthMiddleware from '../middlewares/AuthMiddleware.js'

// Validators
import {
  forgetPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
} from '../validators/Auth.js'

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
router.post(
  '/email/verification-notification',
  AuthMiddleware,
  EmailVerificationController.store
)
router.post(
  '/forgot-password',
  forgetPasswordValidator,
  ForgetPasswordController.store
)
router.post(
  '/reset-password/:token',
  resetPasswordValidator,
  ResetPasswordController.store
)
router.get('/me', AuthMiddleware, MeController.show)
router.post('/logout', AuthMiddleware, LogoutController.store)

export default router
