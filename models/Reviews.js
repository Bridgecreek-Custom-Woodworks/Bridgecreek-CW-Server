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
        type: Sequelize.UUID,
        model: 'Users',
        key: 'userId',
      },
      onDelete: 'cascade',
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
      onDelete: 'NO ACTION',
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

const getAverageRating = async (review, req, res) => {
  const avg = await Reviews.findAll({
    attributes: [
      'productId',
      [sequelize.fn('avg', sequelize.col('rating')), 'avgRating'],
    ],
    where: { productId: review.dataValues.productId },
    group: 'productId',

    raw: true,
  });

  console.log('Avg ==> ', avg[0]);

  try {
    let avgRating;

    // If there are no reviews on a product when the user sets a review, this if statment prevents and error by set avg to the single user's review.
    avgRating =
      (await avg.length) === 0 ? review.dataValues.rating : avg[0].avgRating;

    // If there are no reviews left once a user deletes a review then this set the product review avg back to zero
    if (!avg[0] && req.type) {
      avgRating = 0;
    }

    console.log('AVG RATING ===> ', Number(avgRating).toFixed(2));

    console.log('Request ==>', req.type);

    await Product.update(
      { avgRating: Number(avgRating).toFixed(2) },
      {
        where: { productId: review.dataValues.productId },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

Reviews.afterDestroy(getAverageRating);
Reviews.afterCreate(getAverageRating);
Reviews.afterUpdate(getAverageRating);

module.exports = Reviews;
