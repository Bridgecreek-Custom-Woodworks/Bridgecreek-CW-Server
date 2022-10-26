const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Reviews = require('./Reviews');

const Product = sequelize.define(
  'Products',
  {
    productId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },

    productName: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: Sequelize.DECIMAL,
      defaultValue: 0.0,
      allowNull: false,
      unique: false,
    },

    discount: {
      type: Sequelize.DECIMAL,
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
      type: Sequelize.DECIMAL,
      defaultValue: 0.0,
      allowNull: false,
      unique: false,
    },
    dementions: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    url: {
      type: Sequelize.STRING,
      defaultValue: 'foo@bar.com',
      allowNull: true,
      unique: false,
      validate: {
        isUrl: true,
      },
    },
    avgRating: {
      type: Sequelize.DECIMAL,
      defaultValue: 0.0,
      allowNull: true,
      unique: false,
    },
    displayStatus: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
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
    modelName: 'Products',
  }
);

Product.hasMany(Reviews, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
  hooks: true,
});

Reviews.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });

module.exports = Product;
