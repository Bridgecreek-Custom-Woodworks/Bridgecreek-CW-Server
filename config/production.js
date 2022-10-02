module.exports = {
  database: {
    username: process.env.DB_PRODUCTION_USERNAME,
    password: process.env.DB_PRODUCTION_PASSWORD,
    db: process.env.DB_PRODUCTION_NAME,
    host: process.env.DB_PRODUCTION_HOST,
    dialect: 'postgres',
  },
};
