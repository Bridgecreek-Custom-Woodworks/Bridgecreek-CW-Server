const { Op } = require('sequelize');

const advancedQuerySearch = (model) => async (req, res, next) => {
  let query = {};
  query['subQuery'] = true;

  const { pricegte, pricelte, weightgte, weightlte } = req.query;

  if (pricegte || pricelte || weightgte || weightlte) {
    const { pricegte, pricelte, weightgte, weightlte } = req.query;
    if (pricegte) {
      query['where'] = { price: { [Op.gte]: pricegte } };
    }
    if (pricelte) {
      query['where'] = { price: { [Op.lte]: pricelte } };
    }
    if (weightgte) {
      query['where'] = { weight: { [Op.gte]: weightgte } };
    }
    if (weightlte) {
      query['where'] = { weight: { [Op.lte]: weightlte } };
    }
  }

  // Coping req.query for the if statement below
  let reqQuery = { ...req.query };

  if (!query.where || !query.where) {
    // Coping req.query for the if statement below
    reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['attributes', 'limit', 'offset', 'page', 'order'];

    // Loop over removeFields and delete them from req.query
    removeFields.forEach((param) => delete req.query[param]);
    query['where'] = req.query;
  }

  //   query['where'] = { [Op.and]: [{ lastName: 'Body' }, { zipCode: '28217' }] };

  if (reqQuery.attributes) {
    // Turn attributes values from string into array
    const attributesArr = reqQuery.attributes[0].split(',');
    query['attributes'] = attributesArr;
  }

  if (reqQuery.order) {
    // Turn order values from string into array
    const orderArr = reqQuery.order[0].split(',');
    query['order'] = [[orderArr]];
  }

  // Pagination
  const page = parseInt(reqQuery.page, 10) || 1;
  const limit = parseInt(reqQuery.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.count();

  // Pagination result
  const pagination = {};

  // Add limit and offset to query being returned for pagination\
  if (reqQuery.offset || reqQuery.limit) {
    query.subQuery = false;
    query['offset'] = startIndex;
    query['limit'] = reqQuery.limit ? reqQuery.limit : 10;
  }

  console.log(query);
  query = model.findAll(query);

  const results = await query; // <== products will need to be turned into results to make this more reusable

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedQuerySearch = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedQuerySearch;
