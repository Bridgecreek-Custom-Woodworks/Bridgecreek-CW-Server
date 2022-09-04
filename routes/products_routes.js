const express = require('express')
const {
  getAllProducts,
  getProduct,
} = require('../controllers/product_controllers')

const { protect } = require('../middleware/auth_middleware')

// Include other resource routers
const productRouter = require('./admin_routes')

const router = express.Router()

// Re-route into other resource routers (routes/admin_route)
router.use('/admin', productRouter)
router.use('/:productId/admin', productRouter)

// Route = /api/v1/products
router.get('/', getAllProducts)
router.get('/:productId', getProduct)

module.exports = router
