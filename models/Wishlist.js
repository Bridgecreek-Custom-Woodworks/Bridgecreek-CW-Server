const Sequelize = require('sequelize')
const sequelize = require('../config/db')

const Wishlist = sequelize.define(
  'Wishlist',
  {
    wishlistId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    userId: {
      type: Sequelize.UUID,
      references: {
        model: 'Users',
        key: 'userId',
      },
    },
    productId: {
      references: {
        model: 'Product',
        key: 'productId',
      },
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Wishlist',
  }
)
