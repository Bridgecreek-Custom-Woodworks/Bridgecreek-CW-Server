const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const CartOrderAccess = require('../models/CartOrderAccess');

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

module.exports = Guests;
