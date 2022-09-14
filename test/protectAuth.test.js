const expect = require('chai').expect;
// const dotenv = require('dotenv');
// dotenv.config({ path: './config/config.env' });
// const colors = require('colors');
// const Sequelize = require('sequelize');
// const sequelize = require('../config/db');
// const Users = require('../models/User');

const { protect } = require('../middleware/auth_middleware');

describe('Auth User login', () => {
  it('should throw an error if no authorization header is present', function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };

    expect(protect.bind(this, req, {}, () => {})).to.throw(
      'Not authorized to access this route'
    );
  });
});
