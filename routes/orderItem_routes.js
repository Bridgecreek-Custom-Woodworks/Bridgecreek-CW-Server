const express = require('express');
const {
  getOrderItem,
  createOrderItem,
} = require('../controllers/orderItem_controller');

const { protect } = require('../middleware/auth_middleware');

const router = express.Router();

// Route = '/api/v1/orderitems'

router.get('/getorderitem/:orderItemId', protect, getOrderItem);

router.post('/', protect, createOrderItem);

module.exports = router;
