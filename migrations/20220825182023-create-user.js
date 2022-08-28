'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      userId: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
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
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      resetPasswordExpire: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      role: {
        type: Sequelize.ENUM('user', 'sales_rep'),
        defaultValue: 'user',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users')
  },
}
