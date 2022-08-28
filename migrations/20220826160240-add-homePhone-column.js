'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'homePhone', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'homePhone')
  },
}
