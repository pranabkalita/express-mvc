import User from './../models/User.js'

/**
 * Creates a new user
 */
export const createUser = async (userData) => {
  try {
    const user = await User.create(userData)
    user.password = undefined

    return user
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Find a User
 */
export const findUser = async (query, populateOptions, options = {}) => {
  try {
    let userQuery = User.findOne(query, {}, options)

    if (populateOptions) {
      userQuery = userQuery.populate(populateOptions)
    }

    const user = await userQuery

    return user
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Update an User
 */
export const updateUser = async (query, update) => {
  try {
    return await User.findOneAndUpdate(query, update, {
      new: true,
      useFindAndModify: false,
    })
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Activate an user
 */
export const activateUser = async (user) => {
  try {
    const activatedUser = await updateUser(
      { _id: user },
      { verifiedAt: Date.now(), emailVerification: null }
    )

    return activatedUser
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Check if users credentials are correct
 */
export const validatePassword = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return null
    }

    user.password = undefined
    return user
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Reset user password
 */
export const resetPassword = async (userId, newPassword) => {
  try {
    const user = await findUser({ _id: userId })
    user.password = newPassword
    user.passwordReset = null
    await user.save({ validateBeforeSave: false })

    return user
  } catch (error) {
    throw new Error(error)
  }
}
