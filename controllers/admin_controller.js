const Admins = require('../models/Admin');
const Cart = require('../models/Cart');
const Guest = require('../models/Guests');
const Products = require('../models/Product');
const Reviews = require('../models/Reviews');
const ShippingAddress = require('../models/ShippingAddress');
const Orders = require('../models/Order');
const User = require('../models/User');
const CartOrderAccess = require('../models/CartOrderAccess');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');
const { sendTokenResponse } = require('../utils/tokenResponse');

// @desc Get all admin users
// @route GET /api/v1/admin/alladmins
// access Private/Admin
exports.getAllAdminUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedQuerySearch);
});

// @desc Get single admin user
// @route GET /api/v1/admin/:adminId
// access Private/Admin
exports.getMe = asyncHandler(async (req, res, next) => {
  const admin = await Admins.findOne({
    where: { adminId: req.user.adminId },
  });

  if (!admin) {
    return next(new ErrorResponse('Admin user was not found', 404));
  }
  res.status(200).json({ success: true, data: admin });
});

// @desc Create an admin user
// @route POST /api/v1/admin
// access Private/Admin
exports.createAdminUser = asyncHandler(async (req, res, next) => {
  const admin = await Admins.build(req.body);

  if (!admin) {
    return next(new ErrorResponse('Unable to create Admin user', 400));
  }

  await admin.createCartOrderAccess(CartOrderAccess);

  await admin.save();

  res.status(201).json({ success: true, data: admin });
});

// @desc Login Admin
// @route POST /api/v1/admin/login
// access Private/Admin
exports.login = asyncHandler(async (req, res, next) => {
  const { password, email } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse('Please enter a valid email and password', 400)
    );
  }

  const admin = await Admins.scope('withPassword').findOne({
    where: { email: email },
  });

  if (!admin) {
    return next(
      new ErrorResponse('Please enter a valid email and password', 400)
    );
  }

  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  let msg = 'You are now logged in!';

  sendTokenResponse(admin, 200, res, msg);
});

// @desc Logout User / Clear cookie
// @route POST /api/v1/admin/logout
// access Private/Admin
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 + 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    msg: `User with the id of ${req.user.adminId} was logged out`,
  });
});

// @desc Update an admin user
// @route PUT /api/v1/admin/update/:adminId
// access Private/Admin
exports.updateAdminUser = asyncHandler(async (req, res, next) => {
  const admin = await Admins.update(req.body, {
    where: { adminId: req.params.adminId },
    returning: true,
  });

  if (!admin) {
    return next(
      new ErrorResponse(`No admin found with the id ${req.params.adminId}`, 404)
    );
  }
  res.status(200).json({ success: true, data: admin });
});

// @desc Update password
// @route PUT /api/v1/admin/updatepassword
// access Private/Admin
exports.updateAdminPassword = asyncHandler(async (req, res, next) => {
  const user = await Admins.scope('withPassword').findOne({
    where: { adminId: req.user.adminId },
  });

  if (req.body.newPassword !== req.body.newPassword2) {
    return next(new ErrorResponse('Passwords must match', 400));
  }

  if (!user) {
    return next(new ErrorResponse('Please log in to update password', 400));
  }

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc Delete an admin user
// @route DELETE /api/v1/admin/delete/:adminId
// access Private/Admin
exports.deleteAdminUser = asyncHandler(async (req, res, next) => {
  const admin = await Admins.destroy({
    where: { adminId: req.params.adminId },
  });

  if (!admin) {
    return next(
      new ErrorResponse(
        `Admin with the id ${req.params.adminId} has been removed`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: admin });
});

// @desc Get cart by id
// @route GET /api/v1/admin/cart/:cartId
// access Private/Admin
exports.getCartById = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({
    where: { cartId: req.params.cartId },
  });

  if (!cart) {
    return next(
      new ErrorResponse(`Cart with the id ${req.params.cartId} was not found`)
    );
  }

  res.status(200).json({ success: true, data: cart });
});

// @desc Get guest by id
// @route GET /api/v1/admin/guest/:guestId
// access Private/Admin
exports.getGuestById = asyncHandler(async (req, res, next) => {
  const guest = await Guest.findOne({
    where: { guestId: req.params.guestId },
  });

  if (!guest) {
    return next(
      new ErrorResponse(
        `Guest with the id ${req.params.guestId} was not found`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: guest });
});

// @desc Get user by id
// @route GET /api/v1/admin/user/:userId
// access Private/Admin
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    require: true,
    where: { userId: req.params.userId },
    include: [
      { model: ShippingAddress },
      { model: Products },
      { model: Reviews, include: { model: Products } },
      { model: CartOrderAccess, include: [{ model: Orders }, { model: Cart }] },
    ],
  });

  if (!user) {
    return next(
      new ErrorResponse(`User with the id ${req.params.userId}`, 404)
    );
  }

  res.status(200).json({ success: true, data: user });
});
