const Users = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');
const asyncHandler = require('../middleware/async_middleware');
const sendEmail = require('../utils/sendEmail');
const { sendTokenResponse } = require('../utils/tokenResponse');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const { Op } = require('sequelize');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// @desc Login User
// @route PUT /api/v1/auth/login
// access Private
exports.login = asyncHandler(async (req, res, next) => {
  const { password, email } = req.body;
  if (!email || !password) {
    return next(
      new ErrorResponse('Please enter a valid email and password', 400)
    );
  }

  const user = await Users.scope('withPassword').findOne({
    where: { email: email },
  });

  if (!user) {
    return next(
      new ErrorResponse('Please enter a valid email and password', 400)
    );
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials'));
  }

  sendTokenResponse(user, 200, res);
});

// @desc Logout User / Clear cookie
// @route Post /api/v1/auth/logout
// access Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 + 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    msg: `User with the id of ${req.user.userId} was logged out`,
  });
});

// @desc Forgot password
// @route POST /api/v1/auth/forgotpassword
// access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  let { email } = req.body;
  const user = await Users.findOne({ where: { email: email } });

  if (!user) return next(new ErrorResponse('Please enter a valid email', 404));

  const resetToken = user.getResetPasswordToken();

  // This saves the resetPasswordToken to the database that is generated by the getResetPasswordToken function.
  await user.save({ validate: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const msg = `You are receiving this email because you or someone else has requested the reset of a password. Please make a request to: ${resetUrl}`;

  const from = `<${process.env.FROM_EMAIL}>`;

  const subject = 'Password Reset';

  email = `ottosjonesjr@gmail.com`; //  <=== Remember to delete this before production. Email will be passed in the req.body *********

  try {
    await sendEmail(email, from, subject, msg);

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (error) {
    console.log(error);
    (user.resetPasswordToken = null), (user.resetPasswordExpire = null);
    await user.save({ validate: false });

    return next(new ErrorResponse('Email could not be sent', 400));
  }
});

// @desc Reset password
// @route POST /api/v1/auth/resetpassword/:resettoken
// access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed password
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await Users.findOne({
    where: {
      [Op.and]: [
        { resetPasswordToken: resetPasswordToken },
        { resetPasswordExpire: { [Op.gt]: Date.now() } },
      ],
    },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new pasword
  user.password = req.body.password;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save({ validate: true });

  sendTokenResponse(user, 200, res);
});

// @desc Update password
// @route PUT /api/v1/auth/updatepassword
// access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await Users.scope('withPassword').findOne({
    where: { userId: req.user.userId },
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
