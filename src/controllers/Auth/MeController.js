import { SuccessResponse } from '../../utils/Response.js'
import CatchAsyncErrors from '../../utils/CatchAsyncErrors.js'
import { updateUser } from '../../services/User.js'

const show = CatchAsyncErrors(async (req, res, next) => {
  return SuccessResponse(res, 200, {
    user: req.user,
  })
})

const update = CatchAsyncErrors(async (req, res, next) => {
  // 1. Prepare update data
  const { firstName, lastName } = req.body
  const data = {
    firstName: firstName ? firstName : req.user.firstName,
    lastName: lastName ? lastName : req.user.lastName,
  }

  // 2. Prepare Avatar data
  if (req.files && req.files.avatar && req.files.avatar.length > 0) {
    const { destination, filename } = req.files.avatar[0]
    data['avatar'] = `${destination}/${filename}`
  }

  // 3. Update profile
  const updatedUser = await updateUser({ email: req.user.email }, data)

  return SuccessResponse(res, 200, {
    user: updatedUser,
  })
})

export default { show, update }
