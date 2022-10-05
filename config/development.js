module.exports = {
  database: {
    username: process.env.DB_DEVELOPMENT_USERNAME,
    password: process.env.DB_DEVELOPMENT_PASSWORD,
    db: process.env.DB_DEVELOPMENT_NAME,
    host: process.env.DB_DEVELOPMENT_HOST,
    dialect: 'postgres',
  },
};
