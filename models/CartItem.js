const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const CartItems = sequelize.define(
  'CartItems',
  {
    cartItemId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },

    productId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: false,
      references: {
        type: Sequelize.UUID,
        model: 'Products',
        key: 'productId',
      },
    },

    cartId: {
      type: Sequelize.UUID,
      allowNull: true,
      unique: false,
      references: {
        type: Sequelize.UUID,
        model: 'Carts',
        key: 'cartId',
      },
    },

    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
      validate: {
        min: {
          args: [1],
          msg: 'Quantity must be at least one',
        },
        max: {
          args: [5],
          msg: 'Quantity can not be greater than 5',
        },
      },
    },

    discount: {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: false,
    },

    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['productId', 'cartId'],
      },
    ],
  },
  {
    sequelize,
    modelName: 'CartItems',
  }
);

module.exports = CartItems;