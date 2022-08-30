const Users = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

// @desc Get all users
// @route GET /api/v1/auth/users
// access Private/Admin
exports.getAllUsers = async (req, res, next) => {
  const users = await Users.findAll()
  res.status(200).json({ success: true, data: users })
}

// @desc Get single user
// @route GET /api/v1/auth/users/:userId
// access Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: { userId: req.params.userId },
    })

    if (!user) {
      return next(
        new ErrorResponse(
          `User not found with the id of ${req.params.userId}`,
          404
        )
      )
    }

    res.status(200).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}
// @desc Create user
// @route GET /api/v1/auth/users
// access Public
exports.createUser = async (req, res, next) => {
  try {
    const user = await Users.create(req.body)

    res.status(201).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

// @desc Update user
// @route PUT /api/v1/auth/users/:userId
// access Private
exports.updateUser = async (req, res, next) => {
  try {
    const user = await Users.update(req.body, {
      where: {
        userId: req.params.userId,
      },
    })
    if (!user) {
      return next(
        new ErrorResponse(
          `User not found with the id of ${req.params.userId}`,
          404
        )
      )
    }
    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc Update user
// @route DELETE /api/v1/auth/users/:userId
// access Private
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await Users.destroy({
      where: {
        userId: req.params.userId,
      },
    })

    if (!user) {
      return next(
        new ErrorResponse(
          `User not found with the id of ${req.params.userId}`,
          404
        )
      )
    }
    res.status(200).json({
      success: true,
      msg: `User with the id ${req.params.userId} was deleted`,
    })
  } catch (error) {
    next(error)
  }
}
