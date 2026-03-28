const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  category: {
    type: String,
    enum: ['Chocolate', 'Classic', 'Fruit', 'Caramel', 'Fusion', 'Custom'],
    required: true
  },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  badge: { type: String, default: '' },
  badgeColor: { type: String, default: '' },
  prepTime: { type: String },
  calories: { type: String },
  isAvailable: { type: Boolean, default: true },
  sizes: {
    small:  { type: Number, required: true },
    medium: { type: Number, required: true },
    large:  { type: Number, required: true }
  },
  flavors: [{ type: String }],
  ingredients: [{ type: String }],
  allergens: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

cakeSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Cake', cakeSchema);
