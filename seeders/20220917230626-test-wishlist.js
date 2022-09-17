'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Wishlists',
      [
        {
          userId: '1024cf0f-9c88-4af3-8eb3-928a0a0b844e',
          productId: '1ee44e7e-6a3a-4a6d-9626-32d4447ef25f',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: '1024cf0f-9c88-4af3-8eb3-928a0a0b844e',
          productId: '2c7e9ccd-a521-4505-b03f-1ff24614fad7',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: '15242016-6385-4ef3-9c9a-0ec1bf595515',
          productId: '1ee44e7e-6a3a-4a6d-9626-32d4447ef25f',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: '15242016-6385-4ef3-9c9a-0ec1bf595515',
          productId: '33cf392c-087e-4143-858c-9e00c7c6a119',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 'e857a4a6-b506-4e20-b214-1ce57773bc46',
          productId: '68c70732-98ff-40cc-86ce-04ceef2eb623',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Wishlists', null, {});
  },
};
