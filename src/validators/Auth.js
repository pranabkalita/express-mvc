import { check } from 'express-validator'

import { findUser } from '../services/User.js'

export const registerValidator = [
  check('firstName', 'A user must have a first name.').notEmpty(),
  check('lastName', 'A user must have a last name.').notEmpty(),
  check('email', 'A user must provide a valid email address.').custom(
    async (email, { req }) => {
      if (!email) {
        throw new Error('User must provide a valid email address.')
      }

      const user = await findUser({ email })

      if (user) {
        throw new Error('This email is already taken.')
      }
    }
  ),
  check('password', 'A user must have a strong password.').isStrongPassword(),
  check('passwordConfirmation', 'Passwords must match.').custom(
    async (passwordConfirmation, { req }) => {
      const { password } = req.body

      if (password != passwordConfirmation) {
        throw new Error('Passwords must match.')
      }
    }
  ),
]

export const loginValidator = [
  check('email', 'User must provide a valid email address.').isEmail(),
  check('password', 'User must provide a password.').notEmpty(),
]

export const forgetPasswordValidator = [
  check('email', 'User must provide a valid email address.').isEmail(),
]

export const resetPasswordValidator = [
  check('email', 'A user must provide a valid email address.').isEmail(),
  check('password', 'A user must have a strong password.').isStrongPassword(),
  check('passwordConfirmation', 'Passwords must match.').custom(
    async (passwordConfirmation, { req }) => {
      const { password } = req.body

      if (password != passwordConfirmation) {
        throw new Error('Passwords must match.')
      }
    }
  ),
]

export const updatePasswordValidator = [
  check('oldPassword', 'User must provide their old password.').notEmpty(),
  check('password', 'A user must have a strong password.').isStrongPassword(),
  check('passwordConfirmation', 'Passwords must match.').custom(
    async (passwordConfirmation, { req }) => {
      const { password } = req.body

      if (password != passwordConfirmation) {
        throw new Error('Passwords must match.')
      }
    }
  ),
]
