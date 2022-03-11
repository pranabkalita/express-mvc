import express from 'express'

// Controllers
import MeController from '../controllers/Auth/MeController.js'
import LoginController from '../controllers/Auth/LoginController.js'
import LogoutController from '../controllers/Auth/LogoutController.js'
import RegisterController from './../controllers/Auth/RegisterController.js'
import ForgetPasswordController from '../controllers/Auth/ForgetPasswordController.js'
import ResetPasswordController from './../controllers/Auth/ResetPasswordController.js'
import UpdatePasswordController from './../controllers/Auth/UpdatePasswordController.js'
import EmailVerificationController from './../controllers/Auth/EmailVerificationController.js'

// Middleware
import AuthMiddleware from '../middlewares/AuthMiddleware.js'

// Validators
import {
  forgetPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  updatePasswordValidator,
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

/** Protected Routes */
router.use(AuthMiddleware)

router.put('/email/verify/:token', EmailVerificationController.update)
router.post(
  '/email/verification-notification',
  EmailVerificationController.store
)
router.put(
  '/update-password',
  updatePasswordValidator,
  UpdatePasswordController.update
)
router.get('/me', MeController.show)
router.post('/logout', LogoutController.store)

export default router
