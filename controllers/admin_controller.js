const Admins = require('../models/Admin');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');
const { sendTokenResponse } = require('../utils/tokenResponse');
const { verifyPassword } = require('../utils/functions');

// @desc Get all admin users
// @route GET /api/v1/admin
// access Private/Admin
exports.getAllAdminUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedQuerySearch);
});

// @desc Get single admin user
// @route GET /api/v1/admin/:userId
// access Private/Admin
exports.getAdminUser = asyncHandler(async (req, res, next) => {
  const admin = await Admins.findOne({
    where: { adminId: req.user.userId },
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
// @route PUT /api/v1/admin/update/:userId
// access Private/Admin
exports.updateAdminUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({ msg: 'You updated an admin user' });
});

// @desc Delete an admin user
// @route DELETE /api/v1/admin/delete/:userId
// access Private/Admin
exports.deleteAdminUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({ msg: 'You deleted an admin user' });
});
