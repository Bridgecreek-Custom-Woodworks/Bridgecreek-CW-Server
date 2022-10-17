const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Order');

const OrderItems = sequelize.define(
  'OrderItems',
  {
    orderItemId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
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
    orderId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: false,
      references: {
        type: Sequelize.UUID,
        model: 'Orders',
        key: 'orderId',
      },
    },
    price: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
      allowNull: false,
      unique: false,
    },
    discountTotal: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
      allowNull: false,
      unique: false,
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
    total: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
      allowNull: false,
      unique: false,
    },
  },
  {
    sequelize,
    modelName: 'OrderItems',
  }
);

module.exports = OrderItems;
