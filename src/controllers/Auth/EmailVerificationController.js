import CatchAsyncErrors from '../../utils/CatchAsyncErrors.js'
import Email from './../../utils/Email.js'
import { createToken } from './../../utils/EmailVerificationToken.js'
import { activateUser, findUser, updateUser } from '../../services/User.js'
import { ErrorResponse, SuccessResponse } from '../../utils/Response.js'

const store = CatchAsyncErrors(async (req, res, next) => {
  // 1) Create email verification token
  const { token, expiresAt } = createToken()

  // 2) Update user with new token
  const user = await updateUser(
    { _id: req.user._id },
    {
      emailVerification: {
        token,
        expiresAt,
      },
    }
  )

  await new Email(user).sendWelcome(token)

  return SuccessResponse(res, 200, {
    message: 'Verification email sent to the registered email address',
  })
})

const update = CatchAsyncErrors(async (req, res, next) => {
  // 1) Get the token from the URL and check if valid
  const user = await findUser({
    'emailVerification.token': req.params.token,
    'emailVerification.expiresAt': { $gt: Date.now() },
  })

  if (!user) {
    return ErrorResponse(res, 400, {
      message: 'Invalid or Expired Token !',
    })
  }

  // 2) Activate the account
  const activatedUser = await activateUser(user)

  // 3) Send response
  return SuccessResponse(res, 200, {
    activatedUser,
  })
})

export default { store, update }
