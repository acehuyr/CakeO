const Review = require('../models/Review');
const Order = require('../models/Order');

exports.getReviewsByCake = async (req, res) => {
  try {
    const reviews = await Review.find({ cake: req.params.cakeId }).sort('-createdAt');
    res.json({ status: 'success', count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Optional: check if user bought the cake
    const hasBought = await Order.findOne({ user: req.user._id, 'items.cake': req.params.cakeId });

    const review = await Review.create({
      user: req.user._id,
      userName: req.user.name,
      cake: req.params.cakeId,
      rating,
      comment,
      verified: !!hasBought
    });
    res.status(201).json({ status: 'success', data: review });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ message: 'Review not found or unauthorized' });
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
