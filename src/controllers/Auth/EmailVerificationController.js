import CatchAsyncErrors from '../../utils/CatchAsyncErrors.js'
import { activateUser, findUser } from '../../services/User.js'
import { ErrorResponse, SuccessResponse } from '../../utils/Response.js'

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

export default { update }
