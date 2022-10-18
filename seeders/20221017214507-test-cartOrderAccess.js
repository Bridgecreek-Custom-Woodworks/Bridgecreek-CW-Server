'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'CartOrderAccess',
      [
        {
          cartOrderAccessId: '3075ab56-e614-4b64-8874-94d33e825914',
          userName: 'Otto',
          customerId: '1024cf0f-9c88-4af3-8eb3-928a0a0b844e',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartOrderAccessId: '512edbde-a938-4216-8181-0ef9ba456e2f',
          userName: 'Mike Strange',
          customerId: '15242016-6385-4ef3-9c9a-0ec1bf595515',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartOrderAccessId: '09f8af99-3a84-41c5-bcc2-70fd5807dbf8',
          userName: 'Debrah Johnson',
          customerId: 'aa1b2829-6807-4d6e-b6bd-f5debeb93577',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartOrderAccessId: 'a0eee4f6-f248-4b12-8486-3a27d0f20cf6',
          userName: 'Jordan Peters',
          customerId: 'cfbe9359-0b14-430a-ad6c-0aef1a36152f',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartOrderAccessId: '20d07cfc-fcd7-43af-84ae-998ccef52cd6',
          userName: 'Some Body',
          customerId: 'e857a4a6-b506-4e20-b214-1ce57773bc46',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CartOrderAccess', null, {});
  },
};
