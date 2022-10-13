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

  console.log('Match', match);
  console.log('Query', reqQuery);

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
  (Cart = { activeStatus: 'New' }),
  (Cart = { activeStatus: 'Paid' }),
  (Cart = { activeStatus: 'Completed' }),
  (Cart = { activeStatus: 'Checkout' }),
];

let newArray;
for (let i = 0; i < cartArray.length; i++) {
  if (cartArray[i].activeStatus === 'Checkout') {
    newArray = cartArray[i];
    break;
  } else if (cartArray[i].activeStatus === 'New') {
    newArray = cartArray[i];
  }
}

if (newArray) {
  console.log('Object has a property');
}
