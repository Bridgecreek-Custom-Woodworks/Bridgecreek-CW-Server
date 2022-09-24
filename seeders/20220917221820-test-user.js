'use strict';
// const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const password = bcrypt.hashSync('admin1234', salt);

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        userId: '1024cf0f-9c88-4af3-8eb3-928a0a0b844e',
        firstName: `Otto-Test-DB`,
        lastName: 'Jones',
        street: '124 Main St',
        city: 'Columbia',
        state: 'SC',
        homePhone: '555-342-9236',
        cellPhone: '555-420-1583',
        password: password,
        zipCode: '29226',
        email: 'ottojones@gmail.com',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: '15242016-6385-4ef3-9c9a-0ec1bf595515',
        firstName: 'Mike',
        lastName: 'Strange',
        street: '107 Juanita Dr',
        city: 'Pineville',
        state: 'NC',
        homePhone: '555-980-2589',
        cellPhone: '555-409-2947',
        password: password,
        zipCode: '29226',
        email: 'mikestrange@gmail.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 'aa1b2829-6807-4d6e-b6bd-f5debeb93577',
        firstName: 'Debrah',
        lastName: 'Johnson',
        street: '14327 Old Dubbin Dr',
        city: 'Huntersville',
        state: 'NC',
        homePhone: '555-798-4321',
        cellPhone: '555-420-1583',
        password: password,
        zipCode: '28078',
        email: 'debrahjohnson@gmail.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 'cfbe9359-0b14-430a-ad6c-0aef1a36152f',
        firstName: 'Jordan',
        lastName: 'Peters',
        street: '12307 Kayak Dr',
        city: 'Upper Marlboro',
        state: 'MD',
        homePhone: '555-342-9236',
        cellPhone: '555-420-1583',
        password: password,
        zipCode: '20772',
        email: 'jordanpeters@gmail.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 'e857a4a6-b506-4e20-b214-1ce57773bc46',
        firstName: 'Some',
        lastName: 'Body',
        street: '5908 Queens Cove Ct',
        city: 'Charlotte',
        state: 'NC',
        homePhone: '555-342-9236',
        cellPhone: '555-420-1583',
        password: password,
        zipCode: '28217',
        email: 'somebody@gmail.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
