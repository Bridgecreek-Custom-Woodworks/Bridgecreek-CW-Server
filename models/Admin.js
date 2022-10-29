const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admins = sequelize.define('Admins', {
  adminId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  cartOrderAccessId: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'CartOrderAccess',
      key: 'cartOrderAccessId',
    },
  },
  firstName: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: false,
    validate: {
      len: {
        args: [2, 50],
        msg: 'The first name must be between, 2 and 50 characters.',
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
        msg: 'The first name must be between, 2 and 50 characters.',
      },
    },
  },

  role: {
    type: Sequelize.STRING,
    defaultValue: 'user',
    unique: false,
    validate: {
      isIn: {
        args: [['admin', 'sales_rep']],
        msg: 'User can only have a role of user or sales rep',
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
  password: {
    type: Sequelize.STRING,
    allowNull: false,
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
});

const saltAndHashPassword = async (admin) => {
  if (admin.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.dataValues.password, salt);
  }
};

Admins.prototype.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

Admins.prototype.getSignedToken = async function () {
  return jwt.sign({ adminId: this.adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

Admins.prototype.createCartOrderAccess = async function (cartOrderAccessModel) {
  let customer = {
    userName: `${this.firstName} ${this.lastName}`,
    customerId: this.adminId,
  };

  const cartOrderAccess = await cartOrderAccessModel.create(customer);

  this.cartOrderAccessId = cartOrderAccess.cartOrderAccessId;
};

Admins.beforeCreate(saltAndHashPassword);
Admins.beforeUpdate(saltAndHashPassword);

module.exports = Admins;
