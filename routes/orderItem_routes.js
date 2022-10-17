const express = require('express');
const {
  getOrderItem,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} = require('../controllers/orderItem_controller');

const { protect } = require('../middleware/auth_middleware');

const router = express.Router();

// Route = '/api/v1/orderitems'

router.get('/getorderitem/:orderItemId', protect, getOrderItem);
router.post('/', protect, createOrderItem);
router.put('/update/:orderitemId', protect, updateOrderItem);
router.delete('/delete/:orderitemId', protect, deleteOrderItem);

module.exports = router;
