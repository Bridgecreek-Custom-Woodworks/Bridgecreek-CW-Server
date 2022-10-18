const express = require('express');
const {
  getUser,
  registerUser,
  updateUser,
  deleteUser,
} = require('../controllers/user_controller');

const { protect } = require('../middleware/auth_middleware');
const advancedQuerySearch = require('../middleware/advancedQuerySearch');

const Users = require('../models/User');

const userRouter = require('./admin_routes');

const router = express.Router();

// Re-route into other resource routers (routes/admin_route)
router.use('/admin', userRouter);

// Route = /api/v1/users
router.get('/getme', protect(Users), advancedQuerySearch(Users, true), getUser);
router.post('/', registerUser);
router.put('/updateme', protect(Users), updateUser);
router.delete('/deleteme', protect(Users), deleteUser);

module.exports = router;
