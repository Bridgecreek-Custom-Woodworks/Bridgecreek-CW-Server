const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Guests = sequelize.define(
  'Guests',
  {
    guestId: {
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
    guestName: {
      type: Sequelize.STRING,
      defaultValue: 'Guest',
      allowNull: false,
      unique: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: 'guest',
      unique: false,
      validate: {
        isIn: {
          args: [['guest']],
          msg: 'Guest can only have a role of guest',
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
          args: [['not active', 'active']],
          msg: 'Active Status can only have a status of not active, active',
        },
      },
    },
    createdBy: {
      type: Sequelize.STRING,
      defaultValue: 'guest',
      allowNull: false,
      uinque: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Guests',
  }
);

Guests.prototype.saltAndHashPassword = async function () {
  let password = uuidv4();

  password = password.split('-');
  password[0];
  const salt = await bcrypt.genSalt(10);

  return (password = await bcrypt.hash(password[0], salt));
};

Guests.prototype.getSignedToken = async function () {
  return jwt.sign({ guestId: this.guestId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = Guests;
