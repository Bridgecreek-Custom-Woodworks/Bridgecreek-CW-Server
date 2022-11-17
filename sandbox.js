const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Generate uuid for seeders
let uuid1 = uuidv4();
let uuid2 = uuidv4();
let uuid3 = uuidv4();

// console.log(uuid1, uuid2, uuid3);

// How generate next day
const date = new Date();
// console.log(date);

const addOneDay = date.setDate(date.getDate() + 1);
// console.log(addOneDay);

const nextDay = new Date(addOneDay);
// console.log(nextDay);

// Verify date is greater than now
// console.log(nextDay > Date.now());

let word = 'pricelte';

// let match = word.match(/\w(gt|gte|lt|lte)\w/);
let match = word.match(/(lte|gte|lt|gt)/);
// console.log(match);
// let newWord = word.replace(match[0], '');
// let newWord = word.replace(/\w(gt|lt)\w/, '');

// console.log(newWord);

if (match) {
  let newWord = word.replace(match[0], '');
  //   console.log(newWord);
}

let query = {};
let include = {};
let Model = {
  associations: {
    Products: 'Products',
    User: 'User',
    Cart: 'Cart',
  },
};

const modelAssociations = Object.keys(Model.associations);
// console.log(modelAssociations);

// let array = ['User', 'Product', 'Cart'];

const shouldInclude = modelAssociations.map((element) => {
  return (include['include'] = [
    {
      model: element,
    },
  ]);
});

// console.log(shouldInclude.flat(1));

query['include'] = shouldInclude.flat(1);

// console.log('query', query);

// console.log('include', include);

//  FUNCTION FOR ADVANCE QUERY SEARCH (STILL NOT FUNCTIONING) ***********************
// let str = JSON.stringify(req.query);
// let match = str.match(/[a-z]*(lte|gte|lt|gt)/i);

// if (match) {
//   return next((query = queryGt_e_Lt_e(query, req.query, match, next)));
// }

// Still working on implementing this. *************
const queryGt_e_Lt_e = (query, reqQuery, match, next) => {
  let queryField;
  let fieldValue;

  // console.log('Match', match);
  // console.log('Query', reqQuery);

  queryField = match[0].replace(match[1], '');

  fieldValue = reqQuery[match[0]];

  if (match[1] === 'gte') {
    console.log('QueryField', queryField);

    return next((query['where'] = { [queryField]: { [Op.gte]: fieldValue } }));
  } else if (match[1] === 'gt') {
    return (query['where'] = { [queryField]: { [Op.gt]: fieldValue } });
  } else if (match[1] === 'lte') {
    return (query['where'] = { [queryField]: { [Op.lte]: fieldValue } });
  } else if (match[1] === 'lt') {
    return (query['where'] = { [queryField]: { [Op.lt]: fieldValue } });
  }
};

// Converting dependency objects into a string
// modelAssociations = JSON.stringify(modelAssociations[0], function (key, value) {
//   return (modelAssociations[value] = value);
// });

let cartArray = [
  (Cart = { activeStatus: 'new' }),
  (Cart = { activeStatus: 'paid' }),
  (Cart = { activeStatus: 'completed' }),
  (Cart = { activeStatus: 'checkout' }),
];

let newArray;
for (let i = 0; i < cartArray.length; i++) {
  if (cartArray[i].activeStatus === 'checkout') {
    newArray = cartArray[i];
    break;
  } else if (cartArray[i].activeStatus === 'new') {
    newArray = cartArray[i];
  }
}

// if (newArray) {
//   console.log('Object has a property');
// }

let uuid4 = uuidv4();
uuid4 = uuid4.split('-');
// console.log(uuid4[1]);

// Paytrace sandbox testing

const fetchData = async () => {
  let access_token;
  let response;
  console.log(process.env.PAYTRACE_USERNAME);
  console.log(process.env.PAYTRACE_PASSWORD);
  console.log(process.env.PAYTRACE_GRANT_TYPE);

  const user = {
    username: process.env.PAYTRACE_USERNAME,
    password: process.env.PAYTRACE_PASSWORD,
    grant_type: process.env.PAYTRACE_GRANT_TYPE,
  };
  let headers = {
    'Access-Control-Allow-Origin': '*',
  };

  try {
    response = await axios.post(
      'https://api.paytrace.com/oauth/token',
      user,
      headers
    );

    access_token = response.data.access_token;
    // console.log(access_token);
  } catch (error) {
    console.log(error.response.headers);
  }

  const fetchSetup = async () => {
    let noData = '';
    let headers = {
      Authorization: `Bearer ${access_token}`,
    };
    let setup = await axios.post(
      'https://api.paytrace.com/v1/payment_fields/token/create',
      noData,
      { headers }
    );
    console.log(setup.data);
  };

  if (response.status === 200) {
    // console.log(response.status);
    // console.log(access_token);
    try {
      const Setup = await fetchSetup();
      // await fetchTransactionRes();
      // console.log(Setup.data.clientKey);
    } catch (error) {
      console.log(error);
    }
  }
  console.log(response.data);
};

// fetchData();

// const fetchTransactionRes = async () => {
//   const cardInfo = {
//     amount: 2.0,
//     credit_card: {
//       number: '	4012000098765439',
//       expiration_month: '	12',
//       expiration_year: '2014',
//     },
//     csc: 999,
//     billing_address: {
//       name: 'Steve Smith',
//       street_address: '8320 E. West St',
//       city: 'Spokane',
//       state: 'WA',
//       zip: '85284',
//     },
//   };

//   let cardResponse = await axios.post(
//     'https://api.paytrace.com/v1/transactions/sale/pt_protect',
//     cardInfo,
//     {
//       Authorization: `Bearer ${access_token}`,
//     }
//   );

//   console.log('Card Response', cardResponse);
// };

let cuttingBoardStripeId = 'price_1Lz3x4EUecojPOrFK3SAJTZf';
let coastersSetStripeId = 'price_1Lz40CEUecojPOrFOklAQz0e';
let cheeseBoardStripeId = 'price_1Lz411EUecojPOrFdOhuTxyq';
let carvingBoardStripeId = 'price_1Lz41vEUecojPOrF6NwtwJKY';
let boardHolderStripeId = 'price_1Lz430EUecojPOrFAuFp0c6f';

let image = Buffer.from(
  fs.readFileSync('./test/test_images/Chopping-board.jpeg')
).toString('base64');

// console.log(' data:image/jpeg;base64,' + image);
