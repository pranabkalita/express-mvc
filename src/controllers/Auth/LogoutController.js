import CatchAsyncErrors from '../../utils/CatchAsyncErrors.js'
import { createInvalidToken } from '../../services/InvalidToken.js'

const store = CatchAsyncErrors(async (req, res, next) => {
  // 1) Blacklist the token
  const token = req.headers.authorization.split(' ')[1]
  await createInvalidToken(token)

  return res
    .clearCookie('jwt')
    .status(200)
    .json({
      success: true,
      data: { message: 'Successfully logged out.' },
    })
})

export default { store }
