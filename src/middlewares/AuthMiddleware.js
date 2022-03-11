import ErrorHandler from '../utils/ErrorHandler.js'

export default (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler('Not Authorized !', 401))
  }

  next()
}
