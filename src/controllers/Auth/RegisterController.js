import { validationResult } from 'express-validator'

import Email from '../../utils/Email.js'
import { createUser } from '../../services/User.js'
import CatchAsyncErrors from '../../utils/CatchAsyncErrors.js'
import { createToken } from '../../utils/EmailVerificationToken.js'
import { SuccessResponse, ErrorResponse } from '../../utils/Response.js'

const store = CatchAsyncErrors(async (req, res, next) => {
  // 1) Check for errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return ErrorResponse(res, 400, {
      message: 'User Registration failed.',
      errors: errors.array(),
    })
  }

  // 2) Register user
  const { firstName, lastName, email, password } = req.body
  const { token, expiresAt } = createToken()
  const newUserData = {
    firstName,
    lastName,
    email,
    password,
    emailVerification: { token, expiresAt },
  }

  // 3) Create user
  const user = await createUser(newUserData)

  // 4) Send email verification link
  await new Email(user).sendWelcome(token)

  // 5) Send response
  return SuccessResponse(res, 201, {
    message: 'User created successfully.',
    user,
  })
})

export default { store }
