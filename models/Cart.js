const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Products = require('../models/Product');
const CartItem = require('../models/CartItem');

const Carts = sequelize.define(
  'Carts',
  {
    cartId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: false,
      references: {
        type: Sequelize.UUID,
        model: 'Users',
        key: 'userId',
      },
      onDelete: 'cascade',
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
    sequelize,
    modelName: 'Carts',
  }
);

// sequelize.sync({ force: true });

Carts.belongsToMany(Products, {
  through: 'CartItems',
  foreignKey: 'cartId',
  otherKey: 'productId',
  onDelete: 'NO ACTION',
});

Products.belongsToMany(Carts, {
  through: 'CartItems',
  foreignKey: 'productId',
  otherKey: 'cartId',
  onDelete: 'NO ACTION',
});

module.exports = Carts;