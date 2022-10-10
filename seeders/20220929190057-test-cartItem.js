'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'CartItems',
      [
        {
          quantity: 2,
          discount: 10,
          total: 30,
          productId: '2c7e9ccd-a521-4505-b03f-1ff24614fad7',
          cartId: 'e4e71f3b-6523-4c97-980e-2c80be8dc352',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          quantity: 3,
          discount: 10,
          total: 135,
          productId: '1ee44e7e-6a3a-4a6d-9626-32d4447ef25f',
          cartId: 'e4e71f3b-6523-4c97-980e-2c80be8dc352',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          quantity: 2,
          discount: 10,
          total: 301.98,
          productId: '68c70732-98ff-40cc-86ce-04ceef2eb623',
          cartId: '85081ddb-1fdb-4a17-9466-70473bde7218',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          quantity: 1,
          discount: 10,
          total: 15,
          productId: '2c7e9ccd-a521-4505-b03f-1ff24614fad7',
          cartId: '85081ddb-1fdb-4a17-9466-70473bde7218',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          quantity: 5,
          discount: 10,
          total: 225,
          productId: '1ee44e7e-6a3a-4a6d-9626-32d4447ef25f',
          cartId: 'ed4bf152-50cf-459f-8040-191dc6d136f3',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CartItems', null, {});
  },
};
