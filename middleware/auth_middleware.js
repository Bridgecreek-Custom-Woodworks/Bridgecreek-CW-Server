const Admins = require('../models/Admin');
const Users = require('../models/User');
const Guests = require('../models/Guests');
const Cart = require('../models/Cart');
const Orders = require('../models/Order');
const CartOrderAccess = require('../models/CartOrderAccess');
const jwt = require('jsonwebtoken');
const asyncHandler = require('./async_middleware');
const ErrorResponse = require('../utils/errorResponse');

// Authentication for protected routes

exports.protect = (Model) =>
  asyncHandler(async (req, res, next) => {
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
      return next(
        new ErrorResponse('Not authorized to access this route', 401)
      );
    }
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let id = decoded.userId ? decoded.userId : decoded.guestId;

      // Adding user to the req object for all protected routes
      if (Model === Users) {
        req.user = await Users.findOne({
          where: { userId: decoded.userId },
        });

        req.user.role = req.user.role;
      } else if (Model === CartOrderAccess) {
        req.user = await CartOrderAccess.findOne({
          where: { customerId: id },

          include: [
            { model: Guests },
            { model: Users },
            { model: Orders },
            { model: Cart },
          ],
        });

        req.user.role =
          req.user.dataValues.Guests.length === 1
            ? req.user.dataValues.Guests[0].dataValues.role
            : req.user.dataValues.Users[0].dataValues.role;
      } else if (Model === Admins) {
        req.user = await Admins.findOne({
          where: { adminId: decoded.adminId },
        });
      }

      next();
    } catch (error) {
      // console.log(error);
      return next(
        new ErrorResponse('Not authorized to access this route', 401)
      );
    }
  });

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
