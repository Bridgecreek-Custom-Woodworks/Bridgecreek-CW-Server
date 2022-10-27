const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Guests = require('../models/Guests');
const Carts = require('../models/Cart');
const Orders = require('../models/Order');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

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

CartOrderAccess.hasMany(Orders, { foreignKey: 'cartOrderAccessId' });
Orders.belongsTo(CartOrderAccess, { foreignKey: 'cartOrderAccessId' });

CartOrderAccess.hasMany(Carts, { foreignKey: 'cartOrderAccessId' });
Carts.belongsTo(CartOrderAccess, { foreignKey: 'cartOrderAccessId' });

CartOrderAccess.prototype.saltAndHashPassword = async function () {
  let password = uuidv4();
  password = password.split('-');
  password[0];
  const salt = await bcrypt.genSalt(10);

  return (password = await bcrypt.hash(password[0], salt));
};

module.exports = CartOrderAccess;
