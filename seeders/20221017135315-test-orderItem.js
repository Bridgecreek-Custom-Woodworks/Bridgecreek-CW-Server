'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'OrderItems',
      [
        {
          orderItemId: '498b7ab5-1c04-456f-891b-be90d5dd7db3',
          productId: '1ee44e7e-6a3a-4a6d-9626-32d4447ef25f',
          orderId: '76e35ec6-de02-432a-aa01-e58703d407f6',
          price: '45',
          discountTotal: '4.50',
          quantity: 3,
          total: '121.5',
          createdAt: '2022-10-17T13:55:40.897Z',
          updatedAt: '2022-10-17T13:55:40.897Z',
        },
        {
          orderItemId: '655038c0-44d6-43fc-8101-cb87dd2b109f',
          productId: '2c7e9ccd-a521-4505-b03f-1ff24614fad7',
          orderId: '76e35ec6-de02-432a-aa01-e58703d407f6',
          price: '15',
          discountTotal: '1.50',
          quantity: 2,
          total: '27',
          createdAt: '2022-10-17T13:55:40.899Z',
          updatedAt: '2022-10-17T13:55:40.899Z',
        },
        {
          orderItemId: 'abecf25a-75e9-4229-9683-adbd20229c51',
          productId: '68c70732-98ff-40cc-86ce-04ceef2eb623',
          orderId: '3dd7bd5d-436f-4087-8550-324722bc43c5',
          price: '150.99',
          discountTotal: '15.10',
          quantity: 2,
          total: '271.79',
          createdAt: '2022-10-17T13:57:51.133Z',
          updatedAt: '2022-10-17T13:57:51.133Z',
        },
        {
          orderItemId: '2aea84e4-8467-4688-98c6-cf051cc7a2b8',
          productId: '2c7e9ccd-a521-4505-b03f-1ff24614fad7',
          orderId: '3dd7bd5d-436f-4087-8550-324722bc43c5',
          price: '15',
          discountTotal: '1.50',
          quantity: 1,
          total: '13.5',
          createdAt: '2022-10-17T13:57:51.131Z',
          updatedAt: '2022-10-17T13:57:51.131Z',
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('People', null, {});
  },
};
