const Users = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');
const { sendTokenResponse } = require('../utils/tokenResponse');
const { verifyPassword } = require('../utils/functions');

// @desc Get all users
// @route GET /api/v1/users/admin/allusers
// access Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await Users.findAll();

  // console.log('User Id ==> ', req.headers);
  const count = users.length;
  res.status(200).json({ success: true, count, data: users });
});

// @desc Get single user
// @route GET /api/v1/users/getme
// access Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await Users.findOne({
    where: { userId: req.user.userId },
  });

  // IF PASSWORD IS NEEDED TO BE RETURNED THEN THIS CAN BE UNCOMMENTED
  // const user = await Users.scope('withPassword').findOne({
  //   where: { userId: req.params.userId },
  // })

  if (!user) {
    return next(
      new ErrorResponse(
        `User not found with the id of ${req.params.userId}`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: user });
});

// @desc Create user
// @route POST /api/v1/users
// access Public
exports.registerUser = asyncHandler(async (req, res, next) => {
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

  count = await Users.count();
  console.log(count);

  await user.save();
  sendTokenResponse(user, 201, res, count);
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
