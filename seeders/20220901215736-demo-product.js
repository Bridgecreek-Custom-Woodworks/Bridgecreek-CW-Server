'use strict'
const { v4: uuidv4 } = require('uuid')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        productId: uuidv4(),
        productName: 'Cutting Board',
        price: 45,
        weight: 12,
        dementions: '1.5ft X 2ft',
        description: 'Wooded cutting board',
        url: 'foo@bar.com',
        createdAt: '2022-09-01T21:43:17.243Z',
        updatedAt: '2022-09-01T21:43:17.243Z',
      },
      {
        productId: uuidv4(),
        productName: 'Coasters',
        price: 15,
        weight: 12,
        dementions: '.5ft X .5ft',
        description: 'Wooded coaster',
        url: 'foo@bar.com',
        createdAt: '2022-09-01T21:44:04.610Z',
        updatedAt: '2022-09-01T21:44:04.610Z',
      },
      {
        productId: uuidv4(),
        productName: 'Wine Rack',
        price: 25,
        weight: 5,
        dementions: '.75ft X .5ft',
        description: 'Wooded wine rack',
        url: 'foo@bar.com',
        createdAt: '2022-09-01T21:44:04.610Z',
        updatedAt: '2022-09-01T21:44:04.610Z',
      },
      {
        productId: uuidv4(),
        productName: 'Side table',
        price: 150.99,
        weight: 45,
        dementions: 'H 2.5ft X L 15 inches X W 20 inches',
        description: 'Wooded side table',
        url: 'foo@bar.com',
        createdAt: '2022-09-01T21:44:04.610Z',
        updatedAt: '2022-09-01T21:44:04.610Z',
      },
      {
        productId: uuidv4(),
        productName: 'Cell phone stand',
        price: 15,
        weight: 1.5,
        dementions: 'H .5 inches X L .75 inches',
        description: 'Wooded cell phone stand',
        url: 'foo@bar.com',
        createdAt: '2022-09-01T21:44:04.610Z',
        updatedAt: '2022-09-01T21:44:04.610Z',
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {})
  },
}
