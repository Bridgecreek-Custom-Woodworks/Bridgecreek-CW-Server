const Users = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const jwt = require('jsonwebtoken')

exports.login = asyncHandler(async (req, res, next) => {
  const { password, email } = req.body
  if (!email || !password) {
    return next(
      new ErrorResponse('Please enter a valid email and password', 400)
    )
  }

  const user = await Users.findOne({
    where: {
      email: email,
    },
  })

  if (!user) {
    return next(
      new ErrorResponse('Please enter a valid email and password', 400)
    )
  }

  const isMatch = await user.mathcPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials'))
  }

  sendTokenResponse(user, 200, res)
})

const sendTokenResponse = async (user, statusCode, res) => {
  const token = await user.getSignedToken()

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }
  res
    .status(statusCode)
    //   .cookie('token', token, options)
    .json({ success: true, token, data: user })
}
