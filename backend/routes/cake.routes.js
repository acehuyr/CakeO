const router = require('express').Router();
const { getAllCakes, getCakeById, createCake, updateCake, deleteCake } = require('../controllers/cakeController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/', getAllCakes);
router.get('/:id', getCakeById);
router.post('/', protect, adminOnly, createCake);
router.put('/:id', protect, adminOnly, updateCake);
router.delete('/:id', protect, adminOnly, deleteCake);

module.exports = router;
