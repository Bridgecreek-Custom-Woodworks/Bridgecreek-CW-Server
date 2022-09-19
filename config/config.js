const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' }),
  (module.exports = {
    test: {
      username: process.env.DB_TEST_USERNAME,
      password: process.env.DB_TEST_PASSWORD,
      database: process.env.DB_TEST_NAME,
      host: process.env.DB_TEST_HOST,
      dialect: 'postgres',
    },
    development: {
      username: process.env.DB_DEVELOPMENT_USERNAME,
      password: process.env.DB_DEVELOPMENT_PASSWORD,
      database: process.env.DB_DEVELOPMENT_NAME,
      host: process.env.DB_DEVELOPMENT_HOST,
      dialect: 'postgres',
    },
    production: {
      username: process.env.DB_TEST_USERNAME,
      password: process.env.DB_TEST_PASSWORD,
      database: process.env.DB_TEST_NAME,
      host: process.env.DB_TEST_HOST,
      dialect: 'postgres',
    },
  });
