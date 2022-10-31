'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        productId: '1ee44e7e-6a3a-4a6d-9626-32d4447ef25f',
        stripeProductId: 'price_1Lz3x4EUecojPOrFK3SAJTZf',
        productName: 'Cutting Board',
        price: 45,
        weight: 12,
        dementions: '1.5ft X 2ft',
        description: 'Wooden Cutting Board',
        url: 'foo@bar.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        avgRating: 4.5,
      },
      {
        productId: '2c7e9ccd-a521-4505-b03f-1ff24614fad7',
        stripeProductId: 'price_1Lz40CEUecojPOrFOklAQz0e',
        productName: 'Coasters set with holder',
        price: 15,
        weight: 12,
        dementions: '.5ft X .5ft',
        description: 'Wooden Coasters',
        url: 'foo@bar.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        avgRating: 3,
      },
      {
        productId: '33cf392c-087e-4143-858c-9e00c7c6a119',
        stripeProductId: 'price_1Lz411EUecojPOrFdOhuTxyq',
        productName: 'Cheese Boards',
        price: 25,
        weight: 5,
        dementions: '.75ft X .5ft',
        description: 'Wooden Cheese Boards',
        url: 'foo@bar.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        avgRating: 5,
      },
      {
        productId: '68c70732-98ff-40cc-86ce-04ceef2eb623',
        stripeProductId: 'price_1Lz41vEUecojPOrF6NwtwJKY',
        productName: 'Carving Boards',
        price: 150.99,
        weight: 45,
        dementions: 'H 2.5ft X L 15 inches X W 20 inches',
        description: 'Wooden Carving Boards',
        url: 'foo@bar.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        avgRating: 0,
      },
      {
        productId: '700b2eb1-3de0-4d9d-a0b7-a9d48c67f1ac',
        stripeProductId: 'price_1Lz430EUecojPOrFAuFp0c6f',
        productName: 'Board Holder',
        price: 15,
        weight: 1.5,
        dementions: 'H .5 inches X L .75 inches',
        description: 'Wooden Board Holder',
        url: 'foo@bar.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        avgRating: 0,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  },
};
