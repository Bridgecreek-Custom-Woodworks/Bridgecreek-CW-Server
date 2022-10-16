'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'CartItems',
      [
        {
          cartItemId: '1d11569e-446c-4a19-b0fe-5b2bee6482c6',
          quantity: 2,
          discountTotal: 3,
          total: 27,
          productId: '2c7e9ccd-a521-4505-b03f-1ff24614fad7',
          cartId: 'e4e71f3b-6523-4c97-980e-2c80be8dc352',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartItemId: '02bab2b4-67ee-4e97-aba0-4952a93673d0',
          quantity: 3,
          discountTotal: 13.5,
          total: 121.5,
          productId: '1ee44e7e-6a3a-4a6d-9626-32d4447ef25f',
          cartId: 'e4e71f3b-6523-4c97-980e-2c80be8dc352',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartItemId: 'edee121f-ae4b-488d-91d4-a9f32e39d001',
          quantity: 2,
          discountTotal: 30.19,
          total: 271.79,
          productId: '68c70732-98ff-40cc-86ce-04ceef2eb623',
          cartId: '85081ddb-1fdb-4a17-9466-70473bde7218',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartItemId: 'ec115f8b-977f-4083-825d-d27d6fd16561',
          quantity: 1,
          discountTotal: 1.5,
          total: 13.5,
          productId: '2c7e9ccd-a521-4505-b03f-1ff24614fad7',
          cartId: '85081ddb-1fdb-4a17-9466-70473bde7218',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartItemId: '27c0f763-1b70-48a9-8fac-c097ba318421',
          quantity: 5,
          discountTotal: 22.5,
          total: 202.5,
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
