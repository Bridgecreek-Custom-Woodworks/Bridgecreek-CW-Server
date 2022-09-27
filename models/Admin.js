const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Admins = sequelize.define('Admins', {
  adminId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
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

  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
});

module.exports = Admins;
