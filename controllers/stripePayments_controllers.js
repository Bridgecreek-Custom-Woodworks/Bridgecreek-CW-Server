const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async_middleware');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const stripe = require('stripe')(process.env.STRIP_SECRET_TEST_KEY);

// @desc Post payment to stripe
// @route POST /api/v1/stripe/checkout
// access Private
exports.createPayment = asyncHandler(async (req, res, next) => {
  const orderId = req.body.orderId;
  const cartId = req.body.cartId;
  const items = req.body.items;
  let lineItems = [];

  items.forEach((item) => {
    lineItems.push({
      price: item.id,
      quantity: item.quantity,
    });
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    shipping_address_collection: {
      allowed_countries: ['US'],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0,
            currency: 'usd',
          },
          display_name: 'Free shipping',
          tax_behavior: 'exclusive',

          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 5,
            },
            maximum: {
              unit: 'business_day',
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 1500,
            currency: 'usd',
          },
          display_name: 'Next day air',
          tax_behavior: 'exclusive',

          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 1,
            },
            maximum: {
              unit: 'business_day',
              value: 1,
            },
          },
        },
      },
    ],
    line_items: lineItems,
    mode: 'payment',

    // discounts: [
    //   {
    //     coupon: 'RAvZz0yr',
    //   },
    // ],
    success_url: `http://localhost:3000/success/${orderId}/${cartId}`,
    cancel_url: 'http://localhost:3000/cancel',
    automatic_tax: {
      enabled: true,
    },
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

exports.updateOrderHook = asyncHandler(async (req, res, next) => {
  let endpointSecret;
  const sig = req.headers['stripe-signature'];

  endpointSecret = process.env.STRIPE_WEB_HOOK_SECRET;

  if (endpointSecret) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // This is what verifies that the payment was successful and is authentic from stripe
    if (event.type === 'checkout.session.completed') {
      console.log('Payment was successful');

      // You can call your model order here to update the current customer order
      const session = event.data.object;

      // You can put this in a variable and use to find and update the correct order
      console.log(session.success_url.split('/')[4]);
    }
  } else {
    return console.log('There was an error');
  }

  res.send().end();
  //   res.status(200).json({ message: 'Youre hooked!!' });
});
