const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error_middleware');
dotenv.config({ path: './config/config.env' });

// Load env vars
const PORT = process.env.PORT || 5000;

const users = require('./routes/users_routes');
const auth = require('./routes/auth_routes');
const products = require('./routes/products_routes');
const wishlist = require('./routes/wishlist_routes');
const admin = require('./routes/admin_routes');
const reviews = require('./routes/review_routes');
const cart = require('./routes/cart_route');
const cartItem = require('./routes/cartItem_routes');
const orders = require('./routes/orders_routes');
const orderItems = require('./routes/orderItem_routes');
const guests = require('./routes/guest_routes');
const cartOrderAccess = require('./routes/cartOrderAccess_routes');
const shippingAddresses = require('./routes/shippingAddress_routes');
const productCare = require('./routes/productCare_routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Routes
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);
app.use('/api/v1/products', products);
app.use('/api/v1/wishlist', wishlist);
app.use('/api/v1/admin', admin);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/carts', cart);
app.use('/api/v1/cartitems', cartItem);
app.use('/api/v1/orders', orders);
app.use('/api/v1/orderitems', orderItems);
app.use('/api/v1/guests', guests);
app.use('/api/v1/cartorderaccess', cartOrderAccess);
app.use('/api/v1/shippingaddress', shippingAddresses);
app.use('/api/v1/productcare', productCare);

// Errror handling
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(
    `Server is running in: ${process.env.NODE_ENV} mode on port ${PORT}`.gray
      .underline
  )
);

module.exports = app;
