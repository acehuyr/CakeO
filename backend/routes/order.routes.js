const router = require('express').Router();
const { createOrder, getMyOrders, updateOrderStatus, getAllOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.use(protect);
router.post('/', createOrder);
router.get('/mine', getMyOrders);
router.get('/all', adminOnly, getAllOrders);
router.put('/:id/status', adminOnly, updateOrderStatus);

module.exports = router;
