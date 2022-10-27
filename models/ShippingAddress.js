const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const ShippingAddress = sequelize.define(
  'ShippingAddress',
  {
    shippingAddressId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'Users',
        key: 'userId',
      },
    },
    street: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    zipCode: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
      validate: {
        len: {
          args: [5],
          msg: 'Zip Code must be 5 digits long.',
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'ShippingAddress',
    tableName: 'ShippingAddress',
  }
);

module.exports = ShippingAddress;
