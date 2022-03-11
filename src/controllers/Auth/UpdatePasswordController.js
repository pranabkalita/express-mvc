import { validationResult } from 'express-validator'

import User from '../../models/User.js'
import { updatePassword } from '../../services/User.js'
import ErrorHandler from '../../utils/ErrorHandler.js'
import { ErrorResponse } from '../../utils/Response.js'
import CatchAsyncErrors from '../../utils/CatchAsyncErrors.js'
import { createInvalidToken } from '../../services/InvalidToken.js'

const update = CatchAsyncErrors(async (req, res, next) => {
  // 1. Check for validation errors
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return ErrorResponse(res, 400, {
      message: 'Update password failed.',
      errors: errors.array(),
    })
  }

  // 2. Check if Old Password is correct
  const user = await User.findOne({ email: req.user.email }).select('+password')
  if (!(await user.comparePassword(req.body.oldPassword))) {
    return next(new ErrorHandler('Old password does not match.', 400))
  }

  // 3. Update password
  await updatePassword(user._id, req.body.password)

  // Send response logging out user
  const token = req.headers.authorization.split(' ')[1]
  await createInvalidToken(token)

  return res
    .clearCookie('jwt')
    .status(200)
    .json({
      success: true,
      data: {
        message: 'Password changed. Please log in using the new password.',
      },
    })
})

export default { update }
