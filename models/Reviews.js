const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Product = require('../models/Product');

const Reviews = sequelize.define(
  'Reviews',
  {
    reviewId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
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
    comments: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    rating: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        min: {
          args: [0],
          msg: 'Rating must be 0 or more.',
        },
        max: {
          args: [5],
          msg: 'Rating must be 5 or less',
        },
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
    indexes: [
      {
        unique: true,
        fields: ['userId', 'productId'],
      },
    ],
  },
  {
    sequelize,
    modelName: 'Reviews',
  }
);

// sequelize.sync({ alter: true });

const getAverageRating = async (review) => {
  const avg = await Reviews.findAll({
    attributes: [
      'productId',
      [sequelize.fn('avg', sequelize.col('rating')), 'avgRating'],
    ],
    where: { productId: review.dataValues.productId },
    group: 'productId',

    raw: true,
  });

  try {
    let avgRating =
      (await avg.length) === 0 ? review.dataValues.rating : avg[0].avgRating;
    await Product.update(
      { avgRating: avgRating },
      {
        where: { productId: review.dataValues.productId },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// Reviews.beforeCreate(getAverageRating);
Reviews.afterCreate(getAverageRating);
Reviews.beforeUpdate(getAverageRating);

module.exports = Reviews;
