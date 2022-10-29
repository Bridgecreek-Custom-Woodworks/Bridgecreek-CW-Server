'use strict';
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const password = bcrypt.hashSync('admin1234', salt);

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Admins',
      [
        {
          adminId: 'a0566232-3f3a-4773-8fb2-532eeacf4e5b',
          cartOrderAccessId: 'f989830e-3fdd-4467-8ccb-0e93bcb5df03',
          firstName: 'Otto',
          lastName: 'Jones Sr',
          role: 'admin',
          email: 'totallyboredwoodworking@outlook.com',
          cellPhone: '8034451535',
          password: password,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          adminId: 'ecc8850b-b490-49c4-8593-828878eaf285',
          cartOrderAccessId: '15fdbb54-7095-4b72-962f-d9e03d1cfff1',
          firstName: 'Otto',
          lastName: 'Jones jr',
          role: 'admin',
          email: 'ottosjonesjr@gmail.com',
          cellPhone: '9808750682',
          password: password,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Admins', null, {});
  },
};
