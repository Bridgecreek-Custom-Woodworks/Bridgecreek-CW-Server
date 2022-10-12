const { Op } = require('sequelize');
const User = require('../models/User');
const Carts = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Products = require('../models/Product');
const Reviews = require('../models/Reviews');
const Wishlist = require('../models/Wishlist');
const Orders = require('../models/Order');

const advancedQuerySearch =
  (Model, searchUserInfo) => async (req, res, next) => {
    let query = {};
    query['subQuery'] = true;

    if (searchUserInfo) {
      query['where'] = { userId: req.user.userId };
    }

    let queryField;
    let fieldValue;

    let queryStr = JSON.stringify(req.query);
    let match = queryStr.match(/[a-z]*(lte|gte|lt|gt)/i);

    if (match) {
      queryField = match[0].replace(match[1], '');
      fieldValue = req.query[match[0]];

      if (match[1] === 'gte') {
        query['where'] = { [queryField]: { [Op.gte]: fieldValue } };
      } else if (match[1] === 'gt') {
        query['where'] = { [queryField]: { [Op.gt]: fieldValue } };
      } else if (match[1] === 'lte') {
        query['where'] = { [queryField]: { [Op.lte]: fieldValue } };
      } else if (match[1] === 'lt') {
        query['where'] = { [queryField]: { [Op.lt]: fieldValue } };
      }
    }

    // Coping req.query for the if statement below
    let reqQuery = { ...req.query };

    if (!query.where || !query.where) {
      // Coping req.query for the if statement below
      reqQuery = { ...req.query };

      // Fields to exclude
      const removeFields = [
        'attributes',
        'limit',
        'offset',
        'page',
        'order',
        'include',
      ];

      // Loop over removeFields and delete them from req.query
      removeFields.forEach((param) => delete req.query[param]);
      query['where'] = req.query;
    }

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
    const total = await Model.count();

    // Pagination result
    const pagination = {};

    // Add limit and offset to query being returned for pagination
    if (reqQuery.offset || reqQuery.limit) {
      query.subQuery = false;
      query['offset'] = startIndex;
      query['limit'] = reqQuery.limit ? reqQuery.limit : 10;
    }

    if (reqQuery.include === 'true') {
      query['include'] = { all: true };
    } else if (reqQuery.include === 'nested') {
      query['include'] = { all: true, nested: true };
    }

    if (reqQuery.include && reqQuery.include.startsWith('model')) {
      query['include'] = [];
      const includeArry = reqQuery.include.split(',');

      for (let i = 0; i < includeArry.length; i++) {
        if (includeArry[i] === 'users') {
          query['include'].push({ model: User });
        } else if (includeArry[i] === 'carts') {
          query['include'].push({ model: Carts });
        } else if (includeArry[i] === 'cartitems') {
          query['include'].push({ model: CartItem });
        } else if (includeArry[i] === 'products') {
          query['include'].push({ model: Products });
        } else if (includeArry[i] === 'reviews') {
          query['include'].push({ model: Reviews });
        } else if (includeArry[i] === 'wishlist') {
          query['include'].push({ model: Wishlist });
        } else if (includeArry[i] === 'orders') {
          query['include'].push({ model: Orders });
        }
      }
    }

    query = Model.findAll(query);

    const results = await query;

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

    let modelAssociations = Object.keys(Model.associations);

    res.advancedQuerySearch = {
      success: true,
      count: results.length,
      pagination,
      data: results,
      modelAssociations,
    };

    next();
  };

module.exports = advancedQuerySearch;
