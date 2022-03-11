import { decode } from './../utils/JWT.js'
import { findUser } from '../services/User.js'
import { findInvalidToken } from '../services/InvalidToken.js'

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

  // 2) Check if token is blacklisted
  const invalidToken = await findInvalidToken(token)

  if (invalidToken) {
    return next()
  }

  // 3) Verify token
  const { valid, decoded } = decode(token)

  if (!valid) {
    return next()
  }

  // 4) Check if user still exists
  const freshUser = await findUser({ _id: decoded.id })

  if (!freshUser) {
    return next()
  }

  // 5) Grant access
  req.user = freshUser
  res.locals.user = freshUser
  next()
}
