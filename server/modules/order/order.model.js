const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalPrice: Number,
  status: {
    type: String,
    enum: ['pending', 'shipping', 'completed', 'cancelled'],
    default: 'pending'
  },
  address: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);