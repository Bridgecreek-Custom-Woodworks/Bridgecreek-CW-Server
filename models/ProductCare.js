const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const ProductCare = sequelize.define(
  'ProductCare',
  {
    productCareId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'Products',
        key: 'productId',
      },
    },
    maintenance: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    specialInstructions: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: 'No special insturctions',
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
    modelName: 'ProductCare',
    tableName: 'ProductCare',
  }
);

module.exports = ProductCare;
