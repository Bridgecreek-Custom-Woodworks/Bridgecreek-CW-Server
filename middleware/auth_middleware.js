const jwt = require('jsonwebtoken')
const asyncHandler = require('./async_middleware')
const ErrorResponse = require('../utils/errorResponse')
const Users = require('../models/User')

// Authentication for protected routes

exports.protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.token) {
    token = req.cookies.token
  }

  // Check to see if token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await Users.findOne({ where: { userId: decoded.userId } })

    // console.log(req.user)

    next()
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }
})
