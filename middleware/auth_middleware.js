const Users = require('../models/User');
const Cart = require('../models/Cart');
const jwt = require('jsonwebtoken');
const asyncHandler = require('./async_middleware');
const ErrorResponse = require('../utils/errorResponse');

// Authentication for protected routes

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Check to see if token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adding user to the req object for all protected routes
    req.user = await Users.findOne({
      where: { userId: decoded.userId },
      include: [{ model: Cart }],
    });

    try {
      checkAccountStatus(req.user.activeStatus);
    } catch (error) {
      return next(
        new ErrorResponse(
          'Please verify your email to activate your account',
          400
        )
      );
    }

    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Check account status
const checkAccountStatus = (accountStatus) => {
  if (accountStatus === 'not active') {
    return next(new error());
  } else if (accountStatus === 'pending') {
    return next(new error());
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
