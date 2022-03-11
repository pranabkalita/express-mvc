import { validationResult } from 'express-validator'

import { generateToken } from '../../utils/JWT.js'
import { validatePassword } from '../../services/User.js'
import CatchAsyncErrors from '../../utils/CatchAsyncErrors.js'
import { ErrorResponse, SuccessResponse } from '../../utils/Response.js'

const store = CatchAsyncErrors(async (req, res, next) => {
  // 1. Check for validation errors
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return ErrorResponse(req, 400, {
      message: 'User login failed.',
      errors: errors.array(),
    })
  }

  // 2. Check if the credentials are correct
  const user = await validatePassword(req.body)

  if (!user) {
    return ErrorResponse(res, 400, {
      message: 'Invalid credentials.',
    })
  }

  // 3. Generate JWT Token
  const { token, cookieOptions } = generateToken(user)

  // 4. Set JWT in Cookie
  res.cookie('jwt', token, cookieOptions)

  // 5. Send details back
  return SuccessResponse(res, 200, {
    user,
    token,
  })
})

export default { store }
