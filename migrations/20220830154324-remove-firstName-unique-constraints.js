'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'firstName', {
      unique: true,
    })
  },
}
