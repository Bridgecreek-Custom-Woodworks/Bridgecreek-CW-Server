'use strict';
const { v4: uuidv4 } = require('uuid');
let uuid4 = uuidv4();
uuid4 = uuid4.split('-');
uuid4 = uuid4[1];
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const password = bcrypt.hashSync(uuid4, salt);

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Guests',
      [
        {
          guestId: 'ce53bd73-64ff-42f2-a3f7-92a7429e5880',
          cartOrderAccessId: 'dea0721a-7646-4a6e-8d95-9ca1ec56e931',
          guestName: 'Guest ce53bd73',
          role: 'guest',
          activeStatus: 'active',
          password: password,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          guestId: '1262ba1b-047c-4ba0-bb16-11d5df461e26',
          cartOrderAccessId: '56a75180-52be-43a1-af2a-75c10b828d71',
          guestName: 'Guest 1262ba1b',
          role: 'guest',
          activeStatus: 'active',
          password: password,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          guestId: '836d7cd6-abdf-450c-97f7-4f277fba43a0',
          cartOrderAccessId: '141e87fa-9111-4a27-814b-9a5a22b572df',
          guestName: 'Guest 836d7cd6',
          role: 'guest',
          activeStatus: 'active',
          password: password,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          guestId: '0cb63ee4-8a2c-4b12-8bf4-9f6766470ca1',
          cartOrderAccessId: '8ec662d3-fac8-4ff6-93cb-6e36c3d51ef1',
          guestName: 'Guest 0cb63ee4',
          role: 'guest',
          activeStatus: 'active',
          password: password,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          guestId: '7789a666-5129-413e-99e9-2c1570d55dcf',
          cartOrderAccessId: '1e7130c8-4c2e-46ee-afbd-695eee66f945',
          guestName: 'Guest 7789a666',
          role: 'guest',
          activeStatus: 'not active',
          password: password,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Guests', null, {});
  },
};
