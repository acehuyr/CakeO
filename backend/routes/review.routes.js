const router = require('express').Router();
const { getReviewsByCake, createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/:cakeId', getReviewsByCake);
router.post('/:cakeId', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
