const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Reviews = require('./Reviews');
const ProductCare = require('../models/ProductCare');
const Product = sequelize.define(
  'Products',
  {
    productId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    stripeProductId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.DECIMAL,
      defaultValue: 0.0,
      allowNull: false,
      unique: false,
    },

    discount: {
      type: DataTypes.DECIMAL,
      defaultValue: 0.1,
      allowNull: true,
      unique: false,
      validate: {
        max: {
          args: [0.1],
          msg: 'Discount can be more than ten percent',
        },
      },
    },
    weight: {
      type: DataTypes.DECIMAL,
      defaultValue: 0.0,
      allowNull: false,
      unique: false,
    },
    dementions: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    url: {
      type: DataTypes.STRING,
      defaultValue: 'foo@bar.com',
      allowNull: true,
      unique: false,
      validate: {
        isUrl: true,
      },
    },
    avgRating: {
      type: DataTypes.DECIMAL,
      defaultValue: 0.0,
      allowNull: true,
      unique: false,
    },
    displayStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Products',
  }
);

// console.log(typeof Product);

Product.hasMany(Reviews, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
  hooks: true,
});
Reviews.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });

Product.hasOne(ProductCare, { foreignKey: 'productId', onDelete: 'CASCADE' });
ProductCare.belongsTo(Product, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
});

module.exports = Product;
