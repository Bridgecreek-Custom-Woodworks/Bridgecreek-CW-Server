const { Sequelize } = require('sequelize');
const config = require('config');
const configuration = config.get('database');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

console.log('config ==>', configuration.db);
console.log('node_env ==>', process.env.NODE_ENV);
// SEQUELIZE CONNECTION
let sequelize;
if (
  configuration.db === 'bridgecreek_dev' ||
  configuration.db === 'bridgecreek_test'
) {
  sequelize = new Sequelize(
    configuration.db,
    configuration.username,
    configuration.password,
    {
      dialect: configuration.dialect,
      host: configuration.host,
      logging: false,
    }
  );
} else if (process.env.NODE_ENV === 'production') {
  // sequelize = new Sequelize(configuration.connectionString);
  sequelize = new Sequelize(
    configuration.db,
    configuration.username,
    configuration.password,
    {
      dialect: configuration.dialect,
      host: configuration.host,
      port: configuration.port,
      logging: false,
    }
  );
}

if (configuration.db === 'bridgecreek_dev') {
  console.log(configuration.db.brightWhite.underline.bold);
} else if (configuration.db === 'bridgecreek_test') {
  console.log(configuration.db.blue.underline.bold);
} else if (configuration.db === 'bridgecreek_production') {
  console.log(configuration.db.red.underline.bold);
}

// console.log(sequelize);

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
