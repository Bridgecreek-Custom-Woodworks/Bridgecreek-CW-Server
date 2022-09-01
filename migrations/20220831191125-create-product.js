'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products')
  },
}
