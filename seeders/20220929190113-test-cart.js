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
        {
          cartId: '8a512c08-0454-4e79-8d05-6165cdbb1d7c',
          cartOrderAccessId: 'dea0721a-7646-4a6e-8d95-9ca1ec56e931',
          total: 176.39,
          cartStatus: 'checkout',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartId: '14fd37d2-0b9b-468a-8883-58b16d5d9a5c',
          cartOrderAccessId: '56a75180-52be-43a1-af2a-75c10b828d71',
          total: 189.0,
          cartStatus: 'checkout',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartId: '9c855a1d-3565-4cb8-bb54-a17fa6e01904',
          cartOrderAccessId: '141e87fa-9111-4a27-814b-9a5a22b572df',
          total: 270.0,
          cartStatus: 'checkout',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartId: '1a7e1801-6e9b-4403-be14-b1ec97730931',
          cartOrderAccessId: '8ec662d3-fac8-4ff6-93cb-6e36c3d51ef1',
          total: 298.78,
          cartStatus: 'checkout',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartId: '3fdb1127-3fba-44fa-9490-c49bcc9623aa',
          cartOrderAccessId: '1e7130c8-4c2e-46ee-afbd-695eee66f945',
          total: 27.0,
          cartStatus: 'new',
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
