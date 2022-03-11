import InvalidToken from '../models/InvalidToken.js'

/**
 * Create a invalid token
 */
export const createInvalidToken = async (token) => {
  const invalidToken = await InvalidToken.create({
    token,
  })

  return invalidToken
}

/**
 * Finds a invalid token
 */
export const findInvalidToken = async (token) => {
  const invalidToken = await InvalidToken.findOne({
    token,
  })

  return invalidToken
}
