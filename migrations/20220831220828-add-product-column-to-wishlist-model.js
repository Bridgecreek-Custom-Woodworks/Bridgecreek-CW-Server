'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Wishlists', 'productId', {
      type: Sequelize.UUID,
      references: {
        model: 'Products',
        key: 'productId',
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Wishlists', 'productId')
  },
}
