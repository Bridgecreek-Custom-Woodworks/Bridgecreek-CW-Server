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
console.log(modelAssociations);

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

console.log('query', query);

// console.log('include', include);

// Working Advanced Query Search Function *************************************

// const { Op } = require('sequelize');

// const advancedQuerySearch = (model) => async (req, res, next) => {
//   let query = {};
//   query['subQuery'] = true;

//   let str = JSON.stringify(req.query);
//   let match = str.match(/[a-z]*(lte|gte|lt|gt)/i);
//   console.log('Match ==>', match[0]);
//   console.log('Match Array ==>', match);
//   let newWord = match[0].replace(match[1], '');
//   console.log('New Word', newWord);

//   let symbol = [Op.gte];
//   let checkOp = symbol;

//   console.log(checkOp);

//   const {
//     pricegte,
//     pricelte,
//     weightgte,
//     weightlte,
//     ratinggte,
//     ratinglte,
//     avgRatinggte,
//     avgRatinglte,
//     totalgte,
//     totallte,
//   } = req.query;

//   if (
//     pricegte ||
//     pricelte ||
//     weightgte ||
//     weightlte ||
//     ratinggte ||
//     ratinglte ||
//     avgRatinggte ||
//     avgRatinglte ||
//     totalgte ||
//     totallte ||
//     newWord
//   ) {
//     const {
//       pricegte,
//       pricelte,
//       weightgte,
//       weightlte,
//       ratinggte,
//       ratinglte,
//       avgRatinggte,
//       avgRatinglte,
//       totalgte,
//       totallte,
//     } = req.query;

//     if (pricegte) {
//       query['where'] = { price: { [Op.gte]: pricegte } };
//     }
//     if (pricelte) {
//       query['where'] = { price: { [Op.lte]: pricelte } };
//     }
//     if (weightgte) {
//       query['where'] = { weight: { [Op.gte]: weightgte } };
//     }
//     if (weightlte) {
//       query['where'] = { weight: { [Op.lte]: weightlte } };
//     }
//     if (ratinggte) {
//       query['where'] = { rating: { [Op.gte]: ratinggte } };
//     }
//     if (ratinglte) {
//       query['where'] = { rating: { [Op.lte]: ratinglte } };
//     }
//     if (avgRatinggte) {
//       query['where'] = { avgRating: { [Op.gte]: avgRatinggte } };
//     }
//     if (avgRatinglte) {
//       query['where'] = { avgRating: { [Op.lte]: avgRatinglte } };
//     }
//     if (totalgte) {
//       query['where'] = { total: { [Op.gte]: totalgte } };
//     }
//     if (totallte) {
//       query['where'] = { total: { [Op.lte]: totallte } };
//     }
//   }

//   // REMOVE AFTER TESTING **************
//   // console.log(model.associations);
//   // const asscArray = Object.values(model.associations);
//   // console.log(asscArray);
//   // const wishlist = asscArray.pop();

//   // Coping req.query for the if statement below
//   let reqQuery = { ...req.query };

//   if (!query.where || !query.where) {
//     // Coping req.query for the if statement below
//     reqQuery = { ...req.query };

//     // Fields to exclude
//     const removeFields = [
//       'attributes',
//       'limit',
//       'offset',
//       'page',
//       'order',
//       'include',
//     ];

//     // Loop over removeFields and delete them from req.query
//     removeFields.forEach((param) => delete req.query[param]);
//     query['where'] = req.query;
//   }

//   if (reqQuery.attributes) {
//     // Turn attributes values from string into array
//     const attributesArr = reqQuery.attributes[0].split(',');
//     query['attributes'] = attributesArr;
//   }

//   if (reqQuery.order) {
//     // Turn order values from string into array
//     const orderArr = reqQuery.order[0].split(',');
//     query['order'] = [[orderArr]];
//   }

//   // Pagination
//   const page = parseInt(reqQuery.page, 10) || 1;
//   const limit = parseInt(reqQuery.limit, 10) || 10;
//   const startIndex = (page - 1) * limit;
//   const endIndex = page * limit;
//   const total = await model.count();

//   // Pagination result
//   const pagination = {};

//   // Add limit and offset to query being returned for pagination\
//   if (reqQuery.offset || reqQuery.limit) {
//     query.subQuery = false;
//     query['offset'] = startIndex;
//     query['limit'] = reqQuery.limit ? reqQuery.limit : 10;
//   }

//   if (reqQuery.include) {
//     query['include'] = { all: true };
//   }

//   query = model.findAll(query);

//   const results = await query;

//   if (endIndex < total) {
//     pagination.next = {
//       page: page + 1,
//       limit,
//     };
//   }

//   if (startIndex > 0) {
//     pagination.prev = {
//       page: page - 1,
//       limit,
//     };
//   }

//   res.advancedQuerySearch = {
//     success: true,
//     count: results.length,
//     pagination,
//     data: results,
//   };

//   next();
// };

// module.exports = advancedQuerySearch;
