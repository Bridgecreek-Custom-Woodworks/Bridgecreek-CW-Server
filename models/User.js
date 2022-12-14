const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Wishlist = require('../models/Wishlist');
const Products = require('../models/Product');
const Reviews = require('../models/Reviews');
const Carts = require('../models/Cart');
const CartItems = require('../models/CartItem');
const CartOrderAccess = require('../models/CartOrderAccess');
const ShippingAddress = require('../models/ShippingAddress');
const crypto = require('crypto');

const User = sequelize.define(
  'Users',
  {
    userId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    cartOrderAccessId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: false,
      references: {
        type: Sequelize.UUID,
        model: 'CartOrderAccess',
        key: 'cartOrderAccessId',
      },
    },
    firstName: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'The first name must be between 2 and 50 characters.',
        },
      },
    },
    lastName: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'The last name must be between 2 and 50 characters.',
        },
      },
    },
    street: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    zipCode: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
      validate: {
        len: {
          args: [5],
          msg: 'Zip Code must be 5 digits long.',
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'Please provide a valid email address',
        },
      },
    },
    homePhone: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
      validate: {
        len: {
          args: [10],
          msg: 'Home phone number must be 10 digits.',
        },
      },
    },
    cellPhone: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
      validate: {
        len: {
          args: [10],
          msg: 'Cell phone number must be 10 digits.',
        },
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    resetPasswordExpire: {
      type: Sequelize.DATE,
      unique: false,
      allowNull: true,
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: 'user',
      unique: false,
      validate: {
        isIn: {
          args: [['user']],
          msg: 'User can only have a role of user',
        },
      },
    },
    activeStatus: {
      type: Sequelize.STRING,
      defaultValue: 'not active',
      allowNull: false,
      unique: false,
      validate: {
        isIn: {
          args: [['not active', 'pending', 'active']],
          msg: 'Active Status can only have a status of not active, pending, active',
        },
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
  {
    // RETURN PASSWORD EXAMPLE: const user = await User.scope('withPassword').findOne({
    //   where: { id: req.params.id }, });
    //
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: {},
      },
    },
  },
  {
    sequelize,
    modelName: 'Users',
  }
);

// sequelize.sync({ force: true });

User.belongsToMany(Products, {
  through: 'Wishlists',
  foreignKey: 'userId',
  otherKey: 'productId',
});
Products.belongsToMany(User, {
  through: 'Wishlists',
  foreignKey: 'productId',
  otherKey: 'userId',
});

User.hasMany(Reviews, { foreignKey: 'userId' });
Reviews.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Wishlist, { foreignKey: 'userId' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });

Products.hasMany(Wishlist, { foreignKey: 'productId' });
Wishlist.belongsTo(Products, { foreignKey: 'productId' });

Products.hasMany(CartItems, { foreignKey: 'productId' });
CartItems.belongsTo(Products, { foreignKey: 'productId' });

Carts.hasMany(CartItems, { foreignKey: 'cartId' });
CartItems.belongsTo(Carts, { foreignKey: 'cartId' });

CartOrderAccess.hasMany(User, { foreignKey: 'cartOrderAccessId' });
User.belongsTo(CartOrderAccess, { foreignKey: 'cartOrderAccessId' });

User.hasMany(ShippingAddress, { foreignKey: 'userId', onDelete: 'CASCADE' });
ShippingAddress.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

const saltAndHashPassword = async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.dataValues.password, salt);
  }
};

User.prototype.removeUsersReviews = async function (userId) {
  await Reviews.destroy({
    where: {
      userId: userId,
    },
    individualHooks: true,
  });
};

User.prototype.getSignedToken = async function () {
  return jwt.sign({ userId: this.userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

User.prototype.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate and hash password token for reset password
User.prototype.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
// Generate and hash password token for email verification
User.prototype.getEmailPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire to 24 hours from now
  const date = new Date();
  const addOneDay = date.setDate(date.getDate() + 1);
  const nextDay = new Date(addOneDay);
  this.resetPasswordExpire = nextDay;

  return resetToken;
};

User.prototype.emailVerification = async function (req) {
  let resetToken = await this.getEmailPasswordToken();

  let email;

  if (process.env.NODE_ENV === 'test' || 'development') {
    email = `testperson394@gmail.com`;
  } else {
    email = this.email;
  }

  // Set activate password token in env for testing register route.
  process.env.ACTIVATION_TOKEN = resetToken;

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/accountactivation/${resetToken}`;

  const msg = `You are receiving this email because you or someone else has created an account with Totally Board. This link will expire in 24 hours. Please click this link to verify your email address and activate your account: ${resetUrl}`;

  const from = `<${process.env.FROM_EMAIL}>`;

  const subject = 'Verify Email';

  let options = {
    email: email,
    subject: subject,
    from: from,
    msg: msg,
  };

  return options;
};

User.prototype.createCartOrderAccess = async function (req) {
  let customer = {
    userName: `${this.firstName} ${this.lastName}`,
    customerId: this.userId,
  };

  const cartOrderAccess = await CartOrderAccess.create(customer);

  this.cartOrderAccessId = cartOrderAccess.cartOrderAccessId;
};

User.beforeCreate(saltAndHashPassword);
User.beforeUpdate(saltAndHashPassword);

module.exports = User;
