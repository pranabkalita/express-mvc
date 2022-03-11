import { SuccessResponse } from '../../utils/Response.js'
import CatchAsyncErrors from '../../utils/CatchAsyncErrors.js'

const show = CatchAsyncErrors(async (req, res, next) => {
  return SuccessResponse(res, 200, {
    user: req.user,
  })
})

export default { show }
