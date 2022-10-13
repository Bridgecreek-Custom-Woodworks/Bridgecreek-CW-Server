'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Carts',
      [
        {
          cartId: 'e4e71f3b-6523-4c97-980e-2c80be8dc352',
          cartStatus: 'checkout',
          userId: '1024cf0f-9c88-4af3-8eb3-928a0a0b844e',
          total: 165.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartId: '85081ddb-1fdb-4a17-9466-70473bde7218',
          cartStatus: 'checkout',
          userId: '15242016-6385-4ef3-9c9a-0ec1bf595515',
          total: 316.98,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartId: 'ed4bf152-50cf-459f-8040-191dc6d136f3',
          cartStatus: 'new',
          userId: 'aa1b2829-6807-4d6e-b6bd-f5debeb93577',
          total: 225.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Carts', null, {});
  },
};
