import { validationResult } from 'express-validator'

import ErrorHandler from '../../utils/ErrorHandler.js'
import CatchAsyncErrors from '../../utils/CatchAsyncErrors.js'
import { findUser, resetPassword } from '../../services/User.js'
import { ErrorResponse, SuccessResponse } from '../../utils/Response.js'

const store = CatchAsyncErrors(async (req, res, next) => {
  // 1. Check for validation errors
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return ErrorResponse(res, 400, {
      message: 'Reset password failed !',
      errors: errors.array(),
    })
  }

  // 2) Find User
  const user = await findUser({
    email: req.body.email,
    'passwordReset.token': req.params.token,
    'passwordReset.expiresAt': { $gt: Date.now() },
  })

  if (!user) {
    return next(new ErrorHandler('Invalid or Expired Token !', 400))
  }

  // 3) Reset password
  await resetPassword(user, req.body.password)

  // 4) Send back response
  return SuccessResponse(res, 200, {
    message: 'Password has been reset. Please login with new password.',
  })
})

export default { store }
