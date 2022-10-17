const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Guests = require('../models/Guests');
const Users = require('../models/User');

const CartOrderAccess = sequelize.define(
  'CartOrderAccess',
  {
    cartOrderAccessId: {
      type: Sequelize.UUID,
      defaultValues: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    updateAt: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'CartOrderAccess',
    tableName: 'CartOrderAccess',
  }
);

sequelize.sync({ force: true });

CartOrderAccess.hasMany(Guests, { foreignKey: 'cartOrderAccessId' });
Guests.belongsTo(CartOrderAccess, { foreignKey: 'cartOrderAccessId' });

module.exports = CartOrderAccess;
