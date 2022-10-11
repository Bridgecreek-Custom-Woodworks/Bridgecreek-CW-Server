const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define(
  'Orders',
  {
    orderId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      references: {
        type: Sequelize.UUID,
        model: 'Users',
        key: 'userId',
      },
    },
    orderStatus: {
      type: Sequelize.STRING,
      defaultValue: 'new order',
      allowNull: false,
      unique: false,
      validate: {
        isIn: {
          args: [['new order', 'pending', 'paid', 'shipped']],
          msg: 'Order can only have a status of new order, pending, paid, or shipped',
        },
      },
      // The orderStatus will be set and updated during the flow ('new order', 'pending', 'paid') and shipped will be set manually by admin
    },
    subTotal: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
      allowNull: false,
      unique: false,

      // The subTotal will come from the cart
    },
    tax: {
      type: Sequelize.DECIMAL,
      defaultValue: 0.06,
      allowNull: false,
      unique: false,
      validate: {
        min: {
          args: [0],
          msg: 'Tax must be .0 or more',
        },
        max: {
          args: [1],
          msg: 'Tax must be 1 or less',
        },
      },
      //
    },
    shipping: {
      type: Sequelize.DECIMAL,
      defaultValue: 10,
      allowNull: false,
      unique: false,

      // Customer to provide shipping cost
    },
    orderDiscount: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      defaultValue: 0,
      validate: {
        max: {
          args: [0.1],
          msg: 'Discount can be more than ten percent',
        },
      },

      //
    },
    total: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
      allowNull: false,
      unique: false,
    },
    firstName: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'The first name must be between 2 and 50 characters.',
        },
      },
    },
    lastName: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'The last name must be between 2 and 50 characters.',
        },
      },
    },
    street: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    zipCode: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
      validate: {
        len: {
          args: [5],
          msg: 'Zip Code must be 5 digits long.',
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'Please provide a valid email address',
        },
      },
    },
    homePhone: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
      validate: {
        len: {
          args: [10],
          msg: 'Home phone number must be 10 digits.',
        },
      },
    },
    cellPhone: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
      validate: {
        len: {
          args: [10],
          msg: 'Cell phone number must be 10 digits.',
        },
      },
    },
    comments: {
      type: Sequelize.TEXT,
      allowNull: true,
      unique: false,
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
    modelName: 'Orders',
  }
);

// sequelize.sync({ force: true });

const getOrderTotal = async (order, req, res) => {
  const { tax, subTotal, shipping, orderDiscount } = order.dataValues;

  const taxAmount = Number(tax) * Number(subTotal);

  const total =
    Number(taxAmount) +
    Number(shipping) +
    Number(subTotal) -
    Number(orderDiscount);

  order.dataValues.total = total;

  console.log(taxAmount);
  console.log(Number(taxAmount) + Number(subTotal));
  console.log(total);
};

Order.beforeCreate(getOrderTotal);
// Order.afterCreate(getOrderTotal);

module.exports = Order;
