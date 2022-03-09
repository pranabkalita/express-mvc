import express from 'express'

// Controllers
import RegisterController from './../controllers/Auth/RegisterController.js'

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

export default router
