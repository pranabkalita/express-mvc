import jwt from 'jsonwebtoken'

export const sign = (object, options) => {
  return jwt.sign(object, process.env.JWT_SECRET, options)
}

export const decode = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    return { valid: true, expired: false, decoded }
  } catch (error) {
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null,
    }
  }
}

export const generateToken = (user) => {
  const token = sign(
    { id: user._id },
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
  }

  if (process.env.NODE_ENV === 'PRODUCTION') cookieOptions.secure = true

  return { token, cookieOptions }
}
