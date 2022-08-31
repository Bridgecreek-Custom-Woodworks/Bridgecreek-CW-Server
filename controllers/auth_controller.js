const Users = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async_middleware')
const { sendTokenResponse } = require('../utils/tokenResponse')
const jwt = require('jsonwebtoken')

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
