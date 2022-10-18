const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Guests = require('../models/Guests');

const CartOrderAccess = sequelize.define(
  'CartOrderAccess',
  {
    cartOrderAccessId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: false,
    },
    customerId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    userName: {
      type: Sequelize.STRING,
      defaultValue: 'guest',
      allowNull: false,
      unique: false,
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
    modelName: 'CartOrderAccess',
    tableName: 'CartOrderAccess',
  }
);

// sequelize.sync({ force: true });

CartOrderAccess.hasMany(Guests, { foreignKey: 'cartOrderAccessId' });
Guests.belongsTo(CartOrderAccess, { foreignKey: 'cartOrderAccessId' });

module.exports = CartOrderAccess;
