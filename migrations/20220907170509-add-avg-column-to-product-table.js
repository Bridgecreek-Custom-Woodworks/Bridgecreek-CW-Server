'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'avgRating', {
      type: Sequelize.DECIMAL,
      defaultValue: 0.0,
      allowNull: true,
      unique: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'avgRating');
  },
};
