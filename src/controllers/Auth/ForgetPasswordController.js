import { validationResult } from 'express-validator'

import Email from '../../utils/Email.js'
import ErrorHandler from '../../utils/ErrorHandler.js'
import { ErrorResponse, SuccessResponse } from '../../utils/Response.js'
import { findUser, updateUser } from '../../services/User.js'
import CatchAsyncErrors from '../../utils/CatchAsyncErrors.js'
import { createToken } from '../../utils/EmailVerificationToken.js'

const store = CatchAsyncErrors(async (req, res, next) => {
  // 1. Check for validation errors
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return ErrorResponse(res, 400, {
      message: 'Forget password failed.',
      errors: errors.array(),
    })
  }

  // 2. Find user with provided email
  const user = await findUser({ email: req.body.email })

  if (!user) {
    return next(new ErrorHandler('User not found with this email.', 404))
  }

  // 3. Create a password reset link and send to email
  const { token, expiresAt } = createToken()

  // 4. Update user with new token
  const updatedUser = updateUser(
    { _id: user.id },
    {
      passwordReset: {
        token,
        expiresAt,
      },
    }
  )

  // 5. Send Email
  await new Email(user).sendResetPasswordLink(token)

  // 6. Send back response
  return SuccessResponse(res, 200, {
    message: 'Password reset link has been sent.',
  })
})

export default { store }
