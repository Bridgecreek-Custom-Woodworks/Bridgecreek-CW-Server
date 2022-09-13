const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Wishlist = sequelize.define(
  'Wishlists',
  {
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: false,
      references: {
        type: Sequelize.UUID,
        model: 'Users',
        key: 'userId',
      },
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
    sequelize,
    modelName: 'Wishlists',
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['productId', 'userId'],
      },
    ],
  }
);

// sequelize.sync({ alter: true });

module.exports = Wishlist;
