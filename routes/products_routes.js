const express = require('express')
const router = express.Router()
const {
  getAllProducts,
  getProduct,
  createProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/product_controllers')

const { protect } = require('../middleware/auth_middleware')

router.get('/', getAllProducts)
router.get('/:productId', getProduct)
router.post('/', protect, createProducts)
router.put('/:productId', protect, updateProduct)
router.delete('/:productId', protect, deleteProduct)

module.exports = router
