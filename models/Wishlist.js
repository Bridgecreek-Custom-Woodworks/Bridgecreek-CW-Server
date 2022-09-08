const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Wishlist = sequelize.define(
  'Wishlists',
  {
    // likeId: {
    //   type: Sequelize.UUID,
    //   defaultValue: Sequelize.UUIDV4,
    //   primaryKey: true,
    //   allowNull: false,
    //   unique: true,
    // },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: false,
      references: {
        model: 'Users',
        key: 'userId',
      },
    },
    productId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: false,
      references: {
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
