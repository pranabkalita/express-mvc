import { validationResult } from 'express-validator'

import { createUser } from '../../services/User.js'

const store = async (req, res) => {
  // 1) Check for errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: 'User Registration failed.', errors: errors.array() })
  }

  // 2) Register user
  const { firstName, lastName, email, password } = req.body

  // 3) Create user
  const user = await createUser({ firstName, lastName, email, password })

  // 4) Send email verification link

  // 5) Send response
  return res.status(201).json({ message: 'User created successfully.', user })
}

export default { store }
