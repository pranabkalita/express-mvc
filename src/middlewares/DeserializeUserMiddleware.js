import User from '../models/User.js'
import { decode } from './../utils/JWT.js'

export const deserializeUser = async (req, res, next) => {
  // 1) Get token and check if it exists
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next()
  }

  // 2) Verify token
  const { valid, decoded } = decode(token)

  if (!valid) {
    return next()
  }

  const freshUser = await User.findById(decoded.id)

  if (!freshUser) {
    return next()
  }

  // 4) Grant access
  req.user = freshUser
  res.locals.user = freshUser
  next()
}
