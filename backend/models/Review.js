const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cake: { type: mongoose.Schema.Types.ObjectId, ref: 'Cake', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
  images: [{ type: String }],
  helpful: { type: Number, default: 0 },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

// reviewSchema.index({ cake: 1, user: 1 }, { unique: true });

// Update cake's average rating after review save
reviewSchema.post('save', async function () {
  const Cake = mongoose.model('Cake');
  const Review = this.constructor;
  const stats = await Review.aggregate([
    { $match: { cake: this.cake } },
    { $group: { _id: '$cake', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (stats.length > 0) {
    await Cake.findByIdAndUpdate(this.cake, {
      rating: Math.round(stats[0].avg * 10) / 10,
      reviewCount: stats[0].count
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
