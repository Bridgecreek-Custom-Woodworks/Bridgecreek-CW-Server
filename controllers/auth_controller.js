const Users = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async_middleware')
const { sendTokenResponse } = require('../utils/tokenResponse')
const jwt = require('jsonwebtoken')

// @desc Login User
// @route PUT /api/v1/auth/login
// access Private
exports.login = asyncHandler(async (req, res, next) => {
  const { password, email } = req.body
  if (!email || !password) {
    return next(
      new ErrorResponse('Please enter a valid email and password', 400)
    )
  }

  const user = await Users.scope('withPassword').findOne({
    where: { email: email },
  })

  if (!user) {
    return next(
      new ErrorResponse('Please enter a valid email and password', 400)
    )
  }

  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials'))
  }

  sendTokenResponse(user, 200, res)
})

// @desc Logout User / Clear cookie
// @route Post /api/v1/auth/logout
// access Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expiresa: new Date(Date.now() + 10 + 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    msg: `User with the id of ${req.user.userId} was logged out`,
  })
})
