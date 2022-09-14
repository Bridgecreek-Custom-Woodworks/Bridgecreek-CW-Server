const { Sequelize } = require('sequelize');
const config = require('config');
const configuration = config.get('database');

// SEQUELIZE CONNECTION
const sequelize = new Sequelize(
  configuration.db,
  configuration.username,
  process.env.SQL_PASSWORD,
  {
    dialect: configuration.dialect,
    host: configuration.host,
    port: configuration.port,
    logging: configuration.logging,
  }
);

if (configuration.db === 'bridgecreek_dev') {
  console.log(configuration.db.brightWhite.underline.bold);
} else if (configuration.db === 'bridgecreek_test') {
  console.log(configuration.db.blue.underline.bold);
} else if (configuration.db === 'bridgecreek_production') {
  console.log(configuration.db.red.underline.bold);
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Conneted to Sequelize`.cyan.underline.bold);
  } catch (error) {
    console.log(`Unable to connect to PG ${error}`);
  }
};

connectDB();

module.exports = sequelize;
