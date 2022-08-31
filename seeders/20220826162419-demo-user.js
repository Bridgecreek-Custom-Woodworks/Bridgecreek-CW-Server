'use strict'
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

const password = bcrypt.hashSync('admin1234', salt)
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        userId: uuidv4(),
        firstName: 'Otto',
        lastName: 'Jones',
        street: '124 Main St',
        city: 'Columbia',
        state: 'SC',
        homePhone: '555-342-9236',
        cellPhone: '555-420-1583',
        password: password,
        zipCode: '29226',
        email: 'ottojones@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: uuidv4(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: uuidv4(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: uuidv4(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: uuidv4(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  },
}
