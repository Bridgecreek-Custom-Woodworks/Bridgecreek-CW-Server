process.argv[2] === '-dev'
  ? (process.env.NODE_ENV = 'development')
  : (process.env.NODE_ENV = 'test');

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);
const User = require('../models/User');
const colors = require('colors');
const sequelize = require('../config/db');
const { v4: uuidv4 } = require('uuid');
let uuid4 = uuidv4();
uuid4 = uuid4.split('-');
uuid4 = uuid4[1];
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const password = bcrypt.hashSync(uuid4, salt);
const fs = require('fs');

const deleteData = async () => {
  await sequelize.sync({ force: true });
  const count = await User.count();
  console.log('Count', count);
  process.exit();
};

if (process.argv[2] === '-dev') {
  process.env.NODE_ENV = 'development';
  deleteData();
  console.log(`Your development data was destroyed`.red.inverse);
} else if (process.argv[2] === '-test') {
  process.env.NODE_ENV = 'test';
  deleteData();
  console.log(`Your test data was destroyed`.blue.inverse);
}
let image = Buffer.from(
  fs.readFileSync('./test/test_images/Chopping-board.jpeg')
).toString('base64');

image = 'data:image/jpeg;base64,' + image;

// USERS INFO ***************************************
exports.user = {
  userId: '1024cf0f-9c88-4af3-8eb3-928a0a0b844e',
  firstName: 'Otto-Test-DB',
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

exports.activeUser = {
  userId: '5ad14528-3809-4886-95c8-833c19754493',
  firstName: 'Active',
  lastName: 'User',
  street: '426 South St',
  city: 'Columbia',
  state: 'SC',
  homePhone: '555-342-9236',
  cellPhone: '555-420-1583',
  password: 'admin1234',
  zipCode: '29226',
  email: 'activeuser@gmail.com',
  activeStatus: 'pending',
  role: 'user',
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
  'activeStatus',
  'cartOrderAccessId',
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
  price: '119.00',
  discount: 0.1,
  weight: 24,
  dementions: '1.5ft X 2ft',
  description: 'Some new product description',
  url: 'foo@bar.com',
  image, // <=== See top of file for image ref
  createdAt: '2022-09-01T21:43:17.243Z',
  updatedAt: '2022-09-01T21:43:17.243Z',
  maintenance: 'Take care of this new product',
};
exports.newAuthProduct = {
  productId: '5a4e4574-9455-4b02-ac26-6467f5e5d333',
  productName: 'New Auth Product',
  price: '119.00',
  discount: 0.1,
  weight: 24,
  dementions: '1.5ft X 2ft',
  description: 'Some new auth product description',
  url: 'foo@bar.com',
  image, // <=== See top of file for image ref
  createdAt: '2022-09-01T21:43:17.243Z',
  updatedAt: '2022-09-01T21:43:17.243Z',
  maintenance: 'Take care of this new auth product',
};

exports.productKeys = [
  'productId',
  'stripeProductId',
  'productName',
  'price',
  'discount',
  'weight',
  'dementions',
  'description',
  'url',
  'avgRating',
  'createdAt',
  'updatedAt',
  'displayStatus',
];

exports.singleProductKeys = [
  'productId',
  'stripeProductId',
  'productName',
  'price',
  'discount',
  'weight',
  'dementions',
  'description',
  'url',
  'avgRating',
  'createdAt',
  'updatedAt',
  'Reviews',
  'displayStatus',
];

// WISHLISTS INFO ****************************************************

exports.wishlist = [
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
];

exports.wishlistKeys = ['userId', 'productId', 'createdAt', 'updatedAt'];

exports.newWishlistItem = {
  userId: '1024cf0f-9c88-4af3-8eb3-928a0a0b844e',
  productId: '68c70732-98ff-40cc-86ce-04ceef2eb623',
  createdAt: new Date(),
  updatedAt: new Date(),
};

//  REVIEWS INFO ****************************************************

exports.reviewKeys = [
  'userId',
  'reviewId',
  'productId',
  'comments',
  'rating',
  'updatedAt',
  'createdAt',
];

exports.singleReviewKeys = [
  'reviewId',
  'productId',
  'comments',
  'rating',
  'updatedAt',
  'createdAt',
  'Product',
  'User',
];

exports.myReviewKeys = [
  'updatedAt',
  'createdAt',
  'comments',
  'rating',
  'Product',
];

exports.addReviewKeys = [
  'userId',
  'reviewId',
  'productId',
  'comments',
  'rating',
  'updatedAt',
  'createdAt',
];

exports.review = {
  reviewId: 'f4019e62-f3c7-44fc-9b0e-bf308b1b46bb',
  productId: '2c7e9ccd-a521-4505-b03f-1ff24614fad7',
  comments: 'I love my new coasters. The wood is so beautiful!!',
  rating: 5,
};

exports.reviewedProduct = {
  productId: '2c7e9ccd-a521-4505-b03f-1ff24614fad7',
  productName: 'Coasters',
  price: 15,
  weight: 12,
  dementions: '.5ft X .5ft',
  description: 'Wooded coaster',
  url: 'foo@bar.com',
  createdAt: '2022-09-01T21:44:04.610Z',
  updatedAt: '2022-09-01T21:44:04.610Z',
  avgRating: 3,
};

//  ERROR HANDLING AND AUTHORIZATION INFO ****************************************************

exports.badIdProduct = {
  productId: '1ee44e7e-6a3a-4a6d-9626-32d4447ef25fTEST', // <== Bad Id for test
  productName: 'New Bad Id Product',
  price: '45.00',
  weight: 12,
  dementions: '1.5ft X 2ft',
  description: 'Wooded cutting board',
  url: 'foo@bar.com',
  image, // <=== See top of file for image ref
  createdAt: '2022-09-01T21:43:17.243Z',
  updatedAt: '2022-09-01T21:43:17.243Z',
  maintenance: 'Take care of this new auth product',
};

exports.badValidationProduct = {
  productId: '383bfc56-b491-4d2e-aa39-74250b1bfe39',
  productName: 'New Bad Product',
  price: '119.00',
  weight: 24,
  dementions: '1.5ft X 2ft',
  description: 'Some new product description',
  url: 'foo@bar', // <== Bad url format
  image, // <=== See top of file for image ref
  createdAt: '2022-09-01T21:43:17.243Z',
  updatedAt: '2022-09-01T21:43:17.243Z',
};

exports.badToken = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDI0Y2YwZi05Yzg4LTRhZjMtOGViMy05MjhhMGEwYjg0NGUiLCJpYXQiOjE2NjQyMTk3NjUsImV4cCI6MTY2NjgxMTc2NX0.BEWxEXwufLSCriwlL4ogqr-WjY1ufTjuD_v5j9c9tC',
};

exports.unauthorizedUser = {
  userId: 'e857a4a6-b506-4e20-b214-1ce57773bc46',
  firstName: 'Some',
  lastName: 'Body',
  street: '5908 Queens Cove Ct',
  city: 'Charlotte',
  state: 'NC',
  homePhone: '555-342-9236',
  cellPhone: '555-420-1583',
  password: 'admin1234',
  zipCode: '28217',
  email: 'somebody@gmail.com',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date(),
};

//  CART INFO ****************************************************

exports.userCartKeys = [
  'cartId',
  'cartOrderAccessId',
  'total',
  'cartStatus',
  'createdAt',
  'updatedAt',
  'CartOrderAccess',
  'Products',
];

exports.cartKeys = [
  'cartOrderAccessId',
  'cartId',
  'total',
  'cartStatus',
  'createdAt',
  'updatedAt',
];

//  CART ITEM INFO ****************************************************

exports.cartItemKeys = [
  'cartItemId',
  'productId',
  'cartId',
  'quantity',
  'Product',
  'discountTotal',
  'updatedAt',
  'createdAt',
  'total',
];

//  ADVANCED QUERY SEARCH INFO ****************************************************

exports.advancedQuerySearchKeys = ['firstName', 'lastName', 'cellPhone'];

exports.getFirstLetterOfFirstName = (arr) => {
  const letterArray = [];

  for (let i = 0; i < arr.length; i++) {
    const firstLetter = arr[i].firstName[0].toUpperCase();
    letterArray.push(firstLetter);
  }

  return letterArray;
};

// ORDER INFO *************************************************************

exports.orderKeys = [
  'orderId',
  'cartOrderAccessId',
  'orderStatus',
  'subTotal',
  'tax',
  'taxTotal',
  'shipping',
  'orderDiscount',
  'total',
  'firstName',
  'lastName',
  'street',
  'city',
  'state',
  'zipCode',
  'email',
  'homePhone',
  'cellPhone',
  'comments',
  'createdAt',
  'updatedAt',
  'billingAddressId',
];
exports.createOrderKeys = [
  'orderId',
  'cartOrderAccessId',
  'orderStatus',
  'subTotal',
  'tax',
  'taxTotal',
  'shipping',
  'orderDiscount',
  'total',
  'firstName',
  'lastName',
  'street',
  'city',
  'state',
  'zipCode',
  'email',
  'homePhone',
  'cellPhone',
  'comments',
  'createdAt',
  'updatedAt',
  'Products',
  'billingAddressId',
];

// ORDER ITEM INFO *************************************************************

exports.orderItemKeys = [
  'orderItemId',
  'productId',
  'orderId',
  'price',
  'discountTotal',
  'quantity',
  'total',
  'createdAt',
  'updatedAt',
];

exports.orderItem = {
  productId: '68c70732-98ff-40cc-86ce-04ceef2eb623',
  price: '150.99',
  quantity: 3,
  discountTotal: '15.10',
  total: '437.87',
  orderId: '76e35ec6-de02-432a-aa01-e58703d407f6',
  updatedAt: '2022-10-16T02:34:57.656Z',
  createdAt: '2022-10-16T02:34:57.656Z',
};
exports.updatedOrderItemKeys = [
  'orderItemId',
  'productId',
  'orderId',
  'price',
  'discountTotal',
  'quantity',
  'total',
  'createdAt',
  'updatedAt',
  'Order',
];

// GUESTS INFO *************************************************************

exports.guest = {
  guestId: '04f060c3-4624-4728-9314-0c8719941851',
  // cartOrderAccessId: '',
  guestName: 'Guest ',
  password: password,
  role: 'guest',
  activeStatus: 'active',
};

exports.guestKeys = [
  'guestId',
  'cartOrderAccessId',
  'guestName',
  'password',
  'role',
  'activeStatus',
  'createdAt',
  'updatedAt',
  'createdBy',
];

// CART ORDER ACCESS INFO *************************************************************

exports.cartOrderAccessKeys = [
  'cartOrderAccessId',
  'customerId',
  'userName',
  'createdAt',
  'updatedAt',
  'Guests',
  'Users',
  'Orders',
  'Carts',
  // 'createdBy',
];

exports.createdCartOrderAccessKeys = [
  'cartOrderAccessId',
  'guestId',
  'guestName',
  'role',
  'activeStatus',
  'password',
  'createdAt',
  'updatedAt',
  'createdBy',
];

// SHIPPING ADDRESS INFO *************************************************************

exports.createdShippingAddress = {
  shippingAddressId: '8463aecf-4268-448f-8cdd-81690bcf77d4',
  userId: 'e857a4a6-b506-4e20-b214-1ce57773bc46',
  street: '666 Hell Pl',
  city: 'Charlotte',
  state: 'NC',
  zipCode: '28977',
  createdAt: '2022-10-26T23:29:26.610Z',
  updatedAt: '2022-10-26T23:29:26.610Z',
};

exports.shippingAddressKeys = [
  'shippingAddressId',
  'userId',
  'street',
  'city',
  'state',
  'zipCode',
  'createdAt',
  'updatedAt',
];

// PRODUCT CARE INFO *************************************************************

exports.productCareKeys = [
  'productCareId',
  'productId',
  'maintenance',
  'specialInstructions',
  'createdAt',
  'updatedAt',
];

// ADMIN INFO *************************************************************

exports.newAdmin = {
  firstName: 'Brad',
  lastName: 'Jacobs',
  role: 'admin',
  email: 'bradjacobs@gmail.com',
  cellPhone: '9878793335',
  password: 'admin1234',
};

exports.adminKeys = [
  'adminId',
  'firstName',
  'lastName',
  'role',
  'email',
  'cellPhone',
  'password',
  'cartOrderAccessId',
  'updatedAt',
  'createdAt',
  'homePhone',
];
