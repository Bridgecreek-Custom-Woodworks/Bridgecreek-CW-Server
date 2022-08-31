const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/error_middleware')
dotenv.config({ path: './config/config.env' })
require('./config/db')

// Load env vars
const PORT = process.env.PORT || 5000

const users = require('./routes/users_routes')
const auth = require('./routes/auth_routes')

const app = express()

app.use(express.json())

// Cookie parser
app.use(cookieParser())

app.use('/api/v1/users', users)
app.use('/api/v1/auth', auth)

app.use(errorHandler)

app.listen(PORT, () =>
  console.log(
    `Server is running on ${process.env.NODE_ENV} mode on port ${PORT}`.gray
      .underline
  )
)
