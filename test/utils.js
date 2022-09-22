const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);

exports.user = {
  userId: '1024cf0f-9c88-4af3-8eb3-928a0a0b844e',
  firstName: 'Otto',
  lastName: 'Jones',
  street: '124 Main St',
  city: 'Columbia',
  state: 'SC',
  homePhone: '555-342-9236',
  cellPhone: '555-420-1583',
  password: 'admin1234',
  zipCode: '29226',
  email: 'ottojones@gmail.com',
  role: 'admin',
  hashedPassword:
    '$2a$10$m68LfWK4S1BQoc/C0H9QmO15VcJ0Jaidz1YWFIsJhBCTjtz2RID1m',
};

exports.newUser = {
  userId: '1024cf0f-9c88-4af3-8eb3-928a0a03329r',
  firstName: 'Sammy',
  lastName: 'Jones',
  street: '1245 Holland St',
  city: 'Charlotte',
  state: 'NC',
  homePhone: '555-342-8734',
  cellPhone: '555-420-9071',
  password: 'admin1234',
  zipCode: '28277',
  email: 'samjones@gmail.com',
};
