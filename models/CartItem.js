const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Products = require('../models/Product');
const Carts = require('./Cart');

const CartItems = sequelize.define(
  'CartItems',
  {
    cartItemId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
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

    cartId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: false,
      references: {
        type: Sequelize.UUID,
        model: 'Carts',
        key: 'cartId',
      },
    },

    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
      validate: {
        min: {
          args: [1],
          msg: 'Quantity must be at least one',
        },
        max: {
          args: [5],
          msg: 'Quantity can not be greater than 5',
        },
      },
    },

    discount: {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: false,
    },

    total: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
      allowNull: false,
      unique: false,
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
        fields: ['productId', 'cartId'],
      },
    ],
  },
  {
    sequelize,
    modelName: 'CartItems',
  }
);

const getCartAndCartItemTotals = async (cartItems, req, res) => {
  const product = await Products.findOne({
    attributes: ['price'],
    where: { productId: cartItems.dataValues.productId },
  });

  let price = Number(product.dataValues.price) * cartItems.dataValues.quantity;

  cartItems.dataValues.total = price;

  const getCartTotal = await CartItems.findAll({
    attributes: [
      'cartId',
      [sequelize.fn('sum', sequelize.col('total')), 'newTotal'],
    ],
    where: { cartId: cartItems.dataValues.cartId },
    group: 'cartId',

    returning: true,
    raw: true,
  });

  try {
    let cartTotal;

    cartTotal =
      (await getCartTotal.length) === 0 ? 0 : getCartTotal[0].newTotal;

    if (!getCartTotal[0] && req.type) {
      cartTotal = 0;
    }

    const cartTotalNumber = Number(cartTotal).toFixed(2);

    await sequelize
      .model('Carts')
      .update(
        { total: cartTotalNumber },
        { where: { cartId: cartItems.dataValues.cartId } }
      );
  } catch (error) {
    console.log(error);
  }
};

CartItems.beforeCreate(getCartAndCartItemTotals);
CartItems.afterCreate(getCartAndCartItemTotals);
CartItems.beforeUpdate(getCartAndCartItemTotals);
CartItems.afterUpdate(getCartAndCartItemTotals);
CartItems.beforeDestroy(getCartAndCartItemTotals);
CartItems.afterDestroy(getCartAndCartItemTotals);

module.exports = CartItems;
