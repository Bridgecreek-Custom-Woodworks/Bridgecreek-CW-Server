module.exports = {
  database: {
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD,
    db: process.env.DB_TEST_NAME,
    host: process.env.DB_TEST_HOST,
    dialect: 'postgres',
  },
};
