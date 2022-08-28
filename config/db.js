const { Sequelize } = require('sequelize')

// SEQUELIZE CONNECTION
const sequelize = new Sequelize(
  'bridgecreek_test',
  'postgres',
  process.env.SQL_PASSWORD,
  {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    logging: false,
  }
)

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log(`Conneted to Sequelize`.cyan.underline.bold)
  } catch (error) {
    console.log(`Unable to connect to PG ${error}`)
  }
}

connectDB()

module.exports = sequelize
