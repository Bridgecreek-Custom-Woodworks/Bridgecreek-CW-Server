const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);

// USERS INFO ***************************************
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
};

exports.newUser = {
  userId: '59c23bd0-1fac-4037-b5cb-a676cf6d5f9e',
  firstName: 'Sammy',
  lastName: 'Jones',
  street: '1245 Holland St',
  city: 'Charlotte',
  state: 'NC',
  homePhone: '555-342-8734',
  cellPhone: '555-420-9071',
  password: 'admin1234',
  zipCode: '28227',
  email: 'samjones@gmail.com',
};
exports.updateDeleteUser = {
  userId: 'e2059294-5a76-4484-8ec1-ea9bdc3a64a0',
  firstName: 'Leo',
  lastName: 'Getz',
  street: '1245 Holly Pl',
  city: 'Charlotte',
  state: 'NC',
  homePhone: '555-342-2245',
  cellPhone: '555-420-5833',
  password: 'admin1234',
  zipCode: '28227',
  email: 'leogetzs@gmail.com',
};

exports.userKeys = [
  'firstName',
  'lastName',
  'street',
  'city',
  'state',
  'homePhone',
  'cellPhone',
  'zipCode',
  'email',
  'createdAt',
  'resetPasswordExpire',
  'resetPasswordToken',
  'role',
  'updatedAt',
  'userId',
];

exports.hashedPassword =
  '$2a$10$m68LfWK4S1BQoc/C0H9QmO15VcJ0Jaidz1YWFIsJhBCTjtz2RID1m';

// PRODUCTS INFO ****************************************************

exports.product = {
  productId: '1ee44e7e-6a3a-4a6d-9626-32d4447ef25f',
  productName: 'Cutting Board',
  price: 45,
  weight: 12,
  dementions: '1.5ft X 2ft',
  description: 'Wooded cutting board',
  url: 'foo@bar.com',
  createdAt: '2022-09-01T21:43:17.243Z',
  updatedAt: '2022-09-01T21:43:17.243Z',
};

exports.newProduct = {
  productId: '6db8cfdd-ddaf-4165-be30-6eb55107a0b8',
  productName: 'New Product',
  price: 119,
  weight: 24,
  dementions: '1.5ft X 2ft',
  description: 'Some new product description',
  url: 'foo@bar.com',
  createdAt: '2022-09-01T21:43:17.243Z',
  updatedAt: '2022-09-01T21:43:17.243Z',
};

exports.productKeys = [
  'productId',
  'productName',
  'price',
  'weight',
  'dementions',
  'description',
  'url',
  'avgRating',
  'createdAt',
  'updatedAt',
];
