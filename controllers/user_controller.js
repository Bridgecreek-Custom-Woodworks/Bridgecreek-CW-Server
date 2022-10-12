const Users = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');
const { sendTokenResponse } = require('../utils/tokenResponse');
const { verifyPassword } = require('../utils/functions');
const sendEmail = require('../utils/sendEmail');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const { parse, stringify } = require('flatted/cjs');

// @desc Get all users
// @route GET /api/v1/users/admin/allusers
// access Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Please log in', 400));
  }
  res.status(200).json(res.advancedQuerySearch); // <== middleware/advancedQuerySearch.js
});

// @desc Get a single user
// @route GET /api/v1/users/getme
// access Private
exports.getUser = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Please log in', 400));
  }

  res.status(200).json(res.advancedQuerySearch);
});

// @desc Create user
// @route POST /api/v1/users
// access Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const existingUser = await Users.findOne({
    where: { email: req.body.email },
  });

  const user = await Users.build(req.body);
  let password = user.password;

  if (
    verifyPassword(password) === null &&
    process.env.NODE_ENV === 'production'
  ) {
    return next(
      new ErrorResponse(
        `Password must be 8 to 10 characters long with one uppercase one lower case one number and one special character`,
        400
      )
    );
  }

  const emailOptions = await user.emailVerification(req);

  const { email, from, subject, msg } = emailOptions;

  try {
    await sendEmail(email, from, subject, msg);
  } catch (error) {
    (user.resetPasswordToken = null), (user.resetPasswordExpire = null);
    await user.save({ validate: false });

    return next(new ErrorResponse('Email could not be sent', 400));
  }

  // Move this if block into the verify password route once it's completed!!
  if (existingUser && existingUser.activeStatus === 'pending') {
    // Set expire to 24 hours from now
    const date = new Date();
    const addOneDay = date.setDate(date.getDate() + 1);
    const nextDay = new Date(addOneDay);

    await Users.update(
      { resetPasswordExpire: nextDay },
      { where: { email: existingUser.email } }
    );
    return sendTokenResponse(existingUser, 201, res);
  }

  user.activeStatus = 'pending';

  await user.save();
  sendTokenResponse(user, 201, res);
});

// @desc Update user
// @route PUT /api/v1/users/updateme
// access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await Users.update(req.body, {
    where: {
      userId: req.user.userId,
    },
    returning: true,
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with the id of ${req.user.userId}`, 404)
    );
  }

  let updatedUser = user.flat(Infinity);
  user = updatedUser[1].dataValues;

  // Need to figure out a way to remove the password from the return ***********.
  // const fieldsToExclude = ['password'];
  // const myfields = Object.keys(user.rawAttributes).filter(
  //   (s) => !fieldsToExclude.includes(s)
  // );

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Delete user
// @route DELETE /api/v1/users/deleteme
// access Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      userId: req.user.userId,
    },
  });

  if (!user) {
    return next(
      new ErrorResponse(
        `User not found with the id of ${req.params.userId}`,
        404
      )
    );
  }
  await user.removeUsersReviews(req.user.userId);

  user.destroy();

  res.status(200).json({
    success: true,
    msg: `User with the id ${req.user.userId} was deleted`,
  });
});
