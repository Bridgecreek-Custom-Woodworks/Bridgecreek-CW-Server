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
        //
        {
          cartOrderAccessId: 'dea0721a-7646-4a6e-8d95-9ca1ec56e931',
          userName: 'Guest ce53bd73',
          customerId: 'ce53bd73-64ff-42f2-a3f7-92a7429e5880',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartOrderAccessId: '56a75180-52be-43a1-af2a-75c10b828d71',
          customerId: '1262ba1b-047c-4ba0-bb16-11d5df461e26',
          userName: 'Guest 1262ba1b',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartOrderAccessId: '141e87fa-9111-4a27-814b-9a5a22b572df',
          customerId: '836d7cd6-abdf-450c-97f7-4f277fba43a0',
          userName: 'Guest 836d7cd6',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartOrderAccessId: '8ec662d3-fac8-4ff6-93cb-6e36c3d51ef1',
          customerId: '0cb63ee4-8a2c-4b12-8bf4-9f6766470ca1',
          userName: 'Guest 0cb63ee4',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cartOrderAccessId: '1e7130c8-4c2e-46ee-afbd-695eee66f945',
          customerId: '7789a666-5129-413e-99e9-2c1570d55dcf',
          userName: 'Guest 7789a666',
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
