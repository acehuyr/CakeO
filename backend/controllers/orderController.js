const Order = require('../models/Order');
const User = require('../models/User');

exports.createOrder = async (req, res) => {
  try {
    const { items, subtotal, deliveryFee, tax, total, deliveryAddress, paymentMethod } = req.body;
    const order = await Order.create({
      user: req.user._id,
      items, subtotal, deliveryFee, tax, total, deliveryAddress, paymentMethod,
      status: 0,
      statusHistory: [{ status: 0, note: 'Order received' }],
      estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000)
    });

    await User.findByIdAndUpdate(req.user._id, { $push: { orders: order._id } });

    // Populate cake info for the response
    const populatedOrder = await Order.findById(order._id)
      .populate('items.cake', 'name image price sizes');

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.to(`order_${order._id}`).emit('order_status', { orderId: order._id, status: order.status });
      io.emit('admin_new_order', populatedOrder);
    }

    res.status(201).json({ status: 'success', data: populatedOrder });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.cake', 'name image price sizes')
      .sort('-createdAt');
    res.json({ status: 'success', count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body; // status is a number 0-3
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, $push: { statusHistory: { status, note: note || `Status updated to ${status}` } } },
      { new: true }
    ).populate('user', 'name email').populate('items.cake', 'name');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`order_${order._id}`).emit('order_status', { orderId: order._id, status });
      io.emit('admin_update_order', order);
    }

    res.json({ status: 'success', data: order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.cake', 'name image price sizes')
      .sort('-createdAt');
    res.json({ status: 'success', count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
