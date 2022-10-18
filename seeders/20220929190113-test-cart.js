'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Carts',
      [
        {
          cartId: 'e4e71f3b-6523-4c97-980e-2c80be8dc352',
          cartStatus: 'checkout',
          cartOrderAccessId: '3075ab56-e614-4b64-8874-94d33e825914',
          total: 148.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartId: '85081ddb-1fdb-4a17-9466-70473bde7218',
          cartStatus: 'checkout',
          cartOrderAccessId: '512edbde-a938-4216-8181-0ef9ba456e2f',
          total: 285.29,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartId: 'ed4bf152-50cf-459f-8040-191dc6d136f3',
          cartStatus: 'new',
          cartOrderAccessId: '09f8af99-3a84-41c5-bcc2-70fd5807dbf8',
          total: 205.5,
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
