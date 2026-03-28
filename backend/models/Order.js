const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  cake: { type: mongoose.Schema.Types.ObjectId, ref: 'Cake', required: true },
  name: String,
  image: String,
  price: Number,
  size: { type: String, enum: ['small', 'medium', 'large'] },
  flavor: String,
  message: { type: String, default: '' },
  qty: { type: Number, required: true, min: 1 }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 79 },
  tax: { type: Number },
  total: { type: Number, required: true },
  status: {
    type: Number,
    default: 0 // 0: Confirmed, 1: Preparing, 2: Out for Delivery, 3: Delivered
  },
  statusHistory: [{
    status: Number,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  deliveryAddress: {
    name: String,
    phone: String,
    line1: String,
    city: String,
    pincode: String,
    notes: String
  },
  paymentMethod: { type: String, enum: ['card', 'upi', 'cod'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  estimatedDelivery: Date,
  promoCode: String,
  discount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
