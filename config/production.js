module.exports = {
  // database: {
  //   connectionString: process.env.DB_PRODUCTION_URL,
  //   db: process.env.DB_PRODUCTION_NAME,
  // },
  database: {
    username: process.env.DB_PRODUCTION_USERNAME,
    password: process.env.DB_PRODUCTION_PASSWORD,
    host: process.env.DB_PRODUCTION_HOST,
    port: process.env.DB_PRODUCTION_PORT,
    db: process.env.DB_PRODUCTION_DATABASE,
    dialect: 'postgres',
  },
};
