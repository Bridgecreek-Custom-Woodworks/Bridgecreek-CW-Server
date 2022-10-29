const Admins = require('../models/Admin');
const Cart = require('../models/Cart');
const Guest = require('../models/Guests');
const Products = require('../models/Product');
const Reviews = require('../models/Reviews');
const ShippingAddress = require('../models/ShippingAddress');
const Orders = require('../models/Order');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');
const { sendTokenResponse } = require('../utils/tokenResponse');
const CartOrderAccess = require('../models/CartOrderAccess');

// @desc Get all admin users
// @route GET /api/v1/admin
// access Private/Admin
exports.getAllAdminUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedQuerySearch);
});

// @desc Get single admin user
// @route GET /api/v1/admin/:adminId
// access Private/Admin
exports.getAdminUser = asyncHandler(async (req, res, next) => {
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

  const admin = await Admins.findOne({
    // attributes: { exclude: ['password'] },
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

// @desc Get all admin users
// @route GET /api/v1/admin
// access Private/Admin
exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: 'You logged out' });
});
