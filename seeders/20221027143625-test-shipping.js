'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'ShippingAddress',
      [
        {
          shippingAddressId: 'a609cb92-9cd6-41ca-865b-954aebd2889c',
          userId: '1024cf0f-9c88-4af3-8eb3-928a0a0b844e',
          street: '312 Ceder Pl',
          city: 'Charlotte',
          state: 'NC',
          zipCode: '28977',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          shippingAddressId: 'b752c15b-cff6-4ddc-ad36-dff1f4bd55ce',
          userId: 'aa1b2829-6807-4d6e-b6bd-f5debeb93577',
          street: '14327 Old Dubbin Dr',
          city: 'Huntersville',
          state: 'NC',
          zipCode: '28078',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          shippingAddressId: 'b2e01020-7664-4b5d-a525-e28def8d3d3a',
          street: '107 Juanita Dr',
          userId: '15242016-6385-4ef3-9c9a-0ec1bf595515',
          city: 'Charlotte',
          state: 'NC',
          zipCode: '29226',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ShippingAddress', null, {});
  },
};
