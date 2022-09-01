const Sequelize = require('sequelize')
const sequelize = require('../config/db')
const Products = require('../models/Product')

const Wishlist = sequelize.define(
  'Wishlists',
  {
    wishlistId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId',
      },
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
  }
)

Wishlist.hasMany(Products, {
  foreignKey: {
    type: Sequelize.DataTypes.UUID,
    allowNull: false,
  },
})

Products.belongsTo(Wishlist)

Wishlist.sync({ alter: true })

module.exports = Wishlist
