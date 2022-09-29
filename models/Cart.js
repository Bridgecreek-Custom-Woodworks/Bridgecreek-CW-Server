const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Products = require('../models/Product');
const CartItems = require('../models/CartItem');

const Carts = sequelize.define(
  'Carts',
  {
    cartId: {
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
      onDelete: 'NO ACTION',
    },
    total: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
      unique: false,
    },
    cartStatus: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
      defaultValue: 'New',
      validate: {
        isIn: {
          args: [['New', 'Checkout', 'Paid', 'Completed']],
          msg: 'Cart status can only have a values of New, Checkout, Paid, Completed',
        },
      },
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
    modelName: 'Carts',
  }
);

// sequelize.sync({ force: true });

Carts.belongsToMany(Products, {
  through: 'CartItems',
  foreignKey: 'cartId',
  otherKey: 'productId',
  onDelete: 'NO ACTION',
});

Products.belongsToMany(Carts, {
  through: 'CartItems',
  foreignKey: 'productId',
  otherKey: 'cartId',
  onDelete: 'NO ACTION',
});

Carts.prototype.removeCartItems = async function (cartId) {
  console.log('From cart model ==>', cartId);
  await CartItems.destroy({
    where: {
      cartId: cartId,
    },
    individualHooks: true,
  });
};

module.exports = Carts;
