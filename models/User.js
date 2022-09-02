const Sequelize = require('sequelize')
const sequelize = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Wishlist = require('../models/Wishlist')
const Products = require('../models/Product')

const User = sequelize.define(
  'Users',
  {
    userId: {
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
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    resetPasswordExpire: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true,
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: 'user',
      unique: false,
      validate: {
        isIn: {
          args: [['user', 'sales_rep']],
          msg: 'User can only have a role of user or sales rep',
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
    // This is one way to remove to password from the return. It gives you control in that you can still return the password within the route function using scope('withPassword'). EXAMPLE: const user = await User.scope('withPassword').findOne({
    //   where: { id: req.params.id },
    // });
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: {},
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
)

User.belongsToMany(Products, { through: 'Wishlists', foreignKey: 'userId' })
Products.belongsToMany(User, { through: 'Wishlists', foreignKey: 'productId' })

// sequelize.sync({ alter: true })
// sequelize.sync({ force: true })

// REMEMBER TO VALIDATE THE PASSWORD BEFORE IT IS SAVED. MAYBE USE THE HOOK BEFORCREATE BUT REMEMBER THAT I NEED TO VALIDATE IT BEFORE IT IS HASHED AND SALTED.
// validate: {
//   is: {
//     args: '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,10}$',
//     msg: 'Password must be a minimum of 8 and maximum of 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
//   },
// },

const saltAndHashPassword = async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.dataValues.password, salt)
  }
}

User.prototype.getSignedToken = async function () {
  return jwt.sign({ userId: this.userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

User.prototype.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

User.beforeCreate(saltAndHashPassword)

module.exports = User
